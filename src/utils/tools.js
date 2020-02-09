import crypto from './webcrypto'
import { request } from './request'
import { OSS_DOMAIN, CDN_DOMAIN, createForm } from './oss'

export async function getSrc(id) {
    const data = await get(`img/${id}`, { file: true })
    const params = {}
    if (String(id).match(/svg/i) !== null) params.type = 'image/svg+xml'
    const blob = new Blob([data], params)
    return URL.createObjectURL(blob)
}

export async function get(key, { file, progress, passwd } = {}) {
    try {
        const data = await request({ url: `${CDN_DOMAIN}/x/${key}`, progressNode: progress })

        if (!passwd) passwd = JSON.parse(localStorage.user).key
        let out = await crypto.decrypt(passwd, data)

        if (!file) out = JSON.parse(crypto.arrayBufferToStr(out))
        return out
    } catch (err) {
        return
    }
}

export async function post(key, data, { file, progress, passwd } = {}) {
    if (!passwd) passwd = JSON.parse(localStorage.user).key
    if (!file) {
        data = crypto.strToArrayBuffer(JSON.stringify(data))
    }
    data = await crypto.encrypt(passwd, data)

    const form = await createForm({ key: `x/${key}`, data })

    const params = {
        url: OSS_DOMAIN,
        method: 'POST',
        body: form,
        progressNode: progress,
    }
    return await request(params)
}

export function readAsArrayBuffer(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsArrayBuffer(file)
    })
}
