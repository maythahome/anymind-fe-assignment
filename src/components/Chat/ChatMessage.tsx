import {
  faCheckCircle,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import Image, { StaticImageData } from "next/image";
import { MessageDetail } from "features/chat";
import SamPic from "assets/logo/Sam.png";
import JoysePic from "assets/logo/Joyse.png";
import RussellPic from "assets/logo/Russell.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getHourMinute } from "utils/time";
import { MessageRow, MessageWrapper } from "./styles";

const imageMapper: { [key: string]: StaticImageData } = {
  Joyse: JoysePic,
  Sam: SamPic,
  Russell: RussellPic,
};

const MessageStatus = ({ failed }: { failed: boolean | undefined }) => {
  if (failed) {
    return (
      <>
        <span className="chat-status">Error</span>
        <FontAwesomeIcon
          icon={faCircleExclamation}
          style={{
            color: "#b71e3c",
            fontSize: "16px",
          }}
        />
      </>
    );
  }

  return (
    <>
      <span className="chat-status">Sent</span>
      <FontAwesomeIcon
        icon={faCheckCircle}
        style={{
          color: "#9ec94a",
          fontSize: "16px",
        }}
      />
    </>
  );
};

type MessageProps = {
  isRight: boolean;
  message: MessageDetail;
};

const ChatMessage = ({ message, isRight }: MessageProps) => {
  const { failed } = message;
  return (
    <MessageRow messageRight={isRight}>
      <MessageWrapper className={`message-${isRight ? "right" : "left"}`}>
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
          <MessageStatus failed={failed} />
          <div className="chat-hour">
            {getHourMinute(new Date(message.datetime))}
          </div>
        </div>
      </MessageWrapper>
    </MessageRow>
  );
};

export default ChatMessage;
