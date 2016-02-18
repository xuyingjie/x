<style>
  .bar {
    display: flex;
    justify-content: center;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;

    width: 100%;
    height: 64px;
    line-height: 64px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 1px 8px rgba(0,0,0,.3);
    margin-bottom: 1rem;
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
      <template v-if="status.auth">
        <h1 class="item">TITLE</h1>
        <button type="button" @click="add">ADD</button>
        <button type="button" @click="logout">LOGOUT</button>
      </template>

      <form @submit.prevent="login" v-else>
        <input type="text" placeholder="Name" v-model="name">
        <input type="password" placeholder="Password" v-model="passwd">
        <button type="submit">LOGIN</button>
      </form>

    </nav>
  </div>
</template>

<script lang="babel">
  import { get } from '../tools'

  export default {
    props: ['status'],

    data() {
      return {
        name: '',
        passwd: '',
      }
    },

    methods: {
      add() {
        this.$dispatch('add')
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
    }
  }
</script>
