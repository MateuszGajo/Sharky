import axios from "axios";

export const getOwner = (setOwner) => {
  axios
    .get("/user/me")
    .then(({ data: { user } }) => {
      setOwner(user);
    })
    .catch((err) => console.log(err));
};
