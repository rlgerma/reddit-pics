import { FC } from "react";

import { Layout } from "antd";
import dayjs from "dayjs";

const { Header, Content, Footer } = Layout;

// Component: LayoutWrap returns a global layout component with a header, content, and footer.
// Child components are passed as props in 'content'.
// Sets the current date in the footer.
const LayoutWrap: FC = ({ children }) => (
  <Layout>
    <Header
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
        backgroundColor: "#FE4600",
      }}
    >
      <div className='logo' />
    </Header>
    <Content
      className='site-layout'
      style={{ padding: "0 50px", marginTop: 64 }}
    >
      <div
        className='site-layout-background'
        style={{ padding: 24, minHeight: 980 }}
      >
        {children}
      </div>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      Reddit-Pics ©{dayjs().format("YYYY")} Created by Richard Germaine
    </Footer>
  </Layout>
);

export default LayoutWrap;
