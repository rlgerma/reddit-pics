import { FC } from 'react';

import { Button, Col, Layout, Row } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const { Header, Content, Footer } = Layout;

// Component: LayoutWrap returns a global layout component with a header, content, and footer.
// Child components are passed as props in 'content'.
// Sets the current date in the footer.
const LayoutWrap: FC = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFavoritesPage = location.pathname === '/favorites';

  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          backgroundColor: '#FE4600',
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
          </Col>
          <Col>
            <Button
              type="text"
              icon={<HeartOutlined style={{ fontSize: '20px' }} />}
              onClick={() => navigate(isFavoritesPage ? '/' : '/favorites')}
              style={{
                color: 'white',
                fontSize: '16px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isFavoritesPage ? 'Feed' : 'Favorites'}
            </Button>
          </Col>
        </Row>
      </Header>
      <Content className="site-layout">
        <div className="site-layout-background" style={{ padding: 24, minHeight: 980 }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Reddit-Pics {dayjs().format('YYYY')} | Created by{' '}
        <a href="https://github.com/rlgerma" target="_blank" rel="noreferrer">
          rlgerma
        </a>{' '}
        😎
      </Footer>
    </Layout>
  );
};

export default LayoutWrap;
