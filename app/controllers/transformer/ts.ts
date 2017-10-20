export default function(dataList: any[]) {
  const entity = {};
  dataList.forEach(d => {
    entity[d.key] = {
      en: d.value_en,
      cn: d.value_cn,
      tw: d.value_tw
    };
  });

  return `
export interface I18n$ {
  [key:string]: {
    en: string;
    cn: string;
    tw: string;
  }
}
const i18n:I18n$ = ${JSON.stringify(entity, null, 2)};
export default i18n;`;
}
