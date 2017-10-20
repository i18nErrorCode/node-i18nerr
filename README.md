### I18n，多语言管理平台

[![Greenkeeper badge](https://badges.greenkeeper.io/i18nErrorCode/node-i18nerr.svg)](https://greenkeeper.io/)

**开发初衷**

主要是为了解决几个问题: 

1. 与其他后端协作开发时，错误码不能够保证唯一，有可能会有冲突
2. 错误列表不共享

> 假设一个项目，2个前端，3个后端. 3个后端都有各自的错误列表.
> 每更改一次，都要相互告诉对方，并且告诉前端。
> 这样一来不严谨，谁要是粗心更改了哪个字母，谁知道呢. 容易出错

解决了: 
1. 唯一性: 保证每个人创建的错误代码是唯一的，不会有冲突
2. 重用性: 这个错误列表可以给前端/后端/移动端使用
3. IDE支持: 可以生成JSON/XML/js/ts/go...文件，IDE直接高亮了有木有?

### 技术栈

- [x] Typescript
- [x] Express
- [x] Postgres
- [x] GraphQL

### 依赖环境

- [Nodejs@7.6.0+](https://nodejs.org/)
- [Postgres@9.4+](https://www.postgresql.org/)

## 参与贡献

```bash
git clone https://github.com/i18nErrorCode/node-i18nerr.git
cd ./node-i18nerr
yarn
yarn run start
```

You can flow [Contribute Guide](https://github.com/i18nErrorCode/node-i18nerr/blob/master/contributing.md)

## 贡献者

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroy/wxapp-http/commits?author=axetroy "Code") [🔌](#plugin-axetroy "Plugin/utility libraries") [⚠️](https://github.com/axetroy/wxapp-http/commits?author=axetroy "Tests") [🐛](https://github.com/axetroy/wxapp-http/issues?q=author%3Aaxetroy "Bug reports") [🎨](#design-axetroy "Design") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## 开源许可

The [Apache License](https://github.com/i18nErrorCode/node-i18nerr/blob/master/LICENSE)