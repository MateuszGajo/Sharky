import axios from "axios";

export const getMesseges = ({
  chatId,
  messages: m,
  setMessages,
  setStatusOfLoading,
}) => {
  axios.post("/message/get", { chatId }).then(({ data: { messages } }) => {
    setMessages([...messages, ...m]);
    setStatusOfLoading(false);
  });
};

export const addMessage = ({
  chatId,
  message,
  userId,
  date,
  messageTo,
  socket,
  setError,
  setMessage,
}) => {
  axios
    .post("/message/add", { chatId, message, userId, date })
    .then(({ data: { messageId } }) => {
      socket.emit("sendChatMessage", {
        messageId,
        chatId,
        userId,
        message,
        date,
        messageTo,
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
