import { useEffect, useState } from "react";

// util function to get window width for drawer
import useWindowDimensions from "../../utils/windowDimensions";

import DrawerContent from "../DrawerContent";

import { Card, Col, Drawer, Image, Row, Spin } from "antd";

// Component: Feed - Loads data from reddit API and displays thumbnails of posts from r/pics.
// Selecting a thumbnail will open a drawer with the full image and details.
export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowDimensions();
  useEffect(() => {
    // Loads data from reddit API in r/pics.
    async function handleSearch() {
      setLoading(true);
      try {
        const URL = "https://www.reddit.com/r/pics/.json?jsonp=";
        const req = await fetch(URL)
          .then((res) => res.json())
          .then((json) => setPosts(json))
          .then(() => setLoading(false))
          .catch((error) => {
            throw error;
          });
        return req;
      } catch (error) {
        console.error(error);
      }
    }
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
        title={postData?.title ?? ""}
        placement='right'
        onClose={onClose}
        visible={isOpen}
        width={width > 600 ? 600 : 360}
        headerStyle={{ textAlign: "center", padding: "2rem" }}
      >
        <DrawerContent {...postData} />
      </Drawer>
      <Row gutter={[16, 16]}>
        {posts.data?.children.map(
          (post, index) =>
            post.data?.thumbnail.includes("https") && (
              <Col key={index} xl={6} lg={12} md={12} sm={1} xs={1}>
                <Card
                  hoverable
                  bordered={false}
                  cover={
                    <Image
                      alt={post.data?.title}
                      src={post.data?.url}
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
                  <Card.Meta
                    title={post.data?.title}
                    description={post.data?.author}
                  />
                </Card>
              </Col>
            )
        )}
      </Row>
    </>
  );
}
