import axios from "axios";

export const getMesseges = ({
  idChat,
  messages: m,
  setMessages,
  setStatusOfLoading,
}) => {
  axios.post("/message/get", { idChat }).then(({ data: { messages } }) => {
    setMessages([...messages, ...m]);
    setStatusOfLoading(false);
  });
};

export const addMessage = ({
  idChat,
  message,
  idUser,
  date,
  messageTo,
  socket,
  setError,
}) => {
  axios
    .post("/message/add", { idChat, message, idUser, date })
    .then(({ data: { idMessage } }) =>
      socket.emit("sendChatMessage", {
        idMessage,
        idChat,
        idUser,
        message,
        date,
        messageTo,
      })
    )
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};
