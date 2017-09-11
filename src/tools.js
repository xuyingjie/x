import crypto from './webcrypto'

const bucket = 'xu-test'
const url = 'http://ow3fv7mzv.bkt.clouddn.com'
const postUrl = 'http://up-z1.qiniu.com'

export async function getSrc(id) {
    let data = await get(`img/${id}`, { file: true })
    let type = ''
    if (String(id).match(/svg/i) !== null) type = 'image/svg+xml'
    let blob = new Blob([data], { type })
    return URL.createObjectURL(blob)
}

export async function get(key, { file, progress, passwd } = {}) {
    if (key.match(/(img|file)\//) === null) key = `${key}?v=${Date.now()}`
    try {
        let data = await _get(key, { progress })

        if (!passwd) passwd = JSON.parse(localStorage.user).key
        let out = await crypto.decrypt(passwd, data)

        if (!file) out = JSON.parse(crypto.arrayBufferToStr(out))
        return out
    } catch (err) {
        return
    }
}

export async function post(key, data, { file, progress, passwd } = {}) {
    if (!file) data = JSON.stringify(data)
    if (!passwd) passwd = JSON.parse(localStorage.user).key
    if (!file) data = crypto.strToArrayBuffer(data)

    let out = await crypto.encrypt(passwd, data)
    await _post(key, out, { progress })
}

function _get(key, { responseType, progress } = {}) {
    return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest()
        xhr.open('GET', `${url}/${key}`)
        xhr.responseType = responseType ? responseType : 'arraybuffer'

        if (progress) xhr.onprogress = (e) => {
            if (e.lengthComputable) progress.style.width = (e.loaded === e.total) ? 0 : e.loaded / e.total * 100 + '%'
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                resolve(xhr.response)
            } else {
                reject(xhr.status)
            }
        }

        xhr.send(null)
    })
}

function _post(key, data, { progress } = {}) {
    return new Promise(async resolve => {
        let form = await createForm(key, data)

        let xhr = new XMLHttpRequest()
        xhr.open('POST', postUrl)

        if (progress) xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) progress.style.width = (e.loaded === e.total) ? 0 : e.loaded / e.total * 100 + '%'
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                resolve(xhr.response)
            }
        }

        xhr.send(form)
    })
}

async function createForm(key, data) {
    const formData = new FormData()
    formData.append('key', key)

    const token = await createToken(key)
    formData.append('token', token)

    // 文件或文本内容，必须是表单中的最后一个域。
    formData.append('file', new Blob([data]))

    return formData
}

async function createToken(key) {
    const user = JSON.parse(localStorage.user)
    const AK = user.AK
    const SK = user.SK

    const policyJson = {
        'scope': bucket + ':' + key,
        'deadline': 3600 + Math.floor(Date.now() / 1000)
    }

    const policy = btoa(JSON.stringify(policyJson))

    const signature = await crypto.b64HmacSHA1(SK, policy)
    return `${AK}:${signature.replace(/\+/g, '-').replace(/\//g, '_')}:${policy}`
}

export function readFile(file) {
    return new Promise(resolve => {
        let reader = new FileReader()
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsArrayBuffer(file)
    })
}