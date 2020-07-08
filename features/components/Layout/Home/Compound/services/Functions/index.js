import axios from "axios";

export const getFriends = ({ users, setUsers, socket }) => {
  axios
    .get("/friend/get")
    .then(({ data: { friends } }) => {
      for (let i = 0; i < friends.length; i++) {
        socket.emit("chat", friends[i].idChat);
      }
      setUsers([...users, ...friends]);
    })
    .catch((err) => console.log(err));
};
