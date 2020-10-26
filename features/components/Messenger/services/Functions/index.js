import axios from "axios";

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

export const addMessage = ({
  message,
  userId,
  messageFrom,
  socket,
  setError,
  setMessage,
  setMessages,
}) => {
  axios
    .post("/message/add", { message, userId })
    .then(({ data: { messageId, date } }) => {
      setMessages((prev) => [
        ...prev,
        { id: messageId, userId: messageFrom, message, date },
      ]);
      socket.emit("sendChatMessage", {
        messageId,
        userId,
        message,
        date,
      });
      setMessage("");
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};
