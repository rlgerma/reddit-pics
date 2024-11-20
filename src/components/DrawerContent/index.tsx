import { useEffect, useState } from 'react';

import { DescriptionItem } from './DescriptionItem';
import { CommentsSection } from './CommentsSection';

import CountUp from 'react-countup';
import dayjs from 'dayjs';

import { Badge, Col, Divider, Image, Row, Skeleton } from 'antd';

import { ArrowUpOutlined } from '@ant-design/icons';
import { RedditSinglePost, RedditSinglePostComments } from '../types';

// Component: DrawerContent - Loads details of a post selected in parent component: 'Feed'.
// An additional fetch request is made to get the comments of the post.
const DrawerContent = (props: RedditSinglePost): JSX.Element => {
  const [postComments, setPostComments] = useState<RedditSinglePostComments[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Fetch comments of the post.
    async function handleSearch() {
      try {
        const URL = `https://www.reddit.com${props?.permalink}.json?jsonp=`;
        const req = await fetch(URL);

        if (req.ok) {
          const res = await req.json();
          setPostComments(res[1].data.children);
          setCommentsLoaded(true);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (props) {
      handleSearch();
    }
  }, [postComments.length, props]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Image src={props.url} className="drawer-content-image" />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Divider />
          <p className="site-description-item-profile-p">Stats</p>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <DescriptionItem
                title="Up votes"
                content={
                  <>
                    <ArrowUpOutlined style={{ color: '#f38546' }} /> <CountUp end={props.ups || 0} duration={1.5} />
                  </>
                }
              />
              <DescriptionItem
                title="Author"
                content={
                  <a target="_blank" rel="noreferrer" href={`https://www.reddit.com/user/${props.author}`}>
                    {props.author}
                  </a>
                }
              />
              <DescriptionItem
                title="Published on"
                content={dayjs((props.created_utc ?? 0) * 1000 || new Date()).format('MMM D, YYYY')}
              />
            </Col>

            <Col span={12}>
              <DescriptionItem
                title="Awards"
                content={
                  <Row gutter={[16, 16]}>
                    {props.all_awardings
                      ?.sort?.((a, b) => (a.count > b.count ? -1 : 1))
                      .map?.((award, index) => (
                        <Col key={index} style={{ margin: '.5rem' }}>
                          <Badge
                            count={<CountUp end={award.count} duration={award.count > 10 ? 1.5 : 1} />}
                            size="small"
                          >
                            <img src={award.icon_url} alt={award.name} style={{ width: '1.3rem' }} />
                          </Badge>
                        </Col>
                      )) ?? 'none'}
                  </Row>
                }
              />
            </Col>
            {commentsLoaded ? <CommentsSection comments={postComments} /> : <Skeleton active paragraph={{ rows: 1 }} />}
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default DrawerContent;
