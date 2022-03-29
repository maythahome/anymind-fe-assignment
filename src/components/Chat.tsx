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

const ChatSideNavItem = styled.div<{ isClick: boolean }>((props) => ({
  padding: "10px 1rem",
  cursor: "pointer",
  height: "55px",
  backgroundColor: props.isClick ? "#FFF" : "transparent",
  fontSize: ".85rem",
  ":hover": {
    background: props.isClick
      ? "#FFF"
      : "linear-gradient(-45deg,#e9eff5, #FFFFFF)",
  },
}));

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

const Select = styled.select({
  width: "100%",
  height: "35px",
  borderRadius: "4px",
  border: "1px solid #ced4da",
  padding: "0.375rem .75rem",
});

const Button = styled.button({
  padding: "8px 10px",
  backgroundColor: "#17a2b8",
  color: "#FFF",
  border: "none",
  borderRadius: "4px",
});

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
    if (!error) setMessages(messsageList);
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

  const temp = [
    {
      messageId: "123123123123",
      text: "Hi",
      datetime: "2021-01-02",
      userId: "Joyse",
    },
    {
      messageId: "123123123123",
      text: "Hi",
      datetime: "2021-01-02",
      userId: "Sam",
    },
  ];

  return (
    <ChatBody className="body">
      <ChatSideNav className="chat-side-nav">
        <ChatSideNavMenu>1. Choose your user</ChatSideNavMenu>
        <Select onChange={(e) => handleUserChange(e.target.value)}>
          <option value="Joyse"> Joyse </option>
          <option value="Sam"> Sam </option>
          <option value="Russell"> Russell </option>
        </Select>

        <ChatSideNavMenu>2. Choose your user</ChatSideNavMenu>
        <ChatSideNavItem
          onClick={() => handleChannelClick("General")}
          isClick={channelId === "General"}
        >
          General Chanel
        </ChatSideNavItem>
        <ChatSideNavItem
          onClick={() => handleChannelClick("Technology")}
          isClick={channelId === "Technology"}
        >
          Technology Chanel
        </ChatSideNavItem>
        <ChatSideNavItem
          onClick={() => handleChannelClick("LGTM")}
          isClick={channelId === "LGTM"}
        >
          LGTM Chanel
        </ChatSideNavItem>
      </ChatSideNav>

      <ChatRightSide className="chat-window">
        <ChatChannelNameHolder className="chat-channel-name">
          GTM Channel
        </ChatChannelNameHolder>
        <ChatWindow className="messages-wrapper">
          <Button
            className="Read More"
            onClick={() => handleReadMoreClick(true)}
          >
            Read more
          </Button>
          {/* {sorted?.map((message: any) => {
            return (
              <MessageRow messageRight={message.userId === currentUser}>
                <div>{message.userId}</div>
                <ChatMessage>{message.text}</ChatMessage>
                <ChatStatus>{message.datetime}</ChatStatus>
              </MessageRow>
            );
          })} */}
          {temp?.map((message: any) => {
            return (
              <MessageRow messageRight={message.userId === currentUser}>
                <div>{message.userId}</div>
                <ChatMessage>{message.text}</ChatMessage>
                <ChatStatus>{message.datetime}</ChatStatus>
              </MessageRow>
            );
          })}
          <Button
            className="Read More"
            onClick={() => handleReadMoreClick(false)}
          >
            Read more
          </Button>
        </ChatWindow>
        <ChatControlHolder className="message">
          <TextArea></TextArea>
          <Button>Send Message</Button>
        </ChatControlHolder>
      </ChatRightSide>
    </ChatBody>
  );
};

export default Chat;
