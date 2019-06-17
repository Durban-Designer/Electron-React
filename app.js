/*
Copyright 2019 Durban-Designer : Royce Birnbaum

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in the
Software without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const pm2 = require('pm2');
const { spawn} = require('child_process');
const args = require("args-parser")(process.argv);
var server,
  application;

const createApplication = () => {
  application = spawn('electron ./src/electron/main.js', null, { shell: true });
}

const createWebServer = () => {
  return new Promise((resolve, reject) => {
    server = spawn('node ./src/api/app.js', null, { shell: true });
    server.on('exit', () => {
      process.exit(0);
    });
    resolve();
  });
}

const createDevServer = () => {
  return new Promise((resolve, reject) => {
    server = spawn('react-scripts start', null, { shell: true, detached: true });
    server.on('exit', () => {
      process.exit(0);
    });
    resolve();
  });
}

const clearServer = () => {
  process.kill(server.pid);
  process.exit(0);
}

const clearServerDev = () => {
  process.kill(server.pid);
  process.kill(server.pid++);
  process.exit(0);
}

const createNativeApp = (platform) => {
  if (platform === 'android') {
    application = spawn('react-native run-android --root "./src/native/android"', null, { shell: true, detached: true });
  } else {
    application = spawn('react-native run-ios --project-path "./src/native/ios"', null, { shell: true, detached: true });
  }
}

const exitHandler = (options, exitCode) => {
  clearServer()
}

const exitHandlerDev = (options, exitCode) => {
  clearServerDev()
}

const addExitHandler = () => {
  process.stdin.resume();
  process.on('exit', exitHandler.bind(null,{cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
  process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
}

const addDevExitHandler = () => {
  process.stdin.resume();
  process.on('exit', exitHandlerDev.bind(null,{cleanup:true}));
  process.on('SIGINT', exitHandlerDev.bind(null, {exit:true}));
  process.on('SIGUSR1', exitHandlerDev.bind(null, {exit:true}));
  process.on('SIGUSR2', exitHandlerDev.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandlerDev.bind(null, {exit:true}));
}

const main = () => {
  if (args.production) {
    addExitHandler();
    createWebServer()
      .then(() => {
        createApplication();
        application.on('exit', clearServer);
      })
      .catch(err => {
        console.log(err);
        process.exit();
      })
  } else if (args.native) {
    createNativeApp(args.platform);
  } else {
    addDevExitHandler();
    createDevServer()
      .then(() => {
        setTimeout(() => {
          createApplication();
          application.on('exit', clearServerDev);
        }, 5000);
      })
      .catch(err => {
        console.log(err);
        process.exit();
      })
  }
}

main();
