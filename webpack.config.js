// utils
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const dotenv = require('dotenv');
const paths = require('./config/paths');

// This config was heavily inspired by https://reactjs.org/docs/create-a-new-react-app.html#create-react-app and https://createapp.dev/
// https://v4.webpack.js.org/guides/environment-variables/
const config = (env) => {
  const isProduction = env === 'production';
  const isDevelopment = env === 'development';
  // https://medium.com/@trekinbami/using-environment-variables-in-react-6b0a99d83cf5
  // https://www.npmjs.com/package/dotenv
  // https://github.com/motdotla/dotenv-expand
  const envVariables = dotenv.config().parsed;
  const stringifiedEnvVariables = Object.keys(envVariables).reduce((res, key) => {
    res.process.env[key] = JSON.stringify(envVariables[key]);
    return res;
  }, { process: { env: {} } });
  const shouldUseSourceMap = isDevelopment || process.env.GENERATE_SOURCEMAP !== 'false';
  const shouldUseGzipCompression = isProduction && process.env.USE_GZIP_COMPRESSION !== 'false';
  const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000', 10);
  // Check if TypeScript is setup
  const useTypeScript = fs.existsSync(paths.appTsConfig);

  const mediaFileNameMask = 'static/media/[name].[hash:8].[ext]';
  const cssRegex = /\.css$/;
  const cssModuleRegex = /\.module\.css$/;
  const sassRegex = /\.(scss|sass)$/;
  const sassModuleRegex = /\.module\.(scss|sass)$/;
  const getStyleLoaders = (useModules, preProcessor) => {
    // https://webpack.js.org/guides/asset-management/#loading-css
    // https://blog.jakoblind.no/css-modules-webpack/
    // https://webpack.js.org/loaders/css-loader/#extract
    // https://developerhandbook.com/webpack/how-to-configure-scss-modules-for-webpack/
    const shouldUseModules = useModules === true;
    const loaders = [
      // https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production
      isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: shouldUseSourceMap,
          modules: shouldUseModules,
        },
      },
    ];
    if (preProcessor) {
      loaders.push(
        {
          // https://webpack.js.org/loaders/sass-loader/#problems-with-url
          // https://github.com/bholloway/resolve-url-loader
          loader: 'resolve-url-loader',
          options: {
            sourceMap: shouldUseSourceMap,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            // source map is required here for 'resolve-url-loader' to work
            sourceMap: true,
          },
        },
      );
    }
    const cssLoaderIndex = loaders.findIndex((l) => l.loader === 'css-loader');
    if (cssLoaderIndex >= 0) {
      loaders[cssLoaderIndex].options.importLoaders = loaders.length - cssLoaderIndex - 1;
    }
    return loaders;
  };

  return {
    entry: useTypeScript ? paths.appIndexTsx : paths.appIndexJsx,
    // https://webpack.js.org/configuration/mode/
    mode: isProduction ? 'production' : isDevelopment && 'development',
    // eslint-disable-next-line no-nested-ternary
    devtool: isProduction ? shouldUseSourceMap ? 'source-map' : false : 'inline-source-map',
    output: {
      path: paths.appBuild,
      filename: `static/js/${isProduction ? '[name].[contenthash:8].js' : 'bundle.js'}`,
      // https://webpack.js.org/configuration/output/#outputchunkfilename
      chunkFilename: `static/js/[name].${isProduction ? '[contenthash:8]' : ''}.chunk.js`,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'].filter((ext) => useTypeScript || !ext.includes('ts')),
    },
    module: {
      rules: [
        // https://dev.to/renatobentorocha/how-to-setup-a-react-js-project-with-typcript-eslint-and-prettier-8mn
        // https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project
        // https://itnext.io/how-to-setup-typescript-eslint-prettier-and-react-in-5-minutes-44cfe8af5081
        // https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/
        // https://github.com/typescript-eslint/typescript-eslint
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md
        // webpack integration - https://v4.webpack.js.org/loaders/eslint-loader/
        // eslint config examples
        // https://www.npmjs.com/package/eslint-config-react-app
        // https://www.npmjs.com/package/eslint-config-airbnb-typescript
        {
          enforce: 'pre',
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              options: {
                // https://github.com/webpack-contrib/eslint-loader/issues/129#issuecomment-264898519
                cache: true,
                eslintPath: require.resolve('eslint'),
                formatter: 'codeframe',
                failOnError: false,
              },
              loader: 'eslint-loader',
            },
          ],
        },
        {
          // inspired by create-react-app
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: 'url-loader',
              options: {
                limit: imageInlineSizeLimit,
                name: mediaFileNameMask,
              },
            },
            {
              // https://www.pluralsight.com/guides/how-to-load-svg-with-react-and-webpack
              test: /\.svg$/,
              use: [
                {
                  loader: 'svg-url-loader',
                  options: {
                    limit: imageInlineSizeLimit,
                    name: mediaFileNameMask,
                  },
                },
              ],
            },
            // https://iamturns.com/typescript-babel/
            // https://www.evanlouie.com/posts/typescript-babel-preset-typescript-ts-loader
            // https://babeljs.io/docs/en/babel-preset-typescript
            // https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats
            // https://babeljs.io/docs/en/babel-plugin-transform-typescript#typescript-compiler-options
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              use: {
                loader: 'babel-loader',
                options: {
                  // From create-react-app:
                  // Babel sourcemaps are needed for debugging into node_modules
                  // code.  Without the options below, debuggers like VSCode
                  // show incorrect code and set breakpoints on the wrong lines.
                  sourceMaps: shouldUseSourceMap,
                  inputSourceMap: shouldUseSourceMap,
                },
              },
              exclude: /node_modules/,
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders(false),
            },
            {
              test: cssModuleRegex,
              use: getStyleLoaders(true),
            },
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(false, 'sass-loader'),
            },
            {
              test: sassModuleRegex,
              use: getStyleLoaders(true, 'sass-loader'),
            },
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              loader: require.resolve('file-loader'),
              // From create-react-app docs:
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: mediaFileNameMask,
              },
            },
            // !!! WARNING: file-loader from above acts as a catch-all loader. All the
            // additional loaders should be added before it.
          ],
        },
      ],
    },
    // https://webpack.js.org/configuration/optimization/#root
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          // create-react-app applies additional settings here - see ejected code
          sourceMap: shouldUseSourceMap,
        }),
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: {
            map: shouldUseSourceMap
              ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true,
              }
              : false,
          },
        }),
      ],
      // https://webpack.js.org/configuration/optimization/#optimizationsplitchunks
      runtimeChunk: 'single',
      splitChunks: {
        // From docs - It is recommended to set splitChunks.name to false
        // for production builds so that it doesn't change names unnecessarily.
        name: false,
        // https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkschunks
        chunks: 'all',
      },
    },
    devServer: {
      // https://v4.webpack.js.org/configuration/dev-server/
      // From docs - If you're having trouble,
      // navigating to the /webpack-dev-server route will show where files are served.
      // For example, http://localhost:8080/webpack-dev-server.
      contentBase: paths.appPublic,
      historyApiFallback: true,
      open: true,
      // https://v4.webpack.js.org/guides/hot-module-replacement/
      // react component hot loader https://github.com/gaearon/react-hot-loader
      hot: true,
      // By default files from `contentBase` will not trigger a page reload.
      watchContentBase: true,
      stats: 'errors-only',
      compress: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        filename: 'index.html',
        favicon: path.resolve(__dirname, 'public/logo.png'),
        ...(isProduction ? {
          // https://github.com/jantimon/html-webpack-plugin#minification
          // https://github.com/DanielRuf/html-minifier-terser
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : undefined),
      }),
      // This plugin will display an error overlay in your application
      // https://github.com/smooth-code/error-overlay-webpack-plugin
      new ErrorOverlayPlugin(),
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin(stringifiedEnvVariables),
      new MiniCssExtractPlugin({
        // https://github.com/webpack-contrib/mini-css-extract-plugin#advanced-configuration-example
        // Options similar to the same options in webpackOptions.output
        // https://webpack.js.org/plugins/mini-css-extract-plugin/#long-term-caching
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
      // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#readme
      // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/tree/master/examples/babel-loader
      useTypeScript && new ForkTsCheckerWebpackPlugin({
        async: isDevelopment,
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
      shouldUseGzipCompression && new CompressionPlugin(),
    ].filter(Boolean),
  };
};

module.exports = config;
