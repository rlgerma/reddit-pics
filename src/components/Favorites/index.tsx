import { FC, useState, useEffect } from 'react';
import { Card, Col, Row, Result, Button, Image, Modal } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { FavoritePost, getFavorites, removeFavorite } from '../../utils/favorites';
import { useWindowDimensions } from '../../utils/windowDimensions';
import DrawerContent from '../DrawerContent';
import { RedditSinglePost } from '../types';

const Favorites: FC = () => {
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [postData, setPostData] = useState<RedditSinglePost | undefined>(undefined);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemoveFavorite = (postId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeFavorite(postId);
    setFavorites(getFavorites());
  };

  const handleCardClick = (post: FavoritePost) => {
    const singlePost: RedditSinglePost = {
      title: post.title,
      url: post.url,
      author: post.author,
      permalink: post.permalink || null,
      thumbnail: post.thumbnail,
      ups: post.ups,
      created_utc: post.created_utc,
      all_awardings: post.all_awardings,
    };
    setPostData(singlePost);
    setIsOpen(true);
  };

  const onClose = () => setIsOpen(false);

  return (
    <>
      <Modal
        title={postData?.title ?? 'No Title'}
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={width > 600 ? 600 : 360}
        centered
      >
        <DrawerContent {...postData} />
      </Modal>

      <Row style={{ marginBottom: '2rem' }} align="middle" justify="space-between">
        <Col>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>
            <HeartFilled style={{ color: '#ff4d4f', marginRight: '0.5rem' }} />
            My Favorites ({favorites.length})
          </h1>
        </Col>
        <Col>
          <Button onClick={() => navigate('/')}>Back to Feed</Button>
        </Col>
      </Row>

      <Row
        gutter={[16, 16]}
        justify={favorites.length > 0 ? 'space-between' : 'center'}
        align={favorites.length > 0 ? 'stretch' : 'middle'}
        className="feed-row"
      >
        {favorites.length > 0 ? (
          favorites.map((post, index) => (
            <Col key={`${post.id}-${index}`} md={6} xs={20}>
              <Card
                hoverable
                bordered={false}
                cover={<Image alt={post.title} src={post.url} preview={false} className="search-card-image" />}
                onClick={() => handleCardClick(post)}
                className="search-card"
                style={{ position: 'relative' }}
              >
                <Card.Meta title={post.title} description={post.author} />
                <Button
                  type="text"
                  shape="circle"
                  icon={<HeartFilled style={{ fontSize: '20px', color: '#ff4d4f' }} />}
                  onClick={(e) => handleRemoveFavorite(post.id, e)}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                  }}
                />
              </Card>
            </Col>
          ))
        ) : (
          <Col
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
            }}
          >
            <Result
              icon={<HeartFilled style={{ fontSize: '72px', color: '#d9d9d9' }} />}
              title="No Favorites Yet"
              subTitle="Start adding your favorite posts by clicking the heart icon on any post!"
              extra={
                <Button type="primary" onClick={() => navigate('/')}>
                  Browse Posts
                </Button>
              }
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default Favorites;
