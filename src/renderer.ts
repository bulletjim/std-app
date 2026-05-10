/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

const createTableDialog = document.getElementById("create-table-dialog") as HTMLDialogElement;
const createTblButton = document.getElementById("create-table-button") as HTMLButtonElement;
createTblButton.addEventListener("click", () =>{
  createTableDialog.showModal()
})

const closeTableButton = document.getElementById("close-create-table-dialog-button") as HTMLButtonElement;
closeTableButton.addEventListener("click", () =>{
  createTableDialog.returnValue = "";
  createTableDialog.close()
})

const createTableForm = document.getElementById("create-table-form") as HTMLFormElement;
const inputName = document.getElementById("input-table-name") as HTMLInputElement;
const inputPassword = document.getElementById("input-table-password") as HTMLInputElement;
createTableForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const name = inputName.value;
  const pwd = inputPassword.value;
  console.log(name, pwd)
  createTableForm.reset()
  createTableDialog.close()
})

