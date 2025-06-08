GhostFile - Secure File Encryption & Sharing

## Introduction

GhostFile is a **modern, browser-based encryption tool** designed for **secure file sharing**. It utilizes **AES-GCM encryption** to protect sensitive files and ensures safe transmission by splitting decryption keys into two separate parts.

### **Key Features**
- **Advanced AES-GCM Encryption**: Ensures strong, tamper-proof security.
- **File Expiry System**: Encrypted file download links automatically expire after **5 minutes or one use**, preventing unauthorized access.
- **Split Decryption Key for Added Security**: The encryption key is divided into **two halves**—one sent with the file, the other shared securely via **SMS or another channel**.
- **Fully Browser-Based**: No installations, account setups, or external dependencies—just select a file, encrypt, and share.

## **How It Works**
###  Encrypting a File**
1. Open GhostFile in your browser.
2. Select the file you want to encrypt.
3. Click the **"Encrypt"** button.
4. The file is encrypted and a **download link** is generated (valid for 5 minutes).
5. A **decryption key** (split into two halves) is provided.

###  Securely Sharing the Encrypted File**
- The **first half** of the decryption key should be sent along with the **download link**.
- The **second half** should be shared separately via **SMS, email, or another secure method**.

### Decrypting a File**
1. Open GhostFile and select the encrypted file (`filename.enc`).
2. Enter the **full decryption key** (both halves combined).
3. Click the **"Decrypt"** button.
4. The file is restored to its **original format** and can be downloaded.
