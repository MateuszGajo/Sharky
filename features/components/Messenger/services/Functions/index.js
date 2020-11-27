import axios from "@features/service/Axios";

export const getMesseges = ({
  userId,
  messages: m,
  setMessages,
  setStatusOfLoading,
}) => {
  axios.post("/message/get", { userId }).then(({ data: { messages } }) => {
    setMessages([...messages, ...m]);
    setStatusOfLoading(false);
  });
};

export const addMessage = ({ message, userId, socket, setMessage }) => {
  socket.emit("sendChatMessage", {
    userId,
    message,
  });
  setMessage("");
};
