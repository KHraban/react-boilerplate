// path resolution module inspired by create-react-app
const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  appTsConfig: resolveApp('tsconfig.json'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appIndexJsx: resolveApp('src/index.jsx'),
  appIndexTsx: resolveApp('src/index.tsx'),
  appHtml: resolveApp('public/index.html'),
};
