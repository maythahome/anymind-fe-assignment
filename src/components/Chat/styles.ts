import styled from "@emotion/styled";

export const ChatBody = styled.div({
  display: "inline-flex",
  width: "100%",
  flexWrap: "nowrap",
  backgroundColor: "#f4f5fa",
});

export const ChatSideNav = styled.div({
  width: "30%",
  borderRight: "1px solid #e6ecf3",
});

export const ChatRightSide = styled.div({
  width: "70%",
});

export const ChatSideNavMenu = styled.div({
  padding: "1em",
});

export const ChatSideNavItem = styled.div<{ isClick: boolean }>((props) => ({
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

export const ChatChannelNameHolder = styled.div({
  height: "64px",
  padding: "20px 15px",
  borderBottom: "1px solid #e6ecf3",
});

export const ChatWindow = styled.div({
  minHeight: "60vh",
  padding: "1rem",
});

export const TextArea = styled.textarea({
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

export const ChatControlHolder = styled.div({
  padding: "0.375rem 0.75rem",
});

export const Select = styled.select({
  width: "100%",
  height: "35px",
  borderRadius: "4px",
  border: "1px solid #ced4da",
  padding: "0.375rem .75rem",
});

export const Button = styled.button({
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

export const MessageHolder = styled.div({
  height: "500px",
  overflowY: "scroll",
});

export const MessageRow = styled.div<{ messageRight: boolean }>((props) => {
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

export const MessageWrapper = styled.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});
