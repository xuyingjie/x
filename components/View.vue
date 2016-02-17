<style>
  .layer section {
    padding: 2.5rem;
  }
  .layer .content {
    margin: 1rem 0;
  }
</style>

<template>
  <div class="layer" @click="cancel">
    <section class="row" @click.stop>
      <img :src="src" v-for="src in img">
      <div class="content" v-if="text.length">
        {{{text}}}
      </div>
    </section>
  </div>
</template>

<script lang="babel">

import marked from 'marked'
import { dns } from '../tools'

export default {
  props: ['item'],
  computed: {
    img() {
      return this.item.img.map(dns)
    },
    text() {
      return marked(this.item.text, { breaks: true, sanitize: true })
    }
  },

  methods: {
    cancel() {
      this.$dispatch('cancel')
    }
  }

}
</script>
