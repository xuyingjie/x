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
  padding-top: 80px;
}
.fragment {
  display: flex;
  justify-content: space-between;
}
.fragment .col {
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div class="main">
    <Navbar :status="status"></Navbar>
    <div class="row fragment">
      <div class="col">
        <Callout transition="fade" :status="status" v-for="(index, item) in set" :item="item" v-if="!(index&1)"></Callout>
      </div>
      <div class="col">
        <Callout transition="fade" :status="status" v-for="(index, item) in set" :item="item" v-if="index&1"></Callout>
      </div>
    </div>
    <button type="button" @click="more" v-show="hasMore">MORE</button>
    <View :item="current" v-show="status.view"></View>
    <Editor :item="current" v-show="status.edit"></Editor>
  </div>
</template>

<script lang="babel">
  import Navbar from './Navbar.vue'
  import Callout from './Callout.vue'
  import View from './View.vue'
  import Editor from './Editor.vue'

  export default {
    props: ['set', 'status', 'current', 'hasMore'],

    compiled() {
      this.$dispatch('init')
    },

    methods: {
      more() {
        this.$dispatch('more')
      }
    },

    components: { Navbar, Callout, View, Editor }
  }
</script>
