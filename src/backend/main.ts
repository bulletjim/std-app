import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { createDb } from './db/tableRepository';
import { setupTableHandlers } from './controllers/tableController';
import { logger } from './util/logger';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}
app.whenReady().then(() => {

  const userPath = app.getPath('userData');
  const dbPath = path.join(userPath, 'std.db');

  logger.info('BACKEND/MAIN', 'App Initializing');
  
  // db initialization
  createDb(dbPath);

  // handlers IPC channels initialization
  setupTableHandlers();

  createWindow();
})




const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  logger.info('BACKEND/MAIN', 'System Is Shutting Down');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
ipcMain.on("log-message", (event, level: 'info' | 'warn' | 'error', context: string, message: string, data?: any) => {
  const frontendContext = `FRONTEND:${context}`;

    if (level === 'info') logger.info(frontendContext, message, data);
    if (level === 'warn') logger.warn(frontendContext, message, data);
    if (level === 'error') logger.error(frontendContext, message, data);

})

