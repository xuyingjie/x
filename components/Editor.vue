<style>
  .layer {
    position: fixed;
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
  .upload-box .button, .upload-box .thumbnail {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    height: 90px;
    width: 90px;
    padding: 0;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  }
  .upload-box .button {
    position: relative;
    will-change: box-shadow,transform;
    transition: box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);
  }
  .button:hover {
    background-color: rgba(158,158,158,.2);
  }
  .button:active {
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
  <div class="layer">
    <div class="row editor">

      <div class="upload-box">
        <label class="button">
          INSERT IMAGE
          <input type="file" accept="image/*" multiple @change="fileChange($event)">
          <i id="progress"></i>
        </label>

        <div class="thumbnail" v-for="url in url">
          <img :src="url">
        </div>
      </div>

      <textarea v-el:textarea v-model="item.text"></textarea>

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
        return this.item.img.map(dns)
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
