<style>
  .editor > .row {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .editor input[type=file] {
    display: none;
  }
  .editor textarea {
    width: 100%;
    height: 540px;
    padding: 12px;
    margin: 0;
    border-bottom: none;
    border-radius: 0;
  }
  @media screen and (max-width: 39.9375em) {
    .editor textarea {
      padding: 0.5rem;
      height: 320px;
    }
  }
  .upload-box {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    width: 100%;
  }
  .upload-box > * {
    height: 90px;
    width: 90px;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
    overflow: hidden;
    position: relative;
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
  .upload-box .erase {
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 24px;
    background-color: rgba(255, 0, 0, 0.42);
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    line-height: 24px;
    color: white;
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

        <div class="thumbnail" v-for="id in item.img | orderBy true">
          <Picture :id="id"></Picture>
          <i class="erase" @click="erase(id)">ERASE</i>
        </div>
      </div>

      <textarea placeholder="typing..." v-model="item.text"></textarea>
      <button type="button" @click="save">SAVE</button>
    </div>
  </div>
</template>

<script lang="babel">
  import Picture from './Picture.vue'
  import { upload } from '../tools'

  export default {
    props: ['set'],
    data() {
      return {
        item: {
          id: 0,
          img: [],
          text: '',
          lastChange: 0
        }
      }
    },
    created() {
      var id = Number(location.hash.split('/')[2])
      if (id) {
        this.item = Object.assign({}, this.set.filter(el => el.id === id)[0])
        this.$watch('set', (val) => {
          this.item = Object.assign({}, val.filter(el => el.id === id)[0])
        })
      }
    },

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

        var readAndUpload = (file, index) => {
          var fileType = file.name.slice(file.name.lastIndexOf('.'))
          var id = Date.now() + index + fileType
          var reader = new FileReader()
          reader.onload = () => {
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

      erase(id) {
        upload(`img/${id}`, {}).then(() => {
          this.item.img = this.item.img.filter(el => el !== id)
        })
      },
    },

    components: { Picture }
  }
</script>
