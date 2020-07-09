module.exports = {
  // https://github.com/babel/babel/issues/5261
  sourceMaps: 'inline',
  parserOpts: {
    strictMode: true,
  },
  presets: [
    // https://babeljs.io/docs/en/babel-preset-typescript
    // https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats
    // https://babeljs.io/docs/en/babel-plugin-transform-typescript#typescript-compiler-options
    '@babel/preset-typescript',
    '@babel/preset-react',
    ['@babel/preset-env', { targets: { node: 'current' } }],
  ],
  plugins: ['@babel/plugin-transform-react-jsx'],
};
