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
  application.on('exit', clearServer);
}

const createWebServer = () => {
  return new Promise((resolve, reject) => {
    server = spawn('node ./src/api/app.js', null, { shell: true });
    resolve();
  });
}

const createDevServer = () => {
  return new Promise((resolve, reject) => {
    server = spawn('react-scripts start', null, { shell: true });
    resolve();
  });
}

const clearServer = () => {
  return new Promise((resolve, reject) => {
    server.kill();
    process.exit();
  });
}

const exitHandler = (options, exitCode) => {
  clearServer()
    .then(() => {
      process.exit();
    })
    .catch(err => {
      process.exit();
    })
}

const addExitHandler = () => {
  process.stdin.resume();
  process.on('exit', exitHandler.bind(null,{cleanup:true}));
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));
  process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
  process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
}

const main = () => {
  addExitHandler();
  if (args.production) {
    createWebServer()
      .then(() => {
        createApplication();
      })
      .catch(err => {
        console.log(err);
        process.exit();
      })
  } else {
    createDevServer()
      .then(() => {
        createApplication();
      })
      .catch(err => {
        console.log(err);
        process.exit();
      })
  }
}

main();
