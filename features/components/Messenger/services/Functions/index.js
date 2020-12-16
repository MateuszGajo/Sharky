import axios from "~features/service/Axios";

export const getMesseges = ({
  userId,
  messages: m,
  setMessages,
  setStatusOfLoading,
  from,
  setStatusOfMore,
  setScrollDown,
}) => {
  axios
    .post("/message/get", { userId, from })
    .then(({ data: { messages, isMore } }) => {
      setMessages([...m, ...messages]);
      setStatusOfMore(isMore);
      if (setStatusOfLoading) setStatusOfLoading(false);
      if (setScrollDown) setScrollDown((prev) => prev + 1);
    });
};

export const addMessage = ({ message, userId, socket, setMessage }) => {
  socket.emit("sendChatMessage", {
    userId,
    message,
  });
  setMessage("");
};
