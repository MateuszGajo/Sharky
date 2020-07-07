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
