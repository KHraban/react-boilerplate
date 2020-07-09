# react-boilerplate

Because why would anyone use official and well-supported [Create React App](https://github.com/facebook/create-react-app) when you can build your own.
This is an educational project, aimed at setting up
React+Webpack build pipeline from scratch.

## Available scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode using `webpack-dev-server`.

### `npm run test`

Launches test runner.

### `npm run lint`

Runs linter against files in `./src` folder

### `npm run build-dev`

Builds development version of the application. This configuration does not apply any
optimizations like file minification or css extraction on to the build artifacts.

### `npm run build-prod`

Builds production version of the application. This includes file minification and css files extraction
for better performance as well as adding hashes to the files names.
Additional build options allow addition of source maps and/or .gzip versions
of build artifacts (see .env for details).

## Supported features

- Both typescript and javascript using babel compiler
- Environment variables
- Css and Sass (both global and modules)
- Code linting for both typescript and javascript files (provided setup uses popular airbnb configuration)
- Image files (including small optimizations, like url encoding of small files)
- Production build optimizations
- Development server
- Test runner
