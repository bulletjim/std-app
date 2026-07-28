# 📘 User Guide

Welcome to the **STD** user guide. This application is designed to give you complete, offline control over your tabular data with military-grade encryption. 

Because the app is built with a "Zero-Knowledge" architecture, you have total privacy—but this also means you hold total responsibility for your passwords.

---

## 🛑 SECURITY FIRST: Read Before Using

Before you create your first table, you must understand how data is secured:

1. **No Cloud:** Your data is never uploaded to the internet. It lives exclusively on your hard drive.
2. **No Backdoors:** The developer cannot access your data.
3. **NO PASSWORD RECOVERY:** We do not store your passwords, password hints, or recovery keys anywhere. The encryption key is generated directly from the password you type. 

> **CRITICAL WARNING:** If you forget the password for a table, the data inside it becomes mathematically impossible to recover. **Always use a trusted Password Manager** (like Bitwarden, 1Password, or KeePass) to store your table passwords safely.

---

## 🛠️ Basic Operations

### 1. Creating a Table
When you start the application, you will be prompted to create a new table.
* Click on **Create New Table** (or similar).
* Enter a **Table Name**.
* Choose a **Strong Password**.
* Confirm and save. Make sure you store this password in a safe place immediately!

### 2. Accessing a Table
Every time you want to view or edit a table, you must unlock it:
* Select the table from your dashboard.
* Enter the exact password you used during creation.
* If the password is correct, the table will decrypt and open.

### 3. Managing Data
Once inside a table, you can manage your data dynamically:
* **Add Columns:** Define the structure of your data (e.g., "Name", "Email", "Amount").
* **Add Rows:** Insert your actual data records.
* **Save Changes:** *Don't forget to save!* When you save, the application re-encrypts your updated data and writes it securely to your local disk.

### 4. Changing a Table's Password
If you feel your password has been compromised or you just want to update it:
* Open the table using your **Current Password**.
* Navigate to the **Settings / Change Password** section.
* Enter your **Old Password** to verify authorization.
* Enter and confirm your **New Password**.
* The application will decrypt the table and immediately re-encrypt it using the new key.

### 5. Exporting Data
You can export your decrypted data for use in other applications (like Excel or web apps).
* Click the **Export** button inside your unlocked table.
* Choose a save location on your computer.
* The application will generate a clean `CSV` and `JSON` file of your current data.
* *Note: Exported files are NOT encrypted. Store them safely or delete them after use.*

---

## 📂 Where is my data stored?

Your encrypted data is stored in a local SQLite database (`std.db`). Depending on your operating system, you can find this file in the standard application data folder:

* **Windows:** `%APPDATA%\Roaming\std-app\std.db`
* **macOS:** `~/Library/Application Support/std-app/std.db`
* **Linux:** `~/.config/std-app/std.db`

> **Backup Tip:** To back up your data, simply copy the `std.db` file to a USB drive or cloud storage. As long as you remember your passwords, you can open this database file on any computer running the application.

---

## 🐛 Troubleshooting & Logs

If the application crashes or you experience unexpected behavior, the app generates a log file that can help identify the issue. 

**Privacy Guarantee:** The log file only contains system events and error codes. It **never** contains your passwords, encryption keys, or the actual data inside your tables.

You can find the log file here:
* **Windows:** `%APPDATA%\Roaming\std-app\logs\main.log`
* **macOS:** `~/Library/Logs/std-app/main.log`
* **Linux:** `~/.config/std-app/logs/main.log`

If you are reporting a bug to the developer, you can safely attach this `main.log` file.