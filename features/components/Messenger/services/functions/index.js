import axios from "axios";

export const getMesseges = ({
  idChat,
  messages: m,
  setMessages,
  setStatusOfLoading,
}) => {
  axios
    .post("/message/get", { idChat })
    .then(({ data: { messages } }) => {
      setMessages([...messages, ...m]);
      setStatusOfLoading(false);
    })
    .catch((err) => console.log(err));
};

export const addMessage = ({
  idChat,
  message,
  idUser,
  date,
  messageTo,
  socket,
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
    .catch((err) => console.log(err));
};
