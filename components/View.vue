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
      <Picture :id="id" v-for="id in item.img"></Picture>
      <div class="content" v-if="text.length">
        {{{text}}}
      </div>
    </section>
  </div>
</template>

<script lang="babel">
import Picture from './Picture.vue'
import marked from 'marked'

export default {
  props: ['item'],
  computed: {
    text() {
      return marked(this.item.text, { breaks: true, sanitize: true })
    }
  },

  methods: {
    cancel() {
      this.$dispatch('cancel')
    }
  },

  components: { Picture }
}
</script>
