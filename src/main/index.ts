import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

app.on('ready', () => {
  console.log('App is ready');

  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.handle('hello-world', () => {
    console.log('Hello world from the browser!');
  });

  const indexHTML = path.join(__dirname, '../renderer/index.html');
  win.loadFile(indexHTML).catch((e) => {
    console.error(e);
    process.exit(1);
  });
});
