export default function(dataList: any[], tableName) {
  const entity = {};
  dataList.forEach(d => {
    entity[d.key] = {
      en: d.value_en,
      cn: d.value_cn,
      tw: d.value_tw
    };
  });

  const keys = {};

  return `/* generate by i18n error platform, please do not edit it */
interface I18nError$ {
  code: number;
  detail: string;
  prefix: string;
  vars: any;
  context: any;
  GetCode(): number;
  GetDetail(): string;
  SetDetail(detail: string): this;
  GetPrefix(): string;
  SetVars(vars: any): this;
  SetContext(context: any): this;
  GetContext(): any;
  Error(): string;
}

export default class I18nError extends Error implements I18nError$ {
  public vars: any;
  public context: any;
  constructor(public code: number, public detail: string, public prefix: string) {
    super(detail);
  }
  GetCode(): number {
    return this.code;
  }
  GetDetail(): string {
    return this.detail;
  }
  SetDetail(detail: string): this {
    this.detail = detail;
    return this;
  }
  GetPrefix(): string {
    return this.prefix;
  }
  SetVars(vars: any): this {
    this.vars = vars;
    return this;
  }
  SetContext(context: any): this {
    this.context = context;
    return this;
  }
  GetContext(): any {
    return this.context;
  }
  Error(): string {
    return this.toString();
  }
  toString(): string {
    return this.prefix + this.code + '|' + this.detail;
  }
}

${dataList
    .sort(v => -v.key)
    .map(d => {
      if (!keys[d.key]) {
        keys[d.key] = d;
        return `export const ${d.key} = new I18nError(${d.code}, "${d.value_en}", "${d.tableName ||
          tableName}"); // ${d.value_cn}`;
      } else {
        return `// duplicate with the key "${d.key}" in module "${keys[d.key].tableName}"`;
      }
    })
    .join('\n')}
    
/**
 * i18nCatch
 * @param {Promise<any>} p
 * @returns {Promise<I18nError>}
 */
export function i18nCatch(p: Promise<any>): Promise<I18nError> {
  return p.catch(err => {
    return Promise.reject(fromError(err));
  });
}

/**
 * cover error to I18nError
 * @param err
 * @returns {I18nError}
 */
export function fromError(err): I18nError {
  return new I18nError(err.code || 0, err.detail || err.message, err.prefix || '');
}
`;
}
