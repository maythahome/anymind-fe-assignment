import { gql } from "features/index";

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
