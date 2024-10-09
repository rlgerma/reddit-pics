import { useEffect, useState } from "react";

import { DescriptionItem } from "./DescriptionItem";
import rgb from "../../utils/rgb";

import CountUp from "react-countup";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
  Avatar,
  Badge,
  Col,
  Collapse,
  Comment,
  Divider,
  Image,
  Row,
  Skeleton,
  Tooltip,
} from "antd";

import { ArrowUpOutlined, RedditOutlined } from "@ant-design/icons";
import { RedditSinglePost, RedditSinglePostComments } from "../types";

// Component: DrawerContent - Loads details of a post selected in parent component: 'Feed'.
// An additional fetch request is made to get the comments of the post.
const DrawerContent = (props: RedditSinglePost): JSX.Element => {
  const [postComments, setPostComments] = useState<RedditSinglePostComments[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false);

  const { Panel } = Collapse;

  useEffect(() => {
    // Fetch comments of the post.
    async function handleSearch() {
      try {
        const URL = `https://www.reddit.com${props?.permalink}.json?jsonp=`;
        const req = await fetch(URL)
          .then((res) => res.json())
          .then((json) => {
            setPostComments(json[1].data.children);
            setCommentsLoaded(true);
          })
          .catch((error) => {
            throw error;
          });
        return req;
      } catch (error) {
        console.error(error);
      }
    }

    if (props) {
      handleSearch();
    }

    if (postComments.length > 0) {
      console.info("%cComments loaded", "color: #42e089");
    }
  }, [postComments.length, props]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Image src={props.url} className='drawer-content-image' />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Divider />
          <p className='site-description-item-profile-p'>Stats</p>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <DescriptionItem
                title='Up votes'
                content={
                  <>
                    <ArrowUpOutlined style={{ color: "#f38546" }} />{" "}
                    <CountUp end={props.ups || 0} duration={1.5} />
                  </>
                }
              />
              <DescriptionItem
                title='Author'
                content={
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={`https://www.reddit.com/user/${props.author}`}
                  >
                    {props.author}
                  </a>
                }
              />
              <DescriptionItem
                title='Published on'
                content={dayjs((props.created_utc ?? 0) * 1000 || new Date()).format("MMM D, YYYY")}
              />
            </Col>

            <Col span={12}>
              <DescriptionItem
                title='Awards'
                content={
                  <Row gutter={[16, 16]}>
                    {props.all_awardings
                      ?.sort?.((a, b) => (a.count > b.count ? -1 : 1))
                      .map?.((award, index) => (
                        <Col key={index} style={{ margin: ".5rem" }}>
                          <Badge
                            count={
                              <CountUp end={award.count} duration={award.count > 10 ? 1.5 : 1} />
                            }
                            size='small'
                          >
                            <img
                              src={award.icon_url}
                              alt={award.name}
                              style={{ width: "1.3rem" }}
                            />
                          </Badge>
                        </Col>
                      )) ?? "none"}
                  </Row>
                }
              />
            </Col>

            {commentsLoaded ? (
              <Col span={24}>
                <Collapse ghost={true}>
                  <Panel header={`Comments (${postComments.length})`} key='1'>
                    {postComments
                      .sort?.((a, b) => (a.data.ups > b.data.ups ? -1 : 1))
                      .map?.((comment, index) => {
                        const { data } = comment;
                        dayjs.extend(relativeTime);

                        return (
                          data.author && (
                            <Comment
                              key={index}
                              author={`${data.author} - ${dayjs(
                                data.created_utc * 1000
                              ).fromNow()}`}
                              avatar={
                                <Avatar
                                  style={{ backgroundColor: rgb() }}
                                  icon={<RedditOutlined />}
                                  alt={data.author}
                                />
                              }
                              content={<p>{data.body}</p>}
                              actions={[
                                <div key={index}>
                                  <Row align='middle'>
                                    <Tooltip overlay={index}>
                                      <span>
                                        <ArrowUpOutlined
                                          style={{
                                            color: "#f38546",
                                          }}
                                        />{" "}
                                        {data.ups}
                                      </span>
                                    </Tooltip>
                                    {data.all_awardings
                                      ?.sort?.((a, b) => (a.count > b.count ? -1 : 1))
                                      .map?.((award, index) => (
                                        <Col key={index} style={{ margin: ".5rem" }}>
                                          <Badge
                                            count={
                                              <CountUp
                                                end={award.count}
                                                duration={award.count > 10 ? 1.5 : 1}
                                              />
                                            }
                                            size='small'
                                          >
                                            <img
                                              src={award.icon_url}
                                              alt={award.name}
                                              style={{ width: "1rem" }}
                                            />
                                          </Badge>
                                        </Col>
                                      )) ?? "none"}
                                  </Row>
                                  <Row>
                                    {data.replies.data?.children.length > 1 ? (
                                      <Collapse ghost={true} style={{ paddingLeft: "1rem" }}>
                                        <Panel
                                          header={[
                                            <em key='1' style={{ fontWeight: 300 }}>
                                              Show Replies{" "}
                                            </em>,
                                            `(${data.replies.data.children.length - 1})`,
                                          ]}
                                          key='1'
                                        >
                                          {data.replies.data.children
                                            .sort?.((a, b) => (a.data.ups > b.data.ups ? -1 : 1))
                                            .map?.((comment, index) => {
                                              const { data } = comment;
                                              dayjs.extend(relativeTime);

                                              return (
                                                data.author && (
                                                  <Comment
                                                    key={index}
                                                    author={`${data.author} - ${dayjs(
                                                      data.created_utc * 1000
                                                    ).fromNow()}`}
                                                    avatar={
                                                      <Avatar
                                                        style={{ backgroundColor: rgb() }}
                                                        icon={<RedditOutlined />}
                                                        alt={data.author}
                                                      />
                                                    }
                                                    content={<p>{data.body}</p>}
                                                    actions={[
                                                      <Row align='middle' key={index}>
                                                        <Tooltip overlay={index}>
                                                          <span>
                                                            <ArrowUpOutlined
                                                              style={{
                                                                color: "#f38546",
                                                              }}
                                                            />{" "}
                                                            {data.ups}
                                                          </span>
                                                        </Tooltip>
                                                        {data.all_awardings
                                                          ?.sort?.((a, b) =>
                                                            a.count > b.count ? -1 : 1
                                                          )
                                                          .map?.((award, index) => (
                                                            <Col
                                                              key={index}
                                                              style={{ margin: ".5rem" }}
                                                            >
                                                              <Badge
                                                                count={
                                                                  <CountUp
                                                                    end={award.count}
                                                                    duration={
                                                                      award.count > 10 ? 1.5 : 1
                                                                    }
                                                                  />
                                                                }
                                                                size='small'
                                                              >
                                                                <img
                                                                  src={award.icon_url}
                                                                  alt={award.name}
                                                                  style={{ width: "1rem" }}
                                                                />
                                                              </Badge>
                                                            </Col>
                                                          )) ?? "none"}
                                                      </Row>,
                                                    ]}
                                                  />
                                                )
                                              );
                                            })}{" "}
                                        </Panel>
                                      </Collapse>
                                    ) : null}
                                  </Row>
                                </div>,
                              ]}
                            />
                          )
                        );
                      })}
                  </Panel>
                </Collapse>
              </Col>
            ) : (
              <Skeleton active paragraph={{ rows: 1 }} />
            )}
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default DrawerContent;
