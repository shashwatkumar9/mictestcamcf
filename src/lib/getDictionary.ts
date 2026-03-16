import type { Locale } from './i18n';
// Import the actual en.json to get proper type inference
import enMessages from '../messages/en.json';
// Force rebuild - updated 2026-02-08

const dictionaries = {
  // Base languages
  en: () => import('../messages/en.json').then((module) => module.default),
  es: () => import('../messages/es.json').then((module) => module.default),
  fr: () => import('../messages/fr.json').then((module) => module.default),
  de: () => import('../messages/de.json').then((module) => module.default),
  it: () => import('../messages/it.json').then((module) => module.default),
  pt: () => import('../messages/pt.json').then((module) => module.default),
  nl: () => import('../messages/nl.json').then((module) => module.default),
  pl: () => import('../messages/pl.json').then((module) => module.default),
  ru: () => import('../messages/ru.json').then((module) => module.default),
  ja: () => import('../messages/ja.json').then((module) => module.default),
  ko: () => import('../messages/ko.json').then((module) => module.default),
  zh: () => import('../messages/zh.json').then((module) => module.default),
  ar: () => import('../messages/ar.json').then((module) => module.default),
  hi: () => import('../messages/hi.json').then((module) => module.default),
  tr: () => import('../messages/tr.json').then((module) => module.default),
  vi: () => import('../messages/vi.json').then((module) => module.default),
  th: () => import('../messages/th.json').then((module) => module.default),
  id: () => import('../messages/id.json').then((module) => module.default),
  ms: () => import('../messages/ms.json').then((module) => module.default),
  sv: () => import('../messages/sv.json').then((module) => module.default),
  no: () => import('../messages/no.json').then((module) => module.default),
  da: () => import('../messages/da.json').then((module) => module.default),
  fi: () => import('../messages/fi.json').then((module) => module.default),
  cs: () => import('../messages/cs.json').then((module) => module.default),
  // Regional variants
  'pt-br': () => import('../messages/pt-br.json').then((module) => module.default),
  'es-mx': () => import('../messages/es-mx.json').then((module) => module.default),
  'zh-cn': () => import('../messages/zh-cn.json').then((module) => module.default),
  'zh-tw': () => import('../messages/zh-tw.json').then((module) => module.default),
  'en-gb': () => import('../messages/en-gb.json').then((module) => module.default),
  'fr-ca': () => import('../messages/fr-ca.json').then((module) => module.default),
  // Additional languages
  fa: () => import('../messages/fa.json').then((module) => module.default),
  uk: () => import('../messages/uk.json').then((module) => module.default),
  bn: () => import('../messages/bn.json').then((module) => module.default),
  ur: () => import('../messages/ur.json').then((module) => module.default),
  tl: () => import('../messages/tl.json').then((module) => module.default),
  ro: () => import('../messages/ro.json').then((module) => module.default),
  hu: () => import('../messages/hu.json').then((module) => module.default),
  he: () => import('../messages/he.json').then((module) => module.default),
  el: () => import('../messages/el.json').then((module) => module.default),
  bg: () => import('../messages/bg.json').then((module) => module.default),
  sk: () => import('../messages/sk.json').then((module) => module.default),
  hr: () => import('../messages/hr.json').then((module) => module.default),
  lt: () => import('../messages/lt.json').then((module) => module.default),
  sr: () => import('../messages/sr.json').then((module) => module.default),
  ca: () => import('../messages/ca.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
};

// Use the imported type directly instead of inferring from return type
export type Dictionary = typeof enMessages;
// Force rebuild - updated 2026-02-08
