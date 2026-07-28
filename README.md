# 🔒 Secure Table Database 

> A secure, offline-first desktop application for managing encrypted data tables.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?logo=electron)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)

STD is a desktop application built with Electron that allows users to create, manage, and store tabular data locally. All table contents are strongly encrypted on the user's device, ensuring maximum privacy and security.

## ✨ Key Features

*   **Zero-Knowledge Encryption**: Data is encrypted using AES-256-GCM. The decryption keys are derived from your password via PBKDF2 and are *never* stored on the disk.
*   **Offline First**: No cloud, no telemetry, no remote servers. Your data stays physically on your machine.
*   **Dynamic Tables**: Create custom columns and rows tailored to your data needs.
*   **Import/Export**: Export your decrypted tables locally to CSV or JSON formats.
*   **Password Management**: Re-key and change the password of any existing table.

## ⚠️ Important Security Notice

**THERE IS NO PASSWORD RECOVERY.** 
Because this application does not store your passwords or keys anywhere, if you lose the password for a table, **the data is permanently unrecoverable**. There is no backdoor and no "forgot password" feature. Please use a password manager to store your table passwords.

## 🛠️ Tech Stack

*   **Framework**: [Electron](https://www.electronjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Bundler**: [Vite](https://vitejs.dev/)
*   **Database**: [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) for fast, synchronous local storage
*   **Cryptography**: Native Node.js `crypto` module
*   **Logging**: `electron-log`

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   `npm` (comes with Node.js)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/bulletjim/std-app.git
    cd std-app
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the application in development mode:

    ```bash
    npm run dev
    ```

## 📝 Logging

The application uses `electron-log` to record system events and errors for troubleshooting. **No sensitive data, passwords, or decrypted table contents are ever logged.** 

Logs are stored locally on your machine at the following default paths:
- **Windows:** `%APPDATA%\Roaming\std-app\logs\main.log`
- **macOS:** `~/Library/Logs/std-app/main.log`
- **Linux:** `~/.config/std-app/logs/main.log`

## 📖 Documentation

This project uses **TypeDoc** for automatic code documentation and Markdown for architectural guides.

### Generate Code Documentation

To generate the technical API documentation from the source code, run:

```bash
npm run docs
```

This will create a `docs/` folder (excluding tests). Open `docs/index.html` in your browser to navigate the API reference.

### Project Guides

*   [User Guide](docs/USER_GUIDE.md) - Instructions and best practices for end-users.
*   [Architecture](docs/ARCHITECTURE.md) - Deep dive into the IPC flow, security model, and codebase structure.

## 📜 Available Scripts

*   `npm run dev`: Starts the app in development mode with hot-reloading.
*   `npm run build`: Compiles TypeScript and builds the production-ready assets.
*   `npm run package`: Packages the Electron app into a runnable executable for your OS.
*   `npm run docs`: Generates the TypeDoc HTML documentation.

## 📄 License

This project is licensed under the [MIT License](LICENSE).