import axios from "axios";
import countryCode from "@root/utils/countryCode";
import i18next from "@i18n";
const { i18n } = i18next;

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

export const checkLanguage = () => {
  axios.get("/user/get/language").then(({ data: { language } }) => {
    const code = countryCode(language);
    if (i18n.language != code) {
      i18n.changeLanguage(code);
    }
  });
};
