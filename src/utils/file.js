import { get, put, createId } from '@/utils'

export async function upload({ files, dirname, onprogress }) {
    const readAndUpload = async (file) => {
        const info = `${file.name.trim()},${file.type}`
        const id = await createId(info)
        const data = await readAsArrayBuffer(file)
        return await put({
            key: `${dirname}/${id}`,
            data,
            onprogress,
        })
    }
    const status = await Promise.all([...files].map(readAndUpload))
    // console.log(status)
    return status
}

function readAsArrayBuffer(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsArrayBuffer(file)
    })
}

export async function download({ key, name, type, onprogress }) {
    try {
        const anchor = document.createElement('a')
        anchor.download = name
        anchor.href = await readAsBlobURL({ key, type, onprogress })
        document.body.appendChild(anchor)

        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, true)
        anchor.dispatchEvent(evt)
        document.body.removeChild(anchor)
    } catch (e) {
        console.log(e)
    }
}

export async function readAsBlobURL({ key, type, onprogress }) {
    try {
        const data = await get({ key, responseType: 'arraybuffer', onprogress })
        const blob = new Blob([data], { type })
        return URL.createObjectURL(blob)
    } catch (e) {
        console.log(e)
        return ''
    }
}
