<template>
  <Navbar :auth="auth" :page="page"></Navbar>

  <Fragment :set="set" :auth="auth" :has-more="hasMore"></Fragment>
  <View transition="fade" :set="set" v-if="page=='view'"></View>
  <Editor transition="fade" :set="set" v-if="page=='edit'"></Editor>
  <File transition="fade" v-if="page=='file'"></File>
</template>

<script lang="babel">
  import Navbar from './Navbar.vue'
  import Fragment from './Fragment.vue'
  import View from './View.vue'
  import Editor from './Editor.vue'
  import File from './File.vue'

  export default {
    props: ['set', 'auth', 'page', 'hasMore'],

    compiled() {
      this.$dispatch('init')
    },

    components: { Navbar, Fragment, View, Editor, File }
  }
</script>
