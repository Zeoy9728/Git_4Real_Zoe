const publicKeyPEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuljPKpObkDKWd4Os1Jz2
1IuFFek0bOygYd3/jTHDvvD5OQw7ees+ie6xfu1E3LDsjoaZPYALrDNNI2PMwsfM
QVCch1Uw3cZSK0QzRHsVi44M7BHECWh1H4ZURmzx+3Y67hT9xiHKeLHzBpQ9025/
6S+Rs/B1sYxUx203KtNLPGW9ICvE37WoatTt5PcW7l0KAwhMcmyMg/TiMMMttQtM
MIWChqPgH3j+wUdr0XKNqFzS3a8ixyiadiHx9/DVT0bhF3zk+WRuIuhRjzjwxZZc
xG9frOxebcDJmuC5cQweklMp/rmmu3W9/KoL7yCsyMVyO9sDcdoB+YpuslTlDnOA
QQIDAQAB
-----END PUBLIC KEY-----`;

async function importRSAPublicKey(pem: string) {
  const base64Url = pem
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\s+/g, "");
  const binaryDerString = atob(base64Url);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  return await window.crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

async function generateKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

function bufferToBase64(buf: ArrayBuffer) {
  const byteArr = new Uint8Array(buf);
  const str = String.fromCharCode.apply(null, Array.from(byteArr));
  return btoa(str);
}

function base64ToBuffer(base64: string) {
  var binaryString = window.atob(base64);
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function encryptText(
  aesKey: CryptoKey,
  iv: ArrayBufferLike,
  plaintext: string
) {
  const alg = {
    name: "AES-CBC",
    iv: iv,
  };

  const enc = new TextEncoder();
  const encodedPlaintext = enc.encode(plaintext);

  const encryptedData = await crypto.subtle.encrypt(
    alg,
    aesKey,
    encodedPlaintext
  );
  const encryptedArray = new Uint8Array(encryptedData);

  return bufferToBase64(encryptedArray);
}

export async function decryptText(
  aesBase64: string,
  iv: string,
  ciphertext: string
) {
  const aesKeyBuffer = base64ToBuffer(aesBase64);
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    aesKeyBuffer,
    {
      name: "AES-CBC",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  const alg = {
    name: "AES-CBC",
    iv: base64ToBuffer(iv),
  };

  const enc = new TextDecoder();
  const encryptedData = base64ToBuffer(ciphertext);

  const decryptedData = await crypto.subtle.decrypt(alg, aesKey, encryptedData);
  const decryptedText = enc.decode(decryptedData);

  return decryptedText;
}

export async function encrypt(plaintext: string) {
  const aesKey = await generateKey();
  const exportedAesKeyBuffer = await window.crypto.subtle.exportKey(
    "raw",
    aesKey
  );
  const rsaPublicKey = await importRSAPublicKey(publicKeyPEM);
  const encryptedAesKeyBuffer = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    rsaPublicKey,
    exportedAesKeyBuffer
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const encryptedText = await encryptText(aesKey, iv, plaintext);
  const encryptedAesKeyBase64 = bufferToBase64(encryptedAesKeyBuffer);
  return {
    iv: bufferToBase64(iv),
    protected_media: encryptedText,
    secret: encryptedAesKeyBase64,
  };
}
