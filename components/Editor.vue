<style>
  .layer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 1);
    z-index: 20;

    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .editor .footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .editor input[type=file] {
    display: none;
  }
  .editor textarea {
    width: 100%;
    padding: 12px;
    border-bottom: none;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  }
  .upload-box {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0;
  }
  .upload-box .button {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 80px;
    width: 80px;
    padding: 0;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
    line-height: inherit;
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
  <div class="layer">
    <div class="row editor">

      <div class="upload-box">
        <label class="button">
          INSERT IMAGE
          <input type="file" accept="image/*" multiple @change="fileChange($event)">
          <i id="progress"></i>
        </label>

        <label class="button" v-for="url in url">
          <img :src="url">
        </label>
      </div>

      <textarea rows="20" v-el:textarea v-model="item.text"></textarea>

      <div class="footer">
        <button type="button" @click="cancel">CANCEL</button>
        <button type="button" @click="save">SAVE</button>
      </div>

    </div>
  </div>
</template>

<script lang="babel">
  import { dns, upload } from '../tools'

  export default {
    props: ['item'],

    computed: {
      url() {
        return this.item.img.map(id => `${dns}/img/${id}@.webp`)
      }
    },

    methods: {
      cancel() {
        this.$dispatch('cancel')
      },
      save() {
        this.item.lastChange = Date.now()
        if (!this.item.id) {
          this.item.id = Date.now()
          this.$dispatch('save', this.item, true)
        } else {
          this.$dispatch('save', this.item, false)
        }
      },

      fileChange(event) {
        var files = event.target.files
        var progress = document.getElementById('progress')

        var readAndUpload = (file) => {
          var reader = new FileReader()
          reader.onload = () => {
            var id = `${Date.now()}${crypto.getRandomValues(new Uint16Array(1))[0]}`
            upload(`img/${id}`, reader.result, {progress}).then(() => {
              this.item.img.push(id)
            })
          }
          reader.readAsArrayBuffer(file)
        }

        if (files.length > 0) {
          [...files].forEach(readAndUpload)
        }
      },
    }

  }
</script>
