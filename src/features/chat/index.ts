import { gql, client } from "features/index";

export interface Message {
  messageId: string;
  text: string;
  datetime: string;
  userId: string;
  failed?: boolean;
}

export interface FetchLatestMessagesData {
  fetchLatestMessages: Message[];
}
export interface FetchLatestMessagesVars {
  channelId: string;
}

export const GET_LATEST_MESSAGES = gql`
  query FetchLatestMessages($channelId: String!) {
    fetchLatestMessages(channelId: $channelId) {
      messageId
      datetime
      text
      userId
    }
  }
`;

export interface PostMessagePayload {
  channelId: string;
  text: string;
  userId: string;
}

export const POST_MESSAGE = gql`
  mutation PostMessage($channelId: String!, $text: String!, $userId: String!) {
    postMessage(channelId: $channelId, text: $text, userId: $userId) {
      messageId
      datetime
      text
      userId
    }
  }
`;

export const fetchMoreMessages = async (
  channelId: string,
  messageId: string,
  old: boolean
) => {
  const { data } = await client.query({
    query: gql`
      query FetchMoreMessages(
        $channelId: String!
        $messageId: String!
        $old: Boolean!
      ) {
        fetchMoreMessages(
          channelId: $channelId
          messageId: $messageId
          old: $old
        ) {
          messageId
          datetime
          text
          userId
        }
      }
    `,
    variables: {
      channelId,
      messageId,
      old,
    },
    errorPolicy: "all",
  });

  return data.fetchMoreMessages;
};
