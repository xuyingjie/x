<style>
.fadedown-enter {
  animation: fadeInDown .3s;
}
.fadedown-leave {
  animation: fadeOutDown .3s;
}
.fade-enter {
  animation: fadeIn .1s;
}
.fade-leave {
  animation: fadeOut .1s;
}
.fragment > .row {
  display: flex;
  justify-content: space-between;
}
.fragment .col {
  display: flex;
  flex-direction: column;
}
.fragment > button {
  display: block;
  margin: 0 auto;
}
</style>

<template>
  <Navbar :auth="auth" :page="page"></Navbar>

  <div class="fragment layer">
    <div class="row">
      <div class="col">
        <Callout transition="fadedown" :auth="auth" v-for="(index, item) in set" :item="item" v-if="!(index&1)"></Callout>
      </div>
      <div class="col">
        <Callout transition="fadedown" :auth="auth" v-for="(index, item) in set" :item="item" v-if="index&1"></Callout>
      </div>
    </div>
    <button type="button" @click="more" v-show="hasMore">MORE</button>
  </div>

  <View transition="fade" :set="set" v-if="page=='view'"></View>
  <Editor transition="fade" :set="set" v-if="page=='edit'"></Editor>
  <File transition="fade" v-if="page=='file'"></File>
</template>

<script lang="babel">
  import Navbar from './Navbar.vue'
  import Callout from './Callout.vue'
  import View from './View.vue'
  import Editor from './Editor.vue'
  import File from './File.vue'

  export default {
    props: ['set', 'auth', 'page', 'hasMore'],

    compiled() {
      this.$dispatch('init')
    },

    methods: {
      more() {
        this.$dispatch('more')
      }
    },

    components: { Navbar, Callout, View, Editor, File }
  }
</script>
