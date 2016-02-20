<style>
  .space-between {
    display: flex;
    justify-content: space-between;
  }
  .fragment .col {
    width: 50%;
  }
  .fragment .col:first-child {
    padding-right: 10px;
  }
  .fragment .col:last-child {
    padding-left: 10px;
  }
  .fragment > button {
    display: block;
    margin: 0 auto;
  }
  @media screen and (min-width: 40em) and (max-width: 67.5em) {
    .fragment .col:first-child {
      padding-right: 0.5rem;
    }
    .fragment .col:last-child {
      padding-left: 0.5rem;
    }
    .fragment .callout {
      margin-bottom: 1rem;
    }
  }
  @media screen and (max-width: 39.9375em) {
    .fragment .callout {
      margin-bottom: 10px;
    }
  }
</style>

<template>
  <div class="fragment layer">
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
        small: false,
      }
    },

    created() {
      this.resize()
      window.onresize = this.resize
    },

    methods: {
      resize() {
        this.small = (window.innerWidth < 800) ? true : false
      },
      more() {
        this.$dispatch('more')
      }
    },

    components: { Callout }
  }
</script>
