import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://angular-test-backend-yc4c5cvnnq-an.a.run.app/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query {
        fetchLatestMessages(channelId: "1") {
          messageId
          datetime
          text
          userId
        }
      }
    `,
  });

  return {
    props: {
      messages: data,
    },
  };
}

type Props = {
  messages: any;
};

const Home = ({ messages }: Props) => {
  console.log(messages);
  return (
    <div className={styles.container}>
      <Head>
        <title>1 Day chat app</title>
      </Head>

      <div className="page-container">
        <div className="wrapper">
          <div className="header">
            <h4>1 day chat App</h4>
            <p>All messages will be deleted at every 00:00 UTC</p>
          </div>
          <div className="body">
            <div className="chat-side-nav">
              <div>
                1. Choose your user
                <select>
                  <option> Joyse </option>
                  <option> Sam </option>
                  <option> Russell </option>
                </select>
              </div>
              <div>
                2. Choose your user
                <div>General Chanel</div>
                <div>Technology Chanel</div>
                <div>LGTM Chanel</div>
              </div>
            </div>
            <div className="chat-window">
              <div className="chat-channel-name"></div>
              <div className="messages-wrapper">
                <button className="Read More">Read more</button>
                <div className="message"> Some message</div>
                <button className="Read More">Read more</button>
              </div>
              <div className="message">
                <textarea></textarea>
                <button>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
