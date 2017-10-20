export default function(dataList: any[]) {
  const entity = {};
  dataList.forEach(d => {
    entity[d.key] = {
      en: d.value_en,
      cn: d.value_cn,
      tw: d.value_tw
    };
  });

  // TODO： 求PR，完善GO
  return JSON.stringify(entity, null, 2);
}
