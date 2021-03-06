# Contributing

There are many ways to help out and contribute to this project. As of right now, the best way to help out is to use the app in new environments and try to find any issues. If you are not using a fully supported operating system then keep reading for how to get going with a development build.

## Local development

The local development workflow is built around Visual Studio Code. Other IDE's will almost certainly work, but it may take some work to get the run configurations working as well as they do in Code.

1. Ensure that `npm start` is running in the background. This sets up a live development server on your computer.
2. Run the "Electron: All" launch configuration. This will start the electron main process and also try to attach to the browser window when it opens so that you can debug both electron processes.

## Architecture

[See the Architecture Decision Record.][adr-docs]

[adr-docs]: https://github.com/mscharley/notes-nc/tree/main/docs/adr

## Releases

Doing a release is a short process:

1. `npm version {patch | minor | major}` - Bump the version in the package.json file.
2. `git push origin main tag {tag-name}` - Push the updates to github for processing. NPM prints the tag name that it creates when you run the first command.
3. Create a release on Github from the tag which will trigger the build process to create final artifacts for the release.
