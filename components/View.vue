<style>
  .view .card {
    min-height: 128px;
  }
  .view .content {
    padding: 1rem;
  }
  @media screen and (max-width: 39.9375em) {
    .view .content {
      padding: 0.5rem;
    }
  }
</style>

<template>
  <div class="view layer">
    <section class="row card">
      <Picture :id="id" v-for="id in item.img | orderBy true"></Picture>
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
  props: ['set'],
  computed: {
    item() {
      var id = Number(location.hash.split('/')[2])
      return Object.assign({}, this.set.filter(el => el.id === id)[0])
    },
    text() {
      return this.item.text ? marked(this.item.text, { breaks: true, sanitize: true }) : ''
    }
  },

  components: { Picture }
}
</script>
