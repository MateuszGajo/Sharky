import axios from "axios";
import countryCode from "@root/utils/countryCode";

const validateEmail = (email) => {
  const emailRegex = /^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  return emailRegex.test(email);
};

const validatePassword = (password, confirmPassword) => {
  if (password !== confirmPassword) return "different-passwords";
  else if (password.length < 6) return "password-too-short";
  return "";
};

const validatePhone = (phone) => {
  const numberRegex = /^\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;
  return numberRegex.test(phone);
};

const validateAccount = (name, value, confirmPassword) => {
  if (name === "email") {
    if (!validateEmail(value)) return "invalid-email";
  } else if (name === "password") {
    const validateMessage = validatePassword(value, confirmPassword);
    if (validateMessage) return validateMessage;
  } else if (name === "phone") {
    if (!validatePhone(value)) return "invalid-phone";
  }
  return "";
};

const validateGeneral = (items, item) => {
  let found = false;
  for (let i = 0; i < items.length; i++) {
    if (items[i].value.toLowerCase() === item.toLowerCase()) {
      found = true;
      break;
    }
  }
  return found;
};

export const validateField = (
  type,
  value,
  name,
  countries,
  languages,
  confirmPassword,
  setOpenConfirmPopUp
) => {
  if (type === "account") {
    const validateMessage = validateAccount(name, value, confirmPassword);
    if (validateMessage) {
      return validateMessage;
    }
    setOpenConfirmPopUp(true);
  } else {
    const items = name === "country" ? countries : languages;
    if (!validateGeneral(items, value)) {
      return `invalid-${name}`;
    }
  }
};

export const getCountries = (t, setCountries) => {
  axios.get("/country/get").then(({ data: { countries: data } }) => {
    const countries = data.map((item) => {
      const { name } = item;
      return {
        name,
        value: t(`settings:countries.${name}`),
      };
    });
    setCountries(countries);
  });
};

export const getLanguages = (t, setLanguages) => {
  axios.get("/language/get").then(({ data: { languages: data } }) => {
    const languages = data.map((item) => {
      const { name } = item;
      return {
        name,
        value: t(`settings:languages.${name}`),
      };
    });
    setLanguages(languages);
  });
};

export const getValue = (t, name, type, setValue) => {
  axios.post("/user/get/item", { value: name }).then(({ data: { item } }) => {
    if (type == "general")
      setValue(
        t(`settings:${name === "country" ? "countries" : "languages"}.${item}`)
      );
    else setValue(item);
  });
};

export const changeValue = (
  name,
  value,
  countries,
  languages,
  t,
  setPrompt,
  setName,
  setError,
  language,
  i18n
) => {
  const dbValue = (name == "country" ? countries : languages).find((item) => {
    if (item.value.toLowerCase() === value.toLowerCase()) return item;
  });
  axios
    .post(`/user/change/${name}`, { value: dbValue.name })
    .then(() => {
      const choseCountryCode = countryCode(dbValue.name.toLowerCase());
      if (name === "language") {
        if (language != choseCountryCode) {
          i18n.changeLanguage(choseCountryCode);
          setPrompt(t(`settings:general.${name}-changed`));
          setName("");
        }
        setError("");
      } else {
        setPrompt(t(`settings:general.${name}-changed`));
        setName("");
      }
    })
    .catch(({ response: { status, data } }) => {});
};

export const changeValueWithConfirmPassword = (
  name,
  value,
  userPassword,
  setOpenConfirmPopUp,
  setConfirmPopUpError,
  t,
  setPrompt,
  setName
) => {
  axios
    .post(`/user/change/${name}`, { value, password: userPassword })
    .then(() => {
      setOpenConfirmPopUp(false);
      setPrompt(t(`settings:account.${name}-changed`));
      setName("");
    })
    .catch(({ response: { status, data } }) => {
      if (
        (status === 401 && data === "invalid-password") ||
        (status === 400 && data === "password-too-short")
      )
        setConfirmPopUpError(data);
    });
};
