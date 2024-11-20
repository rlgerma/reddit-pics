import { Avatar, Badge, Col, Collapse, Comment, Row, Tooltip } from 'antd';
import { ArrowUpOutlined, RedditOutlined } from '@ant-design/icons';

import CountUp from 'react-countup';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import rgb from '../../../utils/rgb';
import { RedditSinglePostComments } from '../../types';

export const CommentsSection = (props: { comments: RedditSinglePostComments[] }): JSX.Element => {
  const { Panel } = Collapse;

  return (
    <Col span={24}>
      <Collapse ghost={true}>
        <Panel header={`Comments (${props.comments.length})`} key="1">
          {props.comments
            .sort?.((a, b) => (a.data.ups > b.data.ups ? -1 : 1))
            .map?.((comment, index) => {
              const { data } = comment;
              dayjs.extend(relativeTime);

              return (
                data.author && (
                  <Comment
                    key={index}
                    author={`${data.author} - ${dayjs(data.created_utc * 1000).fromNow()}`}
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: rgb(),
                        }}
                        icon={<RedditOutlined />}
                        alt={data.author}
                      />
                    }
                    content={<p>{data.body}</p>}
                    actions={[
                      <div key={index}>
                        <Row align="middle">
                          <Tooltip overlay={index}>
                            <span>
                              <ArrowUpOutlined
                                style={{
                                  color: '#f38546',
                                }}
                              />{' '}
                              {data.ups}
                            </span>
                          </Tooltip>
                          {data.all_awardings
                            ?.sort?.((a, b) => (a.count > b.count ? -1 : 1))
                            .map?.((award, index) => (
                              <Col
                                key={index}
                                style={{
                                  margin: '.5rem',
                                }}
                              >
                                <Badge
                                  count={<CountUp end={award.count} duration={award.count > 10 ? 1.5 : 1} />}
                                  size="small"
                                >
                                  <img
                                    src={award.icon_url}
                                    alt={award.name}
                                    style={{
                                      width: '1rem',
                                    }}
                                  />
                                </Badge>
                              </Col>
                            )) ?? 'none'}
                        </Row>
                        <Row>
                          {data.replies.data?.children.length > 1 ? (
                            <Collapse
                              ghost={true}
                              style={{
                                paddingLeft: '1rem',
                              }}
                            >
                              <Panel
                                header={[
                                  <em
                                    key="1"
                                    style={{
                                      fontWeight: 300,
                                    }}
                                  >
                                    Show Replies{' '}
                                  </em>,
                                  `(${data.replies.data.children.length - 1})`,
                                ]}
                                key="1"
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
                                          author={`${data.author} - ${dayjs(data.created_utc * 1000).fromNow()}`}
                                          avatar={
                                            <Avatar
                                              style={{
                                                backgroundColor: rgb(),
                                              }}
                                              icon={<RedditOutlined />}
                                              alt={data.author}
                                            />
                                          }
                                          content={<p>{data.body}</p>}
                                          actions={[
                                            <Row align="middle" key={index}>
                                              <Tooltip overlay={index}>
                                                <span>
                                                  <ArrowUpOutlined
                                                    style={{
                                                      color: '#f38546',
                                                    }}
                                                  />{' '}
                                                  {data.ups}
                                                </span>
                                              </Tooltip>
                                              {data.all_awardings
                                                ?.sort?.((a, b) => (a.count > b.count ? -1 : 1))
                                                .map?.((award, index) => (
                                                  <Col
                                                    key={index}
                                                    style={{
                                                      margin: '.5rem',
                                                    }}
                                                  >
                                                    <Badge
                                                      count={
                                                        <CountUp
                                                          end={award.count}
                                                          duration={award.count > 10 ? 1.5 : 1}
                                                        />
                                                      }
                                                      size="small"
                                                    >
                                                      <img
                                                        src={award.icon_url}
                                                        alt={award.name}
                                                        style={{
                                                          width: '1rem',
                                                        }}
                                                      />
                                                    </Badge>
                                                  </Col>
                                                )) ?? 'none'}
                                            </Row>,
                                          ]}
                                        />
                                      )
                                    );
                                  })}{' '}
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
  );
};
