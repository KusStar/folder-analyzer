# folder-analyzer

> Folder analyzer, based on webpack bundle analyzer

## Usage

- Just use `npx` to execute

```sh
npx folder-analyzer <any folder> [options]
```

```sh
folder-analyzer

Usage:
  $ folder-analyzer <command> [options]

Options:
  --watch     Watch for changes (default: false)
  --exclude   Exclude files or folders (default: node_modules/**, .git/**)
  -h, --help  Display this message
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

start('./folder-analyzer', {
  watch: true
})
```

### ES6

```js
import { start } from 'folder-analyzer'

start('./folder-analyzer', {
  watch: true
})
```

## License

- [MIT](./LICENSE)
