import axios from "axios";

export const getFriends = ({ users, setUsers }) => {
  axios.get("/friend/get").then(({ data: { friends } }) => {
    setUsers([...users, ...friends]);
  });
};
