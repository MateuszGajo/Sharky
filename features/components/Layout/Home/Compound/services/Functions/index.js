import axios from "axios";

export const getFriends = ({ users, setUsers, socket }) => {
  axios
    .get("/friend/get")
    .then(({ data: { friends } }) => {
      setUsers([...users, ...friends]);
    })
    .catch((err) => console.log(err));
};

export const joinChat = ({ users }) => {
  axios.post("/friend/chat/join", { users }).then((resp) => console.log(resp));
};
