import { Avatar, Badge, Col, Collapse, Comment, Row, Tooltip } from 'antd';
import { ArrowUpOutlined, RedditOutlined } from '@ant-design/icons';

import CountUp from 'react-countup';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import rgb from '../../../utils/rgb';
import { RedditSinglePostComments } from '../../types';

dayjs.extend(relativeTime);

interface CommentItemProps {
  comment: RedditSinglePostComments;
  showReplies?: boolean;
}

const CommentItem = ({ comment, showReplies = false }: CommentItemProps): JSX.Element | null => {
  const { data } = comment;

  if (!data.author) {
    return null;
  }

  const renderAwards = (awards: typeof data.all_awardings) => {
    if (!awards || awards.length === 0) {
      return null;
    }

    return awards
      .sort((a, b) => b.count - a.count)
      .map((award, index) => (
        <Col key={`${award.name}-${index}`} style={{ margin: '.5rem' }}>
          <Badge count={<CountUp end={award.count} duration={award.count > 10 ? 1.5 : 1} />} size="small">
            <img src={award.icon_url} alt={award.name} style={{ width: '1rem' }} />
          </Badge>
        </Col>
      ));
  };

  const renderReplies = () => {
    if (!showReplies || !data.replies?.data?.children || data.replies.data.children.length <= 1) {
      return null;
    }

    const replies = data.replies.data.children.filter((reply) => reply.data?.author);

    if (replies.length === 0) {
      return null;
    }

    return (
      <Row>
        <Collapse ghost={true} style={{ paddingLeft: '1rem' }}>
          <Collapse.Panel
            header={
              <>
                <em style={{ fontWeight: 300 }}>Show Replies </em>
                {`(${replies.length})`}
              </>
            }
            key="1"
          >
            {replies
              .sort((a, b) => b.data.ups - a.data.ups)
              .map((reply, index) => (
                <CommentItem
                  key={`${reply.data.author}-${reply.data.created_utc}-${index}`}
                  comment={reply}
                  showReplies={true}
                />
              ))}
          </Collapse.Panel>
        </Collapse>
      </Row>
    );
  };

  return (
    <Comment
      author={`${data.author} - ${dayjs(data.created_utc * 1000).fromNow()}`}
      avatar={<Avatar style={{ backgroundColor: rgb() }} icon={<RedditOutlined />} alt={data.author} />}
      content={<p>{data.body}</p>}
      actions={[
        <div key="comment-actions">
          <Row align="middle">
            <Tooltip title="Upvotes">
              <span>
                <ArrowUpOutlined style={{ color: '#f38546' }} /> {data.ups}
              </span>
            </Tooltip>
            {renderAwards(data.all_awardings)}
          </Row>
          {renderReplies()}
        </div>,
      ]}
    />
  );
};

export const CommentsSection = (props: { comments: RedditSinglePostComments[] }): JSX.Element => {
  const { Panel } = Collapse;

  return (
    <Col span={24}>
      <Collapse ghost={true}>
        <Panel header={`Comments (${props.comments.length})`} key="1">
          {props.comments
            .sort((a, b) => b.data.ups - a.data.ups)
            .map((comment, index) => (
              <CommentItem
                key={`${comment.data.author}-${comment.data.created_utc}-${index}`}
                comment={comment}
                showReplies={true}
              />
            ))}
        </Panel>
      </Collapse>
    </Col>
  );
};
