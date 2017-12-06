export default function(dataList: any[], tableName) {
  const entity = {};
  dataList.forEach(d => {
    entity[tableName + d.code] = {
      en: d.value_en,
      cn: d.value_cn,
      tw: d.value_tw
    };
  });

  return JSON.stringify(entity, null, 2);
}
