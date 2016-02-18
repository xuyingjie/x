<style>
  .view .card {
    min-height: 128px;
  }
  .view .content {
    padding: 1rem;
  }
</style>

<template>
  <div class="view layer">
    <section class="row card">
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

  components: { Picture }
}
</script>
