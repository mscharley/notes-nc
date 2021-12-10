import { app, BrowserWindow } from 'electron';
import path from 'path';

app.on('ready', () => {
  console.log('App is ready');

  const win = new BrowserWindow({
    width: 600,
    height: 400,
  });

  const indexHTML = path.join(__dirname, 'index.html');
  win.loadFile(indexHTML).catch((e) => {
    console.error(e);
    process.exit(1);
  });
});
