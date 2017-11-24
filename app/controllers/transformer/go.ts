function firstUpperCase(str) {
  return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
    return $1.toUpperCase() + $2.toLowerCase();
  });
}

export default function(dataList: any[]) {
  const raw = `
package i18nErr

import (
	"fmt"
)

type Error struct {
	Code   int32
	Detail string
	Prefix string
	vars   []interface{}
}

func (e *Error) GetCode() int32 {
	return e.Code
}

func (e *Error) GetDetail() string {
	return e.Detail
}

func (e *Error) SetDetail(c string) *Error {
	e.Detail = c
	return e
}

func (e *Error) GetPrefix() string {
	return e.Prefix
}

func (e *Error) GetVars() []interface{} {
	return e.vars
}

func (e *Error) SetVars(con ...interface{}) *Error {
	e2 := &Error{}
	*e2 = *e
	e2.vars = con
	return e2
}

func (e *Error) Error() string {
	return fmt.Sprintf("%s%d %s", e.Prefix, e.Code, e.Detail)
}

var (
  ${dataList
    .map(d => {
      const key = firstUpperCase(d.key);
      return `
     ${key} = &Error{Code: 1, Detail: \`${d.value_en}\`, Prefix: "base"}   // ${d.value_cn}
     `;
    })
    .join('')}
)
  `;

  return raw;
}
