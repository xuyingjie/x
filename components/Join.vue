<style>
  .join {
    max-width: 960px;
    display: flex;
    flex-direction: column;
  }
  .join label {
    margin: 5px 0;
  }
</style>

<template>
  <form class="row join" @submit.prevent="join">
    <label>Name
      <input type="text" v-model="name" />
    </label>
    <label>Password
      <input type="text" v-model="secret" />
    </label>
    <label>Random Password
      <input type="text" v-model="user.passwd" />
    </label>
    <label>AK
      <input type="text" v-model="user.AK" />
    </label>
    <label>SK
      <input type="text" v-model="user.SK" />
    </label>
    <button type="submit">JOIN</button>
  </form>
</template>

<script lang="babel">
  import { upload, encrypt, strToArrayBuffer } from '../tools'

  export default {
    data() {
      return {
        name: '',
        secret: '',

        user: {
          AK: '',
          SK: '',
          passwd: '',
        },
      }
    },

    methods: {
      join() {
        localStorage.user = JSON.stringify(this.user)

        var buf = strToArrayBuffer(JSON.stringify(this.user))
        encrypt(this.secret, buf).then(enc => {
          upload(this.name, enc).then(() => {
            console.log('success')
          })
        })
      },
    },
  }
</script>
