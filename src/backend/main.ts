/**
 * Electron Main Process Entry Point.
 * Handles lifecycle events, native window creation, IPC registry, and environment initialization.
 * 
 * @module MainProcess
 */

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { createDb } from './db/tableRepository';
import { setupTableHandlers } from './controllers/tableController';
import { logger } from './util/logger';
import { updateElectronApp } from 'update-electron-app';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

/**
 * Flag indicating whether the application is running in development mode.
 * Evaluates to `true` when unpackaged and `false` in production builds.
 */
const isDev = !app.isPackaged;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

/**
 * Application initialization lifecycle handler.
 * Resolves storage paths, connects SQLite DB, registers IPC handlers,
 * and launches the primary window upon application readiness.
 */
app.whenReady().then(() => {
  // Auto updater configuration
  updateElectronApp({
    updateInterval: '1 week', 
    notifyUser: true          
  });
  const userPath = app.getPath('userData');
  const dbPath = path.join(userPath, 'std.db');
  
  logger.info('BACKEND-MAIN', 'Database path resolved', dbPath);

  logger.info('BACKEND-MAIN', 'App Initializing');
  
  // db initialization
  createDb(dbPath);

  // handlers IPC channels initialization
  setupTableHandlers();

  createWindow();
});

/**
 * Instantiates and configures the main Electron {@link BrowserWindow}.
 * Enforces web security preferences, loads Vite dev server or build files,
 * and sets production navigation/devtools guards.
 */
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
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

  // --- Production & Development Management ---
  if (isDev) {
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.setMenu(null);
    
    // Production: forces devTools quit if triggered
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });

    // Production: prevents clickjacking blocking external url
    mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
      if (!navigationUrl.startsWith('file://')) {
        logger.warn('SECURITY', `Blocked attempt to navigate to external URL: ${navigationUrl}`);
        event.preventDefault();
      }
    });
  }
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  logger.info('BACKEND-MAIN', 'System Is Shutting Down');
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

/**
 * Global IPC listener for logging events dispatched from the renderer context.
 * Prepends `FRONTEND-` to the log context and forwards payloads to `electron-log`.
 */
ipcMain.on("log-message", (event, level: 'info' | 'warn' | 'error', context: string, message: string, data?: unknown) => {
  const frontendContext = `FRONTEND-${context}`;

  if (level === 'info') logger.info(frontendContext, message, data);
  if (level === 'warn') logger.warn(frontendContext, message, data);
  if (level === 'error') logger.error(frontendContext, message, data);
});