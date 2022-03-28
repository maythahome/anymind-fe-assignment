import type { NextPage } from "next";
import Head from "next/head";
import styled from "@emotion/styled";
import Chat from "components/Chat";

const PageContainer = styled.div({
  minHeight: "100vh",
  padding: "2rem 0",
  display: "flex",
  maxWidth: "80vw",
  margin: "auto",
  flexDirection: "column",
});

const ChatWrapper = styled.div({
  display: "flex",
  width: "100%",
  flexWrap: "wrap",
});

const ChatHeader = styled.div({
  width: "100%",
});

const Home: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>1 Day chat app</title>
      </Head>

      <ChatWrapper className="wrapper">
        <ChatHeader>
          <b>1 day chat App</b>
          <p>All messages will be deleted at every 00:00 UTC</p>
        </ChatHeader>
        <Chat />
      </ChatWrapper>
    </PageContainer>
  );
};

export default Home;
