import {
  concat,
  stringToArrayBuffer,
  arrayBufferToString,
  encrypt,
  decrypt,
  arrayBufferToBase64,
  base64ToArrayBuffer,

  ajax,
  createOSSAuthHeaders,
} from 'pessoa'

const bucket = 'pessoa'
export const site = `https://${bucket}.oss-cn-beijing.aliyuncs.com`
// export const site = `${location.origin}/api`
const prefix = 'x'

async function request({ method = 'GET', key = '', query = '', body, responseType, onprogress }) {
  if (key) key = `${prefix}/${key}`

  const headers = (method === 'GET' && key) ? [] : await createOSSAuthHeaders({
    method,
    bucket,
    key,
    ...acl(),
  })
  if (method === 'PUT') {
    headers['Cache-Control'] = 'public,max-age=8640000'
  }

  const url = `${site}/${key}?${query}`
  const data = await ajax({ method, url, headers, body, responseType, onprogress })
  return data
}

export async function put({ key, data, passwd = false, onprogress }) {
  if (data.constructor !== ArrayBuffer) {
    data = stringToArrayBuffer(JSON.stringify(data))
  }
  const enc = await encrypt(passwd || acl().cryptoKey, data)

  const out = await request({
    method: 'PUT',
    key,
    body: concat(enc.iv, enc.data),
    responseType: 'text',
    onprogress,
  })
  return out || 200
}

export async function get({ key, passwd = false, responseType = 'json', onprogress }) {
  const out = await request({ key, onprogress })
  const data = await decrypt(passwd || acl().cryptoKey, out.slice(0, 12), out.slice(12))

  if (responseType === 'arraybuffer') {
    return data
  }
  if (responseType === 'json') {
    return JSON.parse(arrayBufferToString(data))
  }
}

export async function del(key) {
  const out = await request({
    method: 'DELETE',
    key,
  })
  return out || 200
}

export async function getList(dirname = '') {
  const xml = await request({
    query: `prefix=${prefix}/${dirname}${dirname && '/'}&delimiter=/`,
    responseType: 'document'
  })

  const contents = await parseDocument(xml, 'Contents')
  const list = []
  for (let i = 0; i < contents.length; i++) {
    const id = contents[i]['Key'].split('/').pop()
    const text = id ? await parseId(id) : ''
    list.push({
      id,
      text,
      last: contents[i]['LastModified'],
      size: contents[i]['Size'],
    })
  }
  list.sort((a, b) => new Date(b.last) - new Date(a.last))

  const prefixes = await parseDocument(xml, 'CommonPrefixes')
  const folders = prefixes.map(item => ({ dirname: item['Prefix'].replace(`${prefix}/`, '').slice(0, -1) }))

  return [...folders, ...list]
}

async function parseDocument(xml, nodeName) {
  return [...xml.documentElement.querySelectorAll(nodeName)].map(el => {
    return [...el.querySelectorAll('*')].reduce((total, sub) => {
      total[sub.nodeName] = sub.innerHTML
      return total
    }, {})
  })
}

export async function createId(text) {
  const buf = stringToArrayBuffer(text)
  const enc = await encrypt(acl().cryptoKey, buf)
  const base64 = arrayBufferToBase64(concat(enc.iv, enc.data))
  return base64.replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export async function parseId(id) {
  const base64 = id.replace(/-/g, '+').replace(/_/g, '/')
  const enc = base64ToArrayBuffer(base64)
  const buf = await decrypt(acl().cryptoKey, enc.slice(0, 12), enc.slice(12))
  return arrayBufferToString(buf)
}

function acl() {
  const { accessKeyId, accessKeySecret, cryptoKey } = JSON.parse(localStorage.x)
  return { accessKeyId, accessKeySecret, cryptoKey }
}
