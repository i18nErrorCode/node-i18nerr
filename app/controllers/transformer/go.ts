function firstUpperCase(str) {
  return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
    return $1.toUpperCase() + $2.toLowerCase();
  });
}

export default function(dataList: any[]) {
  const raw = `
package i18nErr

type Error struct {
	Code   int32  \`json:"code"\`
	Detail string \`json:"detail"\`
	Prefix string \`json:"prefix"\`
}

func (e *Error) GetCode() int32 {
	return e.Code
}

func (e *Error) GetDetail() string {
	return e.Detail
}

func (e *Error) GetPrefix() string {
	return e.Prefix
}

func (e *Error) Error() string {
	return fmt.Sprintf("%s%d %s", e.Prefix, e.Code, e.Detail)
}

var (
  ${dataList
    .map(d => {
      const key = firstUpperCase(d.key);
      return `
     ${key} = Error{Code: 1, Detail: \`${d.value_en}\`, Prefix: "base"}   // ${d.value_cn}
     `;
    })
    .join('')}
)
  `;

  return raw;
}
