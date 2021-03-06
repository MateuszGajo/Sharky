import LanguageDetector from "i18next-browser-languagedetector";
import NextI18Next from "next-i18next";
import { initReactI18next } from "react-i18next";

export default new NextI18Next({
  use: [LanguageDetector, initReactI18next],
  defaultLanguage: "pl",
  otherLanguages: ["en"],
  load: "languageOnly",
  ns: [
    "common",
    "component",
    "signin",
    "signup",
    "home",
    "fanpage",
    "fanpages",
    "friends",
    "group",
    "groups",
    "messages",
    "news",
    "notifications",
    "profile",
    "post",
    "settings",
  ],
  defaultNS: "common",
  detection: {
    order: ["cookie", "localStorage"],
    lookupCookie: "next-i18next",
    lookupLocalStorage: "i18nextLng",
    caches: ["cookie", "localStorage"],
  },
  react: {
    bindI18n: "languageChanged",
    useSuspense: false,
  },
});
