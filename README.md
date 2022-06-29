# folder-analyzer

> Folder analyzer, based on webpack bundle analyzer

## Usage

- Just use `npx` to execute

```sh
npx folder-analyzer [any folder]
```

- Or use it in your project, see [Install](#install)

## Install

```sh
npm i folder-analyzer
# or
yarn add folder-analyzer
# or
pnpm add folder-analyzer
```

### Commonjs

```js
const { start } = require('folder-analyzer')

start('https://github.com/KusStar/gkd', './folder-analyzer')
```

### ES6

```js
import { download, downloadWithCheck } from 'folder-analyzer'

downloadWithCheck('https://github.com/KusStar/folder-analyzer', './folder-analyzer')
```

## License

- [MIT](./LICENSE)
