import axios from "axios";

export const getOwner = ({ setStatusOfAuth, setOwner }) => {
  axios
    .get("/user/me")
    .then(({ data: { user } }) => {
      setOwner(user);
      setStatusOfAuth(true);
    })
    .catch(({ response: { status } }) => {
      if (status == 401) setStatusOfAuth(false);
    });
};
