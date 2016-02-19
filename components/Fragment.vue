<style>
  .space-between {
    display: flex;
    justify-content: space-between;
  }
  .fragment .col {
    display: flex;
    flex-direction: column;
    max-width: 530px;
    width: 100%;
    overflow: hidden; /*!!!*/
  }
  .fragment .col:first-child {
    margin-right: 1rem;
  }
  .fragment > button {
    display: block;
    margin: 0 auto;
  }
  .fragment.medium .callout {
    margin-bottom: 1rem;
  }
</style>

<template>
  <div class="fragment layer" :class="{medium:medium}">
    <div class="row" v-if="small">
      <Callout transition="fadedown" :auth="auth" v-for="item in set" :item="item"></Callout>
    </div>

    <div class="row space-between" v-else>
      <div class="col">
        <Callout transition="fadedown" :auth="auth" v-for="(index, item) in set" :item="item" v-if="!(index&1)"></Callout>
      </div>
      <div class="col">
        <Callout transition="fadedown" :auth="auth" v-for="(index, item) in set" :item="item" v-if="index&1"></Callout>
      </div>
    </div>
    <button type="button" @click="more" v-show="hasMore">MORE</button>
  </div>
</template>

<script lang="babel">
  import Callout from './Callout.vue'

  export default {
    props: ['set', 'auth', 'hasMore'],
    data() {
      return {
        medium: false,
        small: false,
      }
    },

    created() {
      this.resize()
      window.onresize = this.resize
    },

    methods: {
      resize() {
        this.medium = (window.innerWidth < 1080) ? true : false
        this.small = (window.innerWidth < 800) ? true : false
      },
      more() {
        this.$dispatch('more')
      }
    },

    components: { Callout }
  }
</script>
