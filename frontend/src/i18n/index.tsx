
import React, { createContext, useContext, useState, ReactNode } from "react";
import en from "./en";
import fi from "./fi";

type Lang = "en" | "fi";
type Dict = typeof en;

const dictionaries: Record<Lang, Dict> = { en, fi };

type I18nContextProps = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
};

const I18nContext = createContext<I18nContextProps>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = (path: string) => {
    const keys = path.split(".");
    let value: any = dictionaries[lang];
    for (const key of keys) value = value?.[key];
    return value ?? path;
  };
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
