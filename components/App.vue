<style>
.fade-enter {
  animation: fadeInDown .5s;
}
.fade-leave {
  animation: fadeOutDown .5s;
}
</style>

<template>
  <div>
    <Navbar :status="status"></Navbar>
    <Callout transition="fade" :status="status" v-for="item in s" :item="item" v-show="!status.edit"></Callout>
    <Editor :item="current" v-show="status.edit"></Editor>
  </div>
</template>

<script lang="babel">
  import Navbar from './Navbar.vue'
  import Callout from './Callout.vue'
  import Editor from './Editor.vue'

  export default {
    props: ['set', 'status', 'current'],

    computed: {
      s() {
        return [...this.set].reverse()
      }
    },

    components: { Navbar, Callout, Editor }
  }
</script>
