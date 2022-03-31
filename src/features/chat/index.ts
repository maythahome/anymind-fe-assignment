import { gql, client } from "features/index";

export type UserId = "Joyse" | "Sam" | "Russel";
export type ChanelId = "General" | "Technology" | "LGTM";
export interface MessageDetail {
  messageId: string;
  text: string;
  datetime: string;
  userId: UserId;
  failed?: boolean;
}

export interface FetchLatestMessagesData {
  fetchLatestMessages: MessageDetail[];
}
export interface FetchLatestMessagesVars {
  channelId: ChanelId;
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
  channelId: ChanelId;
  text: string;
  userId: UserId;
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
