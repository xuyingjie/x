<style>
.file > .card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1em;
}
.file button, .file .button {
  padding: 0;
  text-transform: none;
}
.file label {
  margin-bottom: 20px;
}
.file input[type=file] {
  display: none;
}
.file #progress, .file button > i {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}
</style>

<template>
  <div class="file layer">
    <div class="row card">
      <label class="button">
        SELECT FILE
        <input type="file" @change="fileChange($event)">
        <i id="progress"></i>
      </label>
      <button type="button" v-for="item in list" @click="download(item)">
        {{item.name}} - {{(item.size/1024).toFixed(2) + 'KB'}}
        <i id="{{item.id}}"></i>
      </button>
    </div>
  </div>
</template>

<script lang="babel">
import { get, upload } from '../tools'

export default {
  data() {
    return {
      list: []
    }
  },
  compiled() {
    get('filelist').then(data => {
      this.list = data.list
    })
  },

  methods: {
    fileChange(event) {
      var file = event.target.files[0]
      if (file) {
        var progress = document.getElementById('progress')
        var id = `${Date.now()}${crypto.getRandomValues(new Uint16Array(1))[0]}`
        var item = {
          id,
          name: file.name,
          size: file.size,
          type: file.type,
        }
        var l = [item, ...this.list]

        var reader = new FileReader()
        reader.onload = () => {
          upload(`file/${id}`, reader.result, {file:true,progress}).then(() => {
            upload(`filelist`, { list: l }).then(() => {
              this.list = l
            })
          })
        }
        reader.readAsArrayBuffer(file)
      }
    },
    download(file) {
      var progress = document.getElementById(file.id)
      get(`file/${file.id}`, {file:true,progress}).then(data => {
        var blob = new Blob([data], {
          'type': file.type,
        })
        var objecturl = URL.createObjectURL(blob)

        // 生成下载
        var anchor = document.createElement('a')
        anchor.href = objecturl

        // 新标签页打开
        // anchor.target = '_blank'

        // 直接下载
        anchor.download = file.name

        document.body.appendChild(anchor)
        var evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, true)
        anchor.dispatchEvent(evt)
        document.body.removeChild(anchor)
      })
    }
  }
}
</script>
