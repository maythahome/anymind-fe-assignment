import styled from "@emotion/styled";
import { useMutation, useQuery } from "features/index";
import {
  FetchLatestMessagesData,
  FetchLatestMessagesVars,
  fetchMoreMessages,
  GET_LATEST_MESSAGES,
  Message,
  PostMessagePayload,
  POST_MESSAGE,
} from "features/chat";
import { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import SamPic from "assets/logo/Sam.png";
import JoysePic from "assets/logo/Joyse.png";
import RussellPic from "assets/logo/Russell.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPaperPlane,
  faCheckCircle,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const imageMapper: { [key: string]: StaticImageData } = {
  Joyse: JoysePic,
  Sam: SamPic,
  Russell: RussellPic,
};

function padTo2Digits(num: number) {
  return String(num).padStart(2, "0");
}

const getHourMinute = (date: Date) => {
  return `${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`;
};

const ChatBody = styled.div({
  display: "inline-flex",
  width: "100%",
  flexWrap: "nowrap",
  backgroundColor: "#f4f5fa",
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
  minHeight: "60vh",
  padding: "1rem",
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
  marginBottom: "10px",
});

const ChatControlHolder = styled.div({
  padding: "0.375rem 0.75rem",
});

const MessageRow = styled.div<{ messageRight: boolean }>((props) => {
  return {
    display: "flex",
    justifyContent: props.messageRight ? "flex-end" : "flex-start",
    flex: "1",
    marginBottom: "40px",
    ".chat-message": {
      backgroundColor: "#FFF",
      padding: "0.4rem 1rem",
      borderRadius: "4px",
      fontWeight: 300,
      minHeight: "50px",
      position: "relative",
      maxWidth: "450px",
      whiteSpace: "pre-line",
      wordBreak: "break-word",
      ":before": {
        content: "''",
        position: "absolute",
        border: "10px solid",
        top: "10px",
      },
    },
    ".message-right": {
      flexDirection: "row-reverse",
      ".avatar-holder": {
        marginBottom: "auto",
        marginLeft: "20px",
      },
      ".chat-message": {
        textAlign: "right",
        ":before": {
          right: "-20px",
          borderColor: "transparent transparent transparent #ffffff",
        },
      },
    },
    ".message-left": {
      ".avatar-holder": {
        marginBottom: "auto",
        marginRight: "20px",
      },
      ".chat-message": {
        ":before": {
          left: "-20px",
          borderColor: "transparent #ffffff transparent transparent",
        },
      },
    },
    ".message-sender": {
      color: "#999999",
      fontSize: ".75rem",
      textAlign: "center",
    },

    ".chat-status": {
      color: "#999999",
      fontSize: ".75rem",
      textAlign: "center",
    },

    ".chat-hour": {
      fontSize: "0.80rem",
    },
  };
});

const Select = styled.select({
  width: "100%",
  height: "35px",
  borderRadius: "4px",
  border: "1px solid #ced4da",
  padding: "0.375rem .75rem",
});

const Button = styled.button({
  fontSize: "1rem",
  padding: "8px 10px",
  backgroundColor: "#17a2b8",
  color: "#FFF",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "#138496",
  },
});

const MessageWrapper = styled.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const MessageHolder = styled.div({
  height: "500px",
  overflowY: "scroll",
});

const Chat = () => {
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
  const [messages, setMessages] = useState<Message[]>(unsortedMsgs);

  const [postMessage] = useMutation<
    { postMessage: Message },
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
    // const errors = true;
    if (errors) {
      msg.messageId = "temp_1";
      msg.text = currentText || "";
      msg.datetime = new Date().toISOString();
      msg.userId = currentUser;
      msg.failed = true;
    }

    setMessages([...messages, msg as Message]);
    setCurrentText("");
    window.localStorage.removeItem("msg");
  };

  const handleTextChange = (text: string) => {
    window.localStorage.setItem("msg", text);
    setCurrentText(text);
  };

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
            {messages?.map((message: Message, index) => {
              const isRight = message.userId === currentUser;
              return (
                <MessageRow
                  messageRight={isRight}
                  key={`message_${message.messageId}_${index}`}
                >
                  <MessageWrapper
                    className={`message-${isRight ? "right" : "left"}`}
                  >
                    <div className="avatar-holder">
                      <Image
                        src={imageMapper[message.userId]}
                        alt={`pic of ${message.userId}`}
                        width="48px"
                        height="48px"
                      />
                      <div className="message-sender">{message.userId}</div>
                    </div>
                    <div className="chat-message">{message.text}</div>
                    <div style={{ display: "flex" }}>
                      {message.failed
                        ? [
                            <span className="chat-status">Error</span>,
                            <FontAwesomeIcon
                              icon={faCircleExclamation}
                              style={{
                                color: "#b71e3c",
                                fontSize: "16px",
                              }}
                            />,
                            <div className="chat-hour">
                              {getHourMinute(new Date(message.datetime))}
                            </div>,
                          ]
                        : [
                            <span className="chat-status">Sent</span>,
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              style={{
                                color: "#9ec94a",
                                fontSize: "16px",
                              }}
                            />,
                            <div className="chat-hour">
                              {getHourMinute(new Date(message.datetime))}
                            </div>,
                          ]}
                    </div>
                  </MessageWrapper>
                </MessageRow>
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

export default Chat;
