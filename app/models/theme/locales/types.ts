import { EN_LABELS } from './en';

export type DeepStringShape<T> = T extends string ? string : { [K in keyof T]: DeepStringShape<T[K]> };

export type LocaleLabels = DeepStringShape<typeof EN_LABELS>;

export type ThemeLocaleEntry = {
  code: string;
  labels: LocaleLabels;
};
