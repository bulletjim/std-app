# 🏗️ Architecture Guide

This document outlines the high-level architecture, security model, and data flow of the application. It is intended for developers looking to understand the codebase or contribute to the project.

## 1. The Electron Model (IPC Flow)

The application follows Electron's strict security guidelines regarding process separation. The UI (Frontend) never has direct access to the Node.js environment or the filesystem.

Communication happens through a tightly controlled **Inter-Process Communication (IPC)** bridge:

1.  **Frontend (UI/React/Vanilla):** Handles the presentation layer and user interactions. When it needs to save or read data, it calls functions exposed on the `window.api` object.
2.  **Preload Script:** Acts as a security bridge. It selectively exposes specific, safe IPC channels (e.g., `saveTable`, `loadTable`) using `contextBridge`. It does not expose raw Node.js modules.
3.  **Main Process (Backend):** The Node.js environment. It listens to IPC requests, performs heavy lifting (cryptography, SQLite database operations), and returns the results to the Frontend.

## 2. Security & Cryptography Model

The core value of this application is its "Zero-Knowledge" encryption. We use the native Node.js `crypto` module to ensure data is useless to anyone without the exact password.

### Key Derivation
We never use the raw password directly as an encryption key.
*   **Algorithm:** `PBKDF2` (Password-Based Key Derivation Function 2).
*   **Process:** User Password + Randomly Generated Salt (unique per table) -> 100,000+ iterations -> 32-byte Encryption Key.

### Encryption/Decryption
Data is encrypted before it ever touches the SQLite database.
*   **Algorithm:** `AES-256-GCM` (Galois/Counter Mode). GCM provides both confidentiality and data authenticity (tamper-proofing).
*   **Process:** 
    1. A random 16-byte Initialization Vector (IV) is generated.
    2. The JSON-stringified table data is encrypted using the 32-byte Key and the IV.
    3. An Authentication Tag (Auth Tag) is generated to ensure the data is not altered.

### What is Stored on Disk?
The local database stores **ONLY** the following for each table:
*   Table ID and Name (Plaintext)
*   The Salt (Plaintext)
*   The IV (Plaintext)
*   The Auth Tag (Plaintext)
*   The Encrypted Data Blob (Ciphertext)

**Crucially, the Password and the derived Encryption Key are NEVER stored on disk, logged, or sent over the network.**

## 3. Database Storage

We use **SQLite** (via `better-sqlite3`) for reliable, local, file-based storage. 
The database file is typically named `std.db` and resides in the user's OS-specific application data folder.

By storing the encrypted JSON blobs in a SQLite database, we gain:
*   Atomic writes (preventing data corruption during crashes).
*   Easy indexing of metadata (like table names and creation dates).
*   A single, portable `.db` file that the user can easily back up.

## 4. Directory Structure

A brief overview of the `src/` directory:

```text
src/
├── backend/          # Main process logic (Node.js)
│   ├── main.ts       # Electron app entry point
│   └── services/     # Crypto, DB, and IPC handlers
├── frontend/         # UI logic (Vite + TS)
│   ├── index.html
│   └── main.ts       # Frontend entry point
├── preload.ts        # contextBridge definitions
├── shared/           # Types and interfaces shared across processes
└── tests/            # Unit and integration tests
```

## 5. API Reference

For detailed, function-level documentation, please refer to the TypeDoc output. You can generate it by running:

```bash
npm run docs
```
Then, open `docs/api/index.html` in your browser.

## 6. Logging Strategy

We use `electron-log` to capture runtime information, errors, and IPC events. 

### Developer Guidelines for Logging
Because this is a Zero-Knowledge security application, strict rules apply to logging:
1. **Never log user inputs:** Do not log passwords, table names, column names, or cell values.
2. **Log system events:** Log successful DB connections, IPC channel invocations, and cryptographic initialization.
3. **Sanitize Error Objects:** When catching exceptions in the backend (especially from the `crypto` or `better-sqlite3` modules), ensure the error stack trace does not inadvertently leak sensitive variables before passing it to the logger.

### Log File Location
`electron-log` automatically routes `console.log` and `console.error` to a local file. During development or debugging, you can check the logs at the OS-specific paths (e.g., `~/Library/Logs/std-app/main.log` on macOS or `%APPDATA%\Roaming\std-app\logs\main.log` on Windows).