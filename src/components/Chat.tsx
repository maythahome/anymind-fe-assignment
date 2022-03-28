import styled from "@emotion/styled";
import { useQuery } from "features/index";
import {
  FetchLatestMessagesData,
  FetchLatestMessagesVars,
  fetchMoreMessages,
  GET_LATEST_MESSAGES,
  Message,
} from "features/chat";
import { useEffect, useState } from "react";

const ChatBody = styled.div({
  display: "inline-flex",
  width: "100%",
  flexWrap: "nowrap",
  backgroundColor: "#f4f5fa",
  height: "100%",
});

const ChatSideNav = styled.div({
  width: "30%",
  borderRight: "1px solid #e6ecf3",
});

const ChatRightSide = styled.div({
  width: "70%",
});

const ChatSideNavMenu = styled.div({
  padding: "1em",
});

const ChatSideNavItem = styled.div({
  padding: "10px 1rem",
  cursor: "pointer",
  height: "40px",
});

const ChatChannelNameHolder = styled.div({
  height: "64px",
  padding: "20px 15px",
  borderBottom: "1px solid #e6ecf3",
});

const ChatWindow = styled.div({
  minHeight: "70vh",
});

const TextArea = styled.textarea({
  resize: "none",
  display: "block",
  width: "100%",
  height: "100px",
  fontSize: "1rem",
  fontWeight: "400",
  lineHeight: "1.5",
  color: "#495057",
  backgroundColor: "#fff",
  backgroundClip: "padding-box",
  border: " px solid #ced4da",
  borderRadius: "0.25rem",
  transition: "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
});

const ChatControlHolder = styled.div({
  padding: "0.375rem 0.75rem",
});

const ChatMessage = styled.div({
  backgroundColor: "#FFF",
});

const MessageRow = styled.div<{ messageRight: boolean }>((props) => ({
  display: "flex",
  justifyContent: props.messageRight ? "flex-end" : "flex-start",
}));

const ChatStatus = styled.div({});

const Chat = () => {
  const [currentUser, setCurrentUser] = useState<string>("Joyse");
  const [channelId, setChannelId] = useState<string>("General");

  const { error, data: { fetchLatestMessages: messsageList = [] } = {} } =
    useQuery<FetchLatestMessagesData, FetchLatestMessagesVars>(
      GET_LATEST_MESSAGES,
      {
        variables: { channelId },
      }
    );

  const [messages, setMessages] = useState<Message[]>(messsageList);

  useEffect(() => {
    setMessages(messsageList);
  }, [messsageList, channelId]);

  const handleUserChange = (user: string) => {
    setCurrentUser(user);
  };

  const handleChannelClick = (channelId: string) => {
    setChannelId(channelId);
  };

  const handleReadMoreClick = async (old: boolean) => {
    if (sorted.length === 0) return;
    const messageId = !old
      ? sorted[0]?.messageId
      : sorted[sorted.length - 1].messageId;
    const moreMessages = await fetchMoreMessages(channelId, messageId, old);

    if (!old) {
      const curMessages = [...moreMessages, ...messages];
      setMessages(curMessages);
      return;
    }
    const curMessages = [...messages, ...moreMessages];
    setMessages(curMessages);
  };

  const nosorted = [...messages];
  const sorted = nosorted.sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  );

  return (
    <ChatBody className="body">
      <ChatSideNav className="chat-side-nav">
        <ChatSideNavMenu>1. Choose your user</ChatSideNavMenu>
        <ChatSideNavItem>
          <select onChange={(e) => handleUserChange(e.target.value)}>
            <option value="Joyse"> Joyse </option>
            <option value="Sam"> Sam </option>
            <option value="Russell"> Russell </option>
          </select>
        </ChatSideNavItem>
        <ChatSideNavMenu>2. Choose your user</ChatSideNavMenu>
        <ChatSideNavItem onClick={() => handleChannelClick("General")}>
          General Chanel
        </ChatSideNavItem>
        <ChatSideNavItem onClick={() => handleChannelClick("Technology")}>
          Technology Chanel
        </ChatSideNavItem>
        <ChatSideNavItem onClick={() => handleChannelClick("LGTM")}>
          LGTM Chanel
        </ChatSideNavItem>
      </ChatSideNav>

      <ChatRightSide className="chat-window">
        <ChatChannelNameHolder className="chat-channel-name">
          GTM Channel
        </ChatChannelNameHolder>
        <ChatWindow className="messages-wrapper">
          <button
            className="Read More"
            onClick={() => handleReadMoreClick(true)}
          >
            Read more
          </button>
          {sorted?.map((message: any) => {
            return (
              <MessageRow messageRight={message.userId === currentUser}>
                <div>{message.userId}</div>
                <ChatMessage>{message.text}</ChatMessage>
                <ChatStatus>{message.datetime}</ChatStatus>
              </MessageRow>
            );
          })}
          <button
            className="Read More"
            onClick={() => handleReadMoreClick(false)}
          >
            Read more
          </button>
        </ChatWindow>
        <ChatControlHolder className="message">
          <TextArea></TextArea>
          <button>Send Message</button>
        </ChatControlHolder>
      </ChatRightSide>
    </ChatBody>
  );
};

export default Chat;
