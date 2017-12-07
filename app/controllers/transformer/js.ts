export default function(dataList: any[], tableName) {
  const entity = {};
  dataList.forEach(d => {
    entity[d.key] = {
      en: d.value_en,
      cn: d.value_cn,
      tw: d.value_tw
    };
  });

  return `/* generate by i18n error platform, please do not edit it */
class I18nError extends Error {
  constructor(Code, Detail, Prefix) {
    super(Detail);
    this.Code = Code;
    this.Detail = Detail;
    this.Prefix = Prefix;
    this.vars = null;
  }
  GetCode() {
    return this.Code;
  }
  GetDetail() {
    return this.Detail;
  }
  SetDetail(detail) {
    this.Detail = detail;
    return this;
  }
  GetPrefix() {
    return this.Prefix;
  }
  SetVars(vars) {
    this.vars = vars;
    return this;
  }
  Error() {
    return this.toString();
  }
  toString() {
    return this.Prefix + this.Code + '|' + this.Detail;
  }
}
  
module.exports = {
${dataList
    .sort(v => -v.key)
    .map(d => {
      return `  ${d.key}: new I18nError(${d.code}, "${d.value_en}", "${d.tableName ||
        tableName}"), // ${d.value_cn}`;
    })
    .join('\n')}
};
`;
}
