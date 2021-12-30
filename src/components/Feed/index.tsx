import { FC, Key, useEffect, useState } from "react";

// util function to get window width for drawer
import { useWindowDimensions } from "../../utils/windowDimensions";

import DrawerContent from "../DrawerContent";

import { Button, Card, Col, Drawer, Image, Input, Row, Spin } from "antd";

import { RedditAllPosts, RedditPostsMap, RedditSinglePost } from "../types";
import { getSub } from "../../utils/getsub";
import { readHistory } from "../../utils/readHistory";

// Component: Feed - Loads data from reddit API and displays thumbnails of posts from r/pics.
// Selecting a thumbnail will open a drawer with the full image and details.
const Feed: FC = () => {
  const [posts, setPosts] = useState<RedditAllPosts | null>(null);

  const [postData, setPostData] = useState<RedditSinglePost | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [value, setValue] = useState<string>("pics");
  const [history, setHistory] = useState<string[]>([]);
  const { width } = useWindowDimensions();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function addHistory(event: any, value: string) {
    event.preventDefault();
    try {
      const history = await readHistory();
      if (!history) {
        localStorage.setItem("history", JSON.stringify([value]));
        setHistory([value]);
      } else {
        const newHistory = [value, ...history];
        localStorage.setItem("history", JSON.stringify(newHistory));
        if (!history.includes(value)) {
          setHistory(newHistory);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      handleSearch();
    }
  }
  // Loads data from reddit API in r/pics.
  async function handleSearch() {
    setLoading(true);
    try {
      const history = await readHistory();

      const runSearch = (sub: string) =>
        getSub(sub)
          .then((json) => setPosts(json))
          .then(() => setLoading(false))
          .catch((error) => {
            throw error;
          });

      if (!history) {
        runSearch("pics");
        setValue("pics");
      } else {
        runSearch(history[0]);
        setValue(history[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleSearch();
  }, []);

  // sets drawer state to closed when exited
  const onClose = () => setIsOpen(false);

  // Render Spinner while loading data
  return loading ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Row style={{ margin: "15% auto" }}>
        <Col>
          <div>
            <Spin size='large' />
          </div>
        </Col>
      </Row>
    </div>
  ) : (
    <>
      <Drawer
        title={postData?.title ?? "No Title"}
        placement='right'
        onClose={onClose}
        visible={isOpen}
        width={width > 600 ? 600 : 360}
        headerStyle={{ textAlign: "center", padding: "2rem" }}
      >
        <DrawerContent {...postData} />
      </Drawer>
      <Row align='middle' justify='end' gutter={[16, 16]}>
        <Col>
          <Row align='middle'>
            <Col>
              {history.map((sub: string) => (
                <Button
                  style={{ textDecoration: "underline" }}
                  type='link'
                  key={sub}
                  onClick={(event) => addHistory(event, sub)}
                >
                  <em>{sub}</em>
                </Button>
              ))}
            </Col>
            <Col>
              <Input.Search
                addonBefore={"r/"}
                defaultValue={value}
                onChange={(event) => setValue(event.target.value)}
                onSearch={(value, event) => addHistory(event, value)}
              />
            </Col>
            <Col>
              <Button
                onClick={() => [localStorage.removeItem("history"), handleSearch(), setHistory([])]}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[16, 16]} justify='space-between' align='stretch'>
        {posts?.data.children.map(
          (post: RedditPostsMap, index: Key | null | undefined) =>
            post.data.url?.includes("https://i.") && (
              <Col key={index}>
                <Card
                  hoverable
                  bordered={false}
                  cover={
                    <Image
                      alt={post.data.title}
                      src={post.data.url}
                      preview={false}
                      className='search-card-image'
                    />
                  }
                  onClick={() => {
                    setIsOpen(true);
                    setPostData(post.data);
                  }}
                  className='search-card'
                >
                  <Card.Meta title={post.data.title} description={post.data.author} />
                </Card>
              </Col>
            )
        )}
      </Row>
    </>
  );
};

export default Feed;
