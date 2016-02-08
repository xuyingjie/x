const bucket = 'whitehairpin'
const url = `https://${bucket}.oss-cn-beijing.aliyuncs.com`
export const dns = `http://${bucket}.img-cn-beijing.aliyuncs.com`

export function get(key, { responseType, progress } = {}) {
  return new Promise(resolve => {

    let xhr = new XMLHttpRequest()
    xhr.open('GET', `${url}/${key}`)
    xhr.responseType = responseType ? responseType : 'arraybuffer'

    if (progress) xhr.onprogress = (e) => {
      if (e.lengthComputable) progress.style.width = e.loaded / e.total * 100 + '%'
    }

    xhr.onload = () => {
      resolve(xhr.response)
    }

    xhr.send(null)
  })
}

export function upload(key, data, { progress } = {}) {
  return new Promise(resolve => {

    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    if (progress) xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) progress.style.width = e.loaded / e.total * 100 + '%'
    }

    xhr.onload = () => {
      resolve(xhr.response)
    }

    xhr.send(form(key, data))
  })
}

// type: file.type?
export function form(key, data) {
  const user = JSON.parse(localStorage.user)
  const AK = user.AK
  const SK = user.SK

  let cache
  if (key.match('img/') !== null) {
    cache = 'public,max-age=8640000'
  } else {
    cache = 'no-cache'
  }

  const policyJson = {
    'expiration': (new Date(Date.now() + 3600000)).toJSON(),
    'conditions': [
      { bucket },
      // { 'acl': 'public-read' },
      { 'Content-Type': 'application/octet-stream' },
      { 'Cache-Control': cache },
      ['eq', '$key', key],
    ],
  }
  const policy = btoa(JSON.stringify(policyJson))
  const signature = b64_hmac_sha1(SK, policy)

  const formData = new FormData()
  formData.append('key', key)
  formData.append('x-oss-object-acl', 'public-read')
  formData.append('Content-Type', 'application/octet-stream')
  formData.append('Cache-Control', cache)
  formData.append('OSSAccessKeyId', AK)
  formData.append('policy', policy)
  formData.append('signature', signature)

  // 文件或文本内容，必须是表单中的最后一个域。
  formData.append('file', new Blob([data]))
  return formData
}


export function arrayBufferToStr(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf))
}
export function strToArrayBuffer(str) {
  return new Uint16Array([...str].map(s => s.charCodeAt(0))).buffer
}

//
// WebCryptoAPI
//
export function encStr(item) {
  return new Promise(resolve => {
    let user = JSON.parse(localStorage.user)
    let buf = strToArrayBuffer(item.text)
    encrypt(user.passwd, buf).then(data => {
      let x = {
        id: item.id,
        img: item.img,
        lastChange: item.lastChange
      }
      let b = strToArrayBuffer(JSON.stringify(x))
      let c = set(new Uint16Array([b.byteLength/2]).buffer, b)
      let out = set(c, data)
      resolve(out)
    })
  })
}

export function decStr(data) {
  return new Promise(resolve => {
    let x = new Uint16Array(data)
    let len = x.subarray(0, 1)[0]
    let str = String.fromCharCode.apply(null, x.subarray(1, len + 1))
    let item = JSON.parse(str)
    if (localStorage.user) {
      let user = JSON.parse(localStorage.user)
      let enc = x.slice(len + 1)
      decrypt(user.passwd, enc.buffer).then(out => {
        item.text = arrayBufferToStr(out)
        resolve(item)
      })
    } else {
      item.text = ''
      resolve(item)
    }
  })
}

// concat arrayBuffer
function set(a, b) {
  let out = new Uint8Array(a.byteLength + b.byteLength)
  out.set(new Uint8Array(a))
  out.set(new Uint8Array(b), a.byteLength)
  return out.buffer
}

function importKey(passwd) {
  return new Promise((resolve, reject) => {
    window.crypto.subtle.importKey(
      'raw', // can be 'jwk' or 'raw'
      strToArrayBuffer(passwd),
      { // this is the algorithm options
        name: 'AES-GCM',
      },
      false, // whether the key is extractable (i.e. can be used in exportKey)
      ['encrypt', 'decrypt'] // can 'encrypt', 'decrypt', 'wrapKey', or 'unwrapKey'
    )
      .then(key => {
        // returns the symmetric key
        resolve(key)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function encrypt(passwd, data) {
  return new Promise((resolve, reject) => {
    importKey(passwd)
      .then(key => {

        let iv = window.crypto.getRandomValues(new Uint8Array(12))
        window.crypto.subtle.encrypt({
          name: 'AES-GCM',

          // Don't re-use initialization vectors!
          // Always generate a new iv every time your encrypt!
          // Recommended to use 12 bytes length
          iv,

          // Additional authentication data (optional)
          // additionalData: ArrayBuffer,

          // Tag length (optional)
          tagLength: 128, // can be 32, 64, 96, 104, 112, 120 or 128 (default)
        },
          key, // from generateKey or importKey above
          data // ArrayBuffer of data you want to encrypt
        )
          .then(encrypted => {
            // returns an ArrayBuffer containing the encrypted data
            resolve(set(iv.buffer, encrypted))
          })
          .catch(err => {
            reject(err)
          })
      })
  })
}

export function decrypt(passwd, data) {
  let c = new Uint8Array(data)
  let iv = c.subarray(0, 12)
  let enc = c.slice(12)
  return new Promise((resolve, reject) => {
    importKey(passwd)
      .then(key => {
        window.crypto.subtle.decrypt({
          name: 'AES-GCM',
          iv, // The initialization vector you used to encrypt
          // additionalData: ArrayBuffer, //The addtionalData you used to encrypt (if any)
          tagLength: 128, // The tagLength you used to encrypt (if any)
        },
          key, // from generateKey or importKey above
          enc.buffer // ArrayBuffer of the data
        )
          .then(decrypted => {
            // returns an ArrayBuffer containing the decrypted data
            resolve(decrypted)
          })
          .catch(err => {
            reject(err)
          })
      })
  })
}

export function b64_hmac_sha1(k, d, _p, _z) {

  // heavily optimized and compressed version of http://pajhome.org.uk/crypt/md5/sha1.js
  // _p = b64pad, _z = character size; not used here but I left them available just in case
  if (!_p) {
    _p = '='
  }
  if (!_z) {
    _z = 8
  }
  function _f(t, b, c, d) {
    if (t < 20) {
      return (b & c) | ((~b) & d)
    }
    if (t < 40) {
      return b ^ c ^ d
    }
    if (t < 60) {
      return (b & c) | (b & d) | (c & d)
    }
    return b ^ c ^ d
  }
  function _k(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514
  }
  function _s(x, y) {
    var l = (x & 0xFFFF) + (y & 0xFFFF),
      m = (x >> 16) + (y >> 16) + (l >> 16)
    return (m << 16) | (l & 0xFFFF)
  }
  function _r(n, c) {
    return (n << c) | (n >>> (32 - c))
  }
  function _c(x, l) {
    x[l >> 5] |= 0x80 << (24 - l % 32)
    x[((l + 64 >> 9) << 4) + 15] = l;var w = [80],
      a = 1732584193,
      b = -271733879,
      c = -1732584194,
      d = 271733878,
      e = -1009589776
    for (var i = 0; i < x.length; i += 16) {
      var o = a,
        p = b,
        q = c,
        r = d,
        s = e
      for (var j = 0; j < 80; j++) {
        if (j < 16) {
          w[j] = x[i + j]
        } else {
          w[j] = _r(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
        }
        var t = _s(_s(_r(a, 5), _f(j, b, c, d)), _s(_s(e, w[j]), _k(j)))
        e = d
        d = c
        c = _r(b, 30)
        b = a
        a = t
      }
      a = _s(a, o)
      b = _s(b, p)
      c = _s(c, q)
      d = _s(d, r)
      e = _s(e, s)
    }
    return [a, b, c, d, e]
  }
  function _b(s) {
    var b = [],
      m = (1 << _z) - 1
    for (var i = 0; i < s.length * _z; i += _z) {
      b[i >> 5] |= (s.charCodeAt(i / 8) & m) << (32 - _z - i % 32)
    }
    return b
  }
  function _h(k, d) {
    var b = _b(k)
    if (b.length > 16) {
      b = _c(b, k.length * _z)
    }
    var p = [16],
      o = [16]
    for (var i = 0; i < 16; i++) {
      p[i] = b[i] ^ 0x36363636
      o[i] = b[i] ^ 0x5C5C5C5C
    }
    var h = _c(p.concat(_b(d)), 512 + d.length * _z)
    return _c(o.concat(h), 512 + 160)
  }
  function _n(b) {
    var t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      s = ''
    for (var i = 0; i < b.length * 4; i += 3) {
      var r = (((b[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((b[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((b[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF)
      for (var j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > b.length * 32) {
          s += _p
        } else {
          s += t.charAt((r >> 6 * (3 - j)) & 0x3F)
        }
      }
    }
    return s
  }
  function _x(k, d) {
    return _n(_h(k, d))
  }
  return _x(k, d)
}
