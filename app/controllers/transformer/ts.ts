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
interface I18nError$ {
  Code: number;
  Detail: string;
  Prefix: string;
  vars: any;
  GetCode(): number;
  GetDetail(): string;
  SetDetail(detail: string): this;
  GetPrefix(): string;
  SetVars(vars: any): this;
  Error(): string;
}

export default class I18nError extends Error implements I18nError$ {
  public vars: any;
  constructor(public Code: number, public Detail: string, public Prefix: string) {
    super(Detail);
  }
  GetCode(): number {
    return this.Code;
  }
  GetDetail(): string {
    return this.Detail;
  }
  SetDetail(detail: string): this {
    this.Detail = detail;
    return this;
  }
  GetPrefix(): string {
    return this.Prefix;
  }
  SetVars(vars: any): this {
    this.vars = vars;
    return this;
  }
  Error(): string {
    return this.toString();
  }
  toString(): string {
    return this.Prefix + this.Code + '|' + this.Detail;
  }
}

${dataList
    .sort(v => -v.key)
    .map(d => {
      return `export const ${d.key} = new I18nError(${d.code}, "${d.value_en}", "${d.tableName ||
        tableName}"); // ${d.value_cn}`;
    })
    .join('\n')}
`;
}
