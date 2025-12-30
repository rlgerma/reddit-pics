import { FC, Key, useCallback, useEffect, useRef, useState } from 'react';

// util function to get window width for drawer
import { useWindowDimensions } from '../../utils/windowDimensions';

import DrawerContent from '../DrawerContent';

import {
  AutoComplete,
  Button,
  Card,
  Col,
  Drawer,
  Image,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Result,
  Row,
  Spin,
  Switch,
  type AutoCompleteProps,
} from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

import list from '../../utils/convertedlist.json';
import { RedditAllPosts, RedditPostsMap, RedditSinglePost } from '../types';
import { getSub } from '../../utils/getsub';
import { readStorage } from '../../utils/read';
import { addFavorite, removeFavorite, isFavorite } from '../../utils/favorites';

// Component: Feed - Loads data from reddit API and displays thumbnails of posts from r/pics.
// Selecting a thumbnail will open a drawer with the full image and details.
const Feed: FC = () => {
  const [posts, setPosts] = useState<RedditAllPosts | undefined>(undefined);
  const [postData, setPostData] = useState<RedditSinglePost | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<'hot' | 'new' | 'top' | 'rising' | 'controversial'>();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<boolean>(true);
  const [value, setValue] = useState<string>('pics');
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoriteUpdates, setFavoriteUpdates] = useState(0);
  const { width } = useWindowDimensions();
  const observerTarget = useRef<HTMLDivElement>(null);

  async function addHistory(
    event:
      | React.MouseEvent<HTMLElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
      | undefined,
    value: string
  ) {
    if (event) event.preventDefault();
    try {
      if (value === '') return;
      const history = await readStorage('history');
      if (!history) {
        localStorage.setItem('history', JSON.stringify([value]));
        setHistory([value]);
      } else {
        const newHistory = [value, ...history];
        localStorage.setItem('history', JSON.stringify(newHistory));
        if (!history.includes(value)) {
          setHistory(newHistory);
        }
      }
      handleSearch(value);
    } catch (error) {
      console.error(error);
    }
  }

  // Loads data from reddit API in r/pics.
  const handleSearch = useCallback(
    async (customSub?: string, customSort?: typeof sort) => {
      try {
        setLoading(true);
        const history = await readStorage('history');
        const sortToUse = customSort || sort || 'hot';

        const runSearch = async (sub: string) => {
          const json = await getSub(sub, sortToUse);
          setPosts(json);
          setAfter(json?.data?.after);
        };
        if (!sort) setSort('hot');

        const subToUse = customSub || (history ? history[0] : 'pics');
        runSearch(subToUse);
        setValue(subToUse);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [sort]
  );

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Load more posts for infinite scroll
  const loadMorePosts = useCallback(async () => {
    if (!after || loadingMore || loading) return;

    try {
      setLoadingMore(true);
      const sortToUse = sort || 'hot';
      const json = await getSub(value, sortToUse, after);

      if (json?.data?.children) {
        setPosts((prevPosts) => ({
          data: {
            after: json.data.after,
            children: [...(prevPosts?.data?.children || []), ...json.data.children],
          },
        }));
        setAfter(json.data.after);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  }, [after, loadingMore, loading, sort, value]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && after && !loadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMorePosts, after, loadingMore]);

  const getPanelValue = (searchText: string) => {
    const suggestions = list;

    return suggestions
      .filter((item: { name: string; nsfw: boolean }) =>
        filter
          ? item?.name?.toLowerCase().startsWith(searchText.toLowerCase()) && !item?.nsfw
          : item?.name?.toLowerCase().startsWith(searchText.toLowerCase())
      )
      .map((item) => ({ label: item.nsfw ? item.name + ' 🔞' : item.name, value: item.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  const onSelect = (data: string) => {
    setValue(data);
    setOptions([]);
    addHistory(undefined, data);
  };

  // sets drawer state to closed when exited
  const onClose = () => setIsOpen(false);

  const handleSortChange = (event: RadioChangeEvent) => {
    const newSort = event.target.value;
    setSort(newSort);
    if (value !== '') {
      addHistory(undefined, value);
    }
  };

  const toggleFilter = () => {
    setOptions([]);
    setFilter(!filter);
    if (filter) setIsModalOpen(true);
  };

  const handleOk = () => {
    localStorage.removeItem('history');
    handleSearch();
    setHistory([]);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setFilter(!filter);
    setIsModalOpen(false);
  };

  const handleToggleFavorite = (post: RedditSinglePost, event: React.MouseEvent) => {
    event.stopPropagation();
    const postId = post.url || `${post.author}-${post.created_utc}`;

    if (isFavorite(postId)) {
      removeFavorite(postId);
    } else {
      addFavorite(post);
    }
    setFavoriteUpdates((prev) => prev + 1);
  };

  // Render Spinner while loading data
  return loading ? (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Row style={{ margin: '15% auto' }}>
        <Col>
          <div>
            <Spin size="large" />
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    <>
      <Drawer
        title={postData?.title ?? 'No Title'}
        placement="right"
        onClose={onClose}
        open={isOpen}
        width={width > 600 ? 600 : 360}
        headerStyle={{ textAlign: 'center', padding: '2rem' }}
      >
        <DrawerContent {...postData} />
      </Drawer>
      <Row align="middle" justify="end" gutter={[16, 16]}>
        <Col>
          <Row align="middle">
            <Col style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '0 1rem 1rem' }}>
              <AutoComplete
                options={options}
                style={{ width: 400 }}
                onSelect={onSelect}
                onSearch={(text) => setOptions(getPanelValue(text))}
                defaultValue={value}
              >
                <Input.Search
                  addonBefore={'r/'}
                  defaultValue={value}
                  onChange={(event) => setValue(event.target.value)}
                  onPressEnter={(event) => addHistory(event, value)}
                  onSearch={(value, event) => addHistory(event, value)}
                />
              </AutoComplete>
            </Col>
          </Row>
          <Row align="middle" justify="center" style={{ padding: '0 1rem', marginBottom: '1rem' }}>
            <Col>
              <Radio.Group
                value={sort}
                buttonStyle="solid"
                size={width >= 600 ? 'middle' : 'small'}
                onChange={handleSortChange}
              >
                <Radio.Button value="hot">Hot</Radio.Button>
                <Radio.Button value="new">New</Radio.Button>
                <Radio.Button value="top">Top</Radio.Button>
                <Radio.Button value="rising">Rising</Radio.Button>
                <Radio.Button value="controversial">Controversial</Radio.Button>
              </Radio.Group>
            </Col>
            <Col style={{ padding: '0 1rem', marginTop: width <= 600 ? '1rem' : '0' }}>
              <Switch checkedChildren="NSFW" unCheckedChildren="SFW" onChange={toggleFilter} checked={!filter} />
            </Col>
          </Row>
          <Row
            align="middle"
            justify={width >= 600 ? 'end' : 'center'}
            style={{ padding: '0 1rem', marginBottom: '1rem', textAlign: 'center' }}
          >
            <Col>
              {history.map((sub: string) => (
                <Button
                  style={{ textDecoration: 'underline' }}
                  type="link"
                  key={sub}
                  onClick={(event) => addHistory(event, sub)}
                >
                  <em>{sub}</em>
                </Button>
              ))}
              {width <= 600 && <br />}
              {history.length >= 1 && (
                <Button
                  style={{ textDecoration: 'underline' }}
                  type="link"
                  onClick={() => [localStorage.removeItem('history'), handleSearch(), setHistory([]), setOptions([])]}
                >
                  Clear All
                </Button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row
        gutter={[16, 16]}
        justify={posts?.data?.children ? 'space-between' : 'center'}
        align={posts?.data?.children ? 'stretch' : 'middle'}
        className="feed-row"
      >
        {posts?.data?.children ? (
          posts?.data?.children.map(
            (post: RedditPostsMap, index: Key | null | undefined) =>
              post.data.url?.includes('https://i.') && (
                <Col key={index} md={6} xs={20}>
                  <Card
                    hoverable
                    bordered={false}
                    cover={
                      <Image alt={post.data.title} src={post.data.url} preview={false} className="search-card-image" />
                    }
                    onClick={() => {
                      setIsOpen(true);
                      setPostData(post.data);
                    }}
                    className="search-card"
                    style={{ position: 'relative' }}
                  >
                    <Card.Meta title={post.data.title} description={post.data.author} />
                    <Button
                      type="text"
                      shape="circle"
                      icon={
                        isFavorite(post.data.url || `${post.data.author}-${post.data.created_utc}`) ? (
                          <HeartFilled style={{ fontSize: '20px', color: '#ff4d4f' }} />
                        ) : (
                          <HeartOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
                        )
                      }
                      onClick={(e) => handleToggleFavorite(post.data, e)}
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                      }}
                    />
                  </Card>
                </Col>
              )
          )
        ) : (
          <Col
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Result
              icon={<span style={{ fontSize: '48px' }}>(╯°□°）╯︵ ┻━┻</span>}
              title="No Images Found!"
              extra={
                <a
                  href={`https://www.reddit.com/r/${value}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#FE4600', textDecoration: 'underline' }}
                >
                  Does the subbreddit exist?
                </a>
              }
            />
          </Col>
        )}
      </Row>
      {posts?.data?.children && after && (
        <Row justify="center" style={{ padding: '2rem 0' }}>
          <Col>{loadingMore ? <Spin size="large" /> : <div ref={observerTarget} style={{ height: '20px' }} />}</Col>
        </Row>
      )}
      <Modal
        open={isModalOpen}
        closable={false}
        cancelButtonProps={{
          style: {
            display: 'none',
          },
        }}
        okButtonProps={{
          style: {
            display: 'none',
          },
        }}
        centered
      >
        <Result
          title="Are you 18 or older?"
          subTitle="Reddit may contain content only suitable for adults."
          extra={[
            <Button size="large" key="cancel" onClick={handleCancel}>
              No
            </Button>,
            <Button size="large" type="primary" key="confirm" onClick={handleOk}>
              Yes
            </Button>,
          ]}
        />
      </Modal>
    </>
  );
};

export default Feed;
