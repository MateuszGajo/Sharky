import axios from "~features/service/Axios";

export const getFriends = ({ users, setUsers }) => {
  axios.get("/friend/get").then(({ data: { friends } }) => {
    setUsers([...users, ...friends]);
  });
};
