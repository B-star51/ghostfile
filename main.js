// Select the necessary HTML elements
const fileInput = document.getElementById('fileInput');
const encryptBtn = document.getElementById('encryptBtn');
const output = document.getElementById('output');

const encryptedFileInput = document.getElementById('encryptedFileInput');
const decryptionKeyInput = document.getElementById('decryptionKey');
const decryptBtn = document.getElementById('decryptBtn');
const decryptOutput = document.getElementById('decryptOutput');

// Display selected file name (encryption)
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    output.textContent = file ? `Selected File: ${file.name}` : "No file selected.";
});

// Display selected file name (decryption)
encryptedFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    decryptOutput.textContent = file ? `Selected Encrypted File: ${file.name}` : "No file selected.";
});

// Encrypt button logic
encryptBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
        output.textContent = 'Please select a file first.';
        return;
    }

    try {
        const arrayBuffer = await file.arrayBuffer();

        const key = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            arrayBuffer
        );

        const rawKeyBuffer = await crypto.subtle.exportKey('raw', key);
        const rawKeyBytes = new Uint8Array(rawKeyBuffer);
        const keyHex = Array.from(rawKeyBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        const halfLength = Math.floor(keyHex.length / 2);
        const decryptionKeyPart1 = keyHex.slice(0, halfLength);
        const decryptionKeyPart2 = keyHex.slice(halfLength);

        const combinedBuffer = new Uint8Array(iv.length + encryptedBuffer.byteLength);
        combinedBuffer.set(iv, 0);
        combinedBuffer.set(new Uint8Array(encryptedBuffer), iv.length);

        const encryptedBlob = new Blob([combinedBuffer], { type: 'application/octet-stream' });
        const downloadURL = URL.createObjectURL(encryptedBlob);

        const downloadLink = document.createElement('a');
        downloadLink.href = downloadURL;
        downloadLink.download = file.name + '.enc';
        downloadLink.textContent = 'Download Encrypted File';
        downloadLink.style.display = 'block';
        downloadLink.style.marginTop = '15px';

        output.innerHTML = `
            <b>File encrypted successfully!</b><br><br>
            <b>Download Link (valid for 5 minutes or one use):</b><br>
        `;
        output.appendChild(downloadLink);

        const decryptionInfo = document.createElement('div');
        decryptionInfo.innerHTML = `
            <br><br>
            <b>Decryption Key:</b><br>
            First Half (include in link): <code>${decryptionKeyPart1}</code><br>
            Second Half (send separately via secure channel): <code>${decryptionKeyPart2}</code><br><br>
            To decrypt, combine both key halves into one hexadecimal string.
        `;
        output.appendChild(decryptionInfo);

        let downloaded = false;
        downloadLink.addEventListener('click', () => {
            if (!downloaded) {
                downloaded = true;
                setTimeout(() => {
                    URL.revokeObjectURL(downloadURL);
                    downloadLink.remove();
                    output.innerHTML += '<br><br>This download link has now expired after use.';
                }, 1000);
            }
        });

        setTimeout(() => {
            if (!downloaded) {
                URL.revokeObjectURL(downloadURL);
                downloadLink.remove();
                const expiredMsg = document.createElement('div');
                expiredMsg.innerHTML = `<br><br>This download link has expired after 5 minutes.`;
                output.appendChild(expiredMsg);
            }
        }, 5 * 60 * 1000);

    } catch (error) {
        output.textContent = `Error during encryption: ${error.message}`;
    }
});

// Decrypt button logic
decryptBtn.addEventListener('click', async () => {
    const file = encryptedFileInput.files[0];
    const keyHex = decryptionKeyInput.value.trim();

    if (!file || !keyHex || keyHex.length !== 64) {
        decryptOutput.textContent = 'Please select a file and enter the correct decryption key.';
        return;
    }

    decryptBtn.disabled = true;
    decryptOutput.textContent = 'Decrypting file... Please wait.';

    try {
        const fileBuffer = await file.arrayBuffer();
        const fullData = new Uint8Array(fileBuffer);

        if (fullData.length < 12) {
            throw new Error("Invalid file: Missing IV.");
        }

        const iv = fullData.slice(0, 12);
        const encryptedContent = fullData.slice(12);
        const keyBytes = new Uint8Array(keyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        const key = await crypto.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        );

        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encryptedContent
        );

        const decryptedBlob = new Blob([decryptedBuffer]);
        const decryptedURL = URL.createObjectURL(decryptedBlob);

        const decryptedLink = document.createElement('a');
        decryptedLink.href = decryptedURL;
        decryptedLink.download = file.name.endsWith('.enc') 
    ? file.name.slice(0, -4) // Removes `.enc` correctly 
    : file.name; // Keeps original filename if `.enc` isn't present
        decryptedLink.textContent = 'Download Decrypted File';
        decryptedLink.style.display = 'block';
        decryptedLink.style.marginTop = '15px';

        decryptOutput.innerHTML = '<b>File decrypted successfully!</b><br><br>';
        decryptOutput.appendChild(decryptedLink);
    } catch (error) {
        decryptOutput.textContent = `Decryption failed: ${error.message}`;
    } finally {
        decryptBtn.disabled = false;
    }
});



