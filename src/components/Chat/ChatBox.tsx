import { useMutation, useQuery } from "features/index";
import {
  FetchLatestMessagesData,
  FetchLatestMessagesVars,
  fetchMoreMessages,
  GET_LATEST_MESSAGES,
  MessageDetail,
  PostMessagePayload,
  POST_MESSAGE,
} from "features/chat";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Message from "./ChatMessage";
import {
  Button,
  ChatBody,
  ChatChannelNameHolder,
  ChatControlHolder,
  ChatRightSide,
  ChatSideNav,
  ChatSideNavItem,
  ChatSideNavMenu,
  ChatWindow,
  MessageHolder,
  Select,
  TextArea,
} from "./styles";

const ChatBox = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesStartRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<string>("Joyse");
  const [channelId, setChannelId] = useState<string>("General");
  const [currentText, setCurrentText] = useState<string>("");
  const [scrollTop, setScrollTop] = useState<boolean>(false);

  const {
    loading: fetchMsgLoading,
    error: fetchMsgError,
    data: { fetchLatestMessages: unsortedMsgs = [] } = {},
  } = useQuery<FetchLatestMessagesData, FetchLatestMessagesVars>(
    GET_LATEST_MESSAGES,
    {
      variables: { channelId },
    }
  );
  const [messages, setMessages] = useState<MessageDetail[]>(unsortedMsgs);

  const [postMessage] = useMutation<
    { postMessage: MessageDetail },
    PostMessagePayload
  >(POST_MESSAGE);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    const localMsg = window.localStorage.getItem("msg") || "";
    setCurrentText(localMsg);
  }, []);

  useEffect(() => {
    if (!fetchMsgError && !fetchMsgLoading) {
      const unsorted = [...unsortedMsgs];
      const sortedMsgs = unsorted.sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );
      setMessages(sortedMsgs);
    }
  }, [unsortedMsgs, channelId]);

  useEffect(() => {
    if (scrollTop) {
      scrollToTop();
      setScrollTop(false);
    } else {
      scrollToBottom();
    }
  }, [messages]);

  const handleUserChange = (user: string) => {
    setCurrentUser(user);
  };

  const handleChannelClick = (channelId: string) => {
    setChannelId(channelId);
  };

  const handleReadMoreClick = async (old: boolean) => {
    if (messages.length === 0) return;
    const messageId = !old
      ? messages[messages.length - 1].messageId
      : messages[0]?.messageId;
    const moreMessages = await fetchMoreMessages(channelId, messageId, old);
    if (!moreMessages) return;

    if (old) {
      setScrollTop(true);
    }
    const unsort = [...moreMessages];
    const sorted = unsort.sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
    const curMessages = old
      ? [...sorted, ...messages]
      : [...messages, ...sorted];
    setMessages(curMessages);
  };

  const handleSendClick = async () => {
    const { data, errors } = await postMessage({
      variables: {
        channelId,
        text: currentText,
        userId: currentUser,
      },
      errorPolicy: "all",
    });

    let msg: any = {};
    msg = {
      ...data?.postMessage,
    };
    if (errors) {
      msg.messageId = "temp_1";
      msg.text = currentText || "";
      msg.datetime = new Date().toISOString();
      msg.userId = currentUser;
      msg.failed = true;
    }

    setMessages([...messages, msg]);
    setCurrentText("");
    window.localStorage.removeItem("msg");
  };

  const handleTextChange = (text: string) => {
    window.localStorage.setItem("msg", text);
    setCurrentText(text);
  };

  return (
    <ChatBody className="body" key={"chat_body"}>
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
          {channelId}
        </ChatChannelNameHolder>
        <ChatWindow>
          <div>
            <Button
              className="Read More"
              onClick={() => handleReadMoreClick(true)}
              style={{ marginBottom: "5px" }}
            >
              Read more
              <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: "8px" }} />
            </Button>
          </div>
          <MessageHolder>
            <div ref={messagesStartRef} />
            {messages?.map((message: MessageDetail, index) => {
              const isRight = message.userId === currentUser;
              return (
                <Message
                  message={message}
                  isRight={isRight}
                  key={`message_${message.messageId}`}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </MessageHolder>
          <div>
            <Button
              className="Read More"
              onClick={() => handleReadMoreClick(false)}
              style={{ marginTop: "5px" }}
            >
              Read more
              <FontAwesomeIcon
                icon={faArrowDown}
                style={{ marginLeft: "8px" }}
              />
            </Button>
          </div>
        </ChatWindow>
        <ChatControlHolder className="message">
          <TextArea
            onChange={(e) => handleTextChange(e.target.value)}
            value={currentText}
          />
          <Button onClick={handleSendClick}>
            Send Message
            <FontAwesomeIcon
              icon={faPaperPlane}
              style={{ marginLeft: "8px" }}
            />
          </Button>
        </ChatControlHolder>
      </ChatRightSide>
    </ChatBody>
  );
};

export default ChatBox;
