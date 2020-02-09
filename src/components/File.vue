<template>
    <div class="file layer">
        <div class="row card">
            <label class="button">
                SELECT FILE
                <input type="file" @change="fileChange($event)" />
                <i id="progress"></i>
            </label>
            <button type="button" v-for="item in list" :key="item.id" @click="download(item)">
                {{item.name}} - {{(item.size/1024).toFixed(2) + 'KB'}}
                <i :id="item.id"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { get, post, readAsArrayBuffer } from '@/utils/tools'

export default {
    data() {
        return {
            list: []
        }
    },

    methods: {
        async fileChange(event) {
            const file = event.target.files[0]
            if (file) {
                const progress = document.getElementById('progress')
                const id = Date.now()
                const item = {
                    id,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                }
                const list = [item, ...this.list]

                const result = await readAsArrayBuffer(file)
                await post(`file/${id}`, result, { file: true, progress })
                await post('filelist', { list })
                this.list = list
            }
        },

        async download({ id, name, type }) {
            const progress = document.getElementById(id)
            const data = await get(`file/${id}`, { file: true, progress })
            const blob = new Blob([data], { type })
            const objecturl = URL.createObjectURL(blob)

            // 生成下载
            const anchor = document.createElement('a')
            anchor.href = objecturl

            // 新标签页打开
            // anchor.target = '_blank'

            // 直接下载
            anchor.download = name

            document.body.appendChild(anchor)
            const evt = document.createEvent('MouseEvents')
            evt.initEvent('click', true, true)
            anchor.dispatchEvent(evt)
            document.body.removeChild(anchor)
        }
    },

    async created() {
        const data = await get('filelist')
        if (data) this.list = data.list
    }
}

</script>

<style scoped>
.file > .card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
}

@media screen and (max-width: 39.9375em) {
    .file > .card {
        padding: 0.5rem;
    }
}

.file button,
.file .button {
    padding: 0;
    text-transform: none;
    max-width: 100%;
    text-overflow: ellipsis;
}

.file label {
    margin-bottom: 1rem;
}

.file input[type="file"] {
    display: none;
}

.file #progress,
.file button > i {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
}
</style>