import type { NextPage } from "next";
import Head from "next/head";
import styled from "@emotion/styled";
import ChatBox from "components/Chat/ChatBox";

const PageContainer = styled.div({
  minHeight: "100vh",
  display: "flex",
  maxWidth: "80vw",
  margin: "auto",
  flexDirection: "column",
});

const Wrapper = styled.div({
  display: "flex",
  width: "100%",
  flexWrap: "wrap",
});

const Header = styled.div({
  width: "100%",
  h5: {
    fontSize: "1.25rem",
    fontWeight: 500,
    marginBottom: "0.5rem",
  },
  p: {
    marginTop: 0,
  },
});

const Home: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>1 Day chat app</title>
      </Head>

      <Wrapper>
        <Header>
          <h5>1 day chat App</h5>
          <p>All messages will be deleted at every 00:00 UTC</p>
        </Header>
        <ChatBox />
      </Wrapper>
    </PageContainer>
  );
};

export default Home;
