<style>
  .bar nav {
    justify-content: space-between;
  }
  .bar form {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .bar h1 {
    margin: 0;
    color: #676767;
  }
</style>

<template>
  <div class="bar">
    <nav class="row">

      <h1 style="cursor:pointer;" @click="back" v-if="page">BACK</h1>
      <template v-else>
        <template v-if="auth">
          <h1 class="item">TITLE</h1>
          <button type="button" @click="add">ADD</button>
          <button type="button" @click="file">FILE</button>
          <button type="button" @click="logout">LOGOUT</button>
        </template>

        <form @submit.prevent="login" v-else>
          <input type="text" placeholder="Name" v-model="name">
          <input type="password" placeholder="Password" v-model="passwd">
          <button type="submit">LOGIN</button>
        </form>
      </template>

    </nav>
  </div>
</template>

<script lang="babel">
  import { get } from '../tools'

  export default {
    props: ['auth', 'page'],

    data() {
      return {
        name: '',
        passwd: '',
      }
    },

    methods: {
      add() {
        location.assign(`#/edit`)
      },
      login() {
        get(this.name, {passwd:this.passwd}).then(data => {
          localStorage.user = JSON.stringify(data)
          this.$dispatch('login')
        })
      },
      logout() {
        localStorage.removeItem('user')
        this.$dispatch('logout')
      },
      back() {
        history.back()
      },
      file() {
        location.assign(`#/file`)
      },
    }
  }
</script>
