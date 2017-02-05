/**
 * Web Cryptography API wrapper
 */

function arrayBufferToStr(buf) {
    let uint16 = new Uint16Array(buf)
    return [...uint16].map(x => String.fromCharCode(x)).join('')
}
function strToArrayBuffer(str) {
    return new Uint16Array([...str].map(s => s.charCodeAt(0))).buffer
}

//
// WebCryptoAPI
//
// concat arrayBuffer
function set(a, b) {
    let out = new Uint8Array(a.byteLength + b.byteLength)
    out.set(new Uint8Array(a))
    out.set(new Uint8Array(b), a.byteLength)
    return out.buffer
}

async function importKey(passwd) {
    return await window.crypto.subtle.importKey('raw', strToArrayBuffer(passwd), { name: 'AES-GCM', }, false, ['encrypt', 'decrypt'])
}

async function encrypt(passwd, data) {
    try {
        let key = await importKey(passwd)

        // Don't re-use initialization vectors! Always generate a new iv every time your encrypt!
        // Recommended to use 12 bytes length
        // where iv is an ArrayBuffer or an ArrayBufferView with 12 random bytes (these should be generated by RandomSource.getRandomValues()).
        let iv = window.crypto.getRandomValues(new Uint8Array(12))

        // key: from generateKey or importKey above
        // data: ArrayBuffer of data you want to encrypt
        // returns an ArrayBuffer containing the encrypted data
        let encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)
        let out = set(iv.buffer, encrypted)
        return out
    } catch (err) {
        return err
    }
}

async function decrypt(passwd, data) {
    try {
        let key = await importKey(passwd)
        let iv = data.slice(0, 12)
        let decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data.slice(12))
        return decrypted
    } catch (err) {
        return err
    }
}

async function b64HmacSHA1(key, str) {
    let keyBuf = new TextEncoder().encode(key)
    let buf = new TextEncoder().encode(str)
    let hmacSha1 = { name: 'hmac', hash: { name: 'sha-1' } }

    try {
        let key = await crypto.subtle.importKey('raw', keyBuf, hmacSha1, true, ['sign', 'verify'])
        let out = await crypto.subtle.sign(hmacSha1, key, buf)
        return btoa(String.fromCharCode.apply(null, new Uint8Array(out)))
    } catch (err) {
        return err
    }
}

export default {
    arrayBufferToStr,
    strToArrayBuffer,
    encrypt,
    decrypt,
    b64HmacSHA1
}