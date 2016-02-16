<style>
.fade-enter {
  animation: fadeInDown .5s;
}
.fade-leave {
  animation: fadeOutDown .5s;
}
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
}
</style>

<template>
  <div class="main">
    <Navbar :status="status"></Navbar>
    <Callout transition="fade" :status="status" v-for="item in set" :item="item" v-show="!status.edit"></Callout>
    <button type="button" @click="more" v-show="hasMore">MORE</button>
    <Editor :item="current" v-show="status.edit"></Editor>
  </div>
</template>

<script lang="babel">
  import Navbar from './Navbar.vue'
  import Callout from './Callout.vue'
  import Editor from './Editor.vue'

  export default {
    props: ['set', 'status', 'current', 'hasMore'],

    methods: {
      more() {
        this.$dispatch('more')
      }
    },

    components: { Navbar, Callout, Editor }
  }
</script>
