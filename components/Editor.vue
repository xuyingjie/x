<style>
  .editor > .row {
    padding: 1em;
  }
  .editor input[type=file] {
    display: none;
  }
  .editor textarea {
    width: 100%;
    height: 540px;
    padding: 12px;
    border-bottom: none;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  }
  .upload-box {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0;
  }
  .upload-box > * {
    height: 95px;
    width: 95px;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
    overflow: hidden;
  }
  .upload-box img {
    max-width: 140%;
    max-height: 140%;
  }
  .upload-box .button {
    display: flex;
    justify-content: center;
    align-items: center;
    will-change: box-shadow,transform;
    transition: box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);
  }
  .upload-box .button:hover {
    background-color: rgba(158,158,158,.2);
  }
  .upload-box .button:active {
    background-color: rgba(158,158,158,.4);
  }
  .upload-box #progress {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }
</style>

<template>
  <div class="editor layer">
    <div class="row card">

      <div class="upload-box">
        <label class="button">
          INSERT IMAGE
          <input type="file" accept="image/*" multiple @change="fileChange($event)">
          <i id="progress"></i>
        </label>

        <div class="thumbnail" v-for="id in item.img">
          <Picture :id="id"></Picture>
        </div>
      </div>

      <textarea v-el:textarea v-model="item.text"></textarea>
      <button type="button" @click="save">SAVE</button>
    </div>
  </div>
</template>

<script lang="babel">
  import Picture from './Picture.vue'
  import { upload } from '../tools'

  export default {
    props: ['item'],

    methods: {
      save() {
        if (this.item.img.length > 0 || this.item.text) {
          this.item.lastChange = Date.now()
          if (!this.item.id) {
            this.item.id = Date.now()
            this.$dispatch('save', this.item, true)
          } else {
            this.$dispatch('save', this.item, false)
          }
        }
      },

      fileChange(event) {
        var files = event.target.files
        var progress = document.getElementById('progress')

        var readAndUpload = (file) => {
          var reader = new FileReader()
          reader.onload = () => {
            var id = `${Date.now()}${crypto.getRandomValues(new Uint16Array(1))[0]}`
            upload(`img/${id}`, reader.result, {file:true,progress}).then(() => {
              this.item.img.push(id)
            })
          }
          reader.readAsArrayBuffer(file)
        }

        if (files.length > 0) {
          [...files].forEach(readAndUpload)
        }
      },
    },

    components: { Picture }
  }
</script>
