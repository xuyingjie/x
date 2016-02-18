<style>
.callout {
  width: 530px;
  cursor: pointer;
}
.callout:hover {
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
}
.callout pre {
  margin: 0;
}
.callout pre > code {
  border: none;
  background-color: #fefefe;
  text-overflow: ellipsis;
  overflow: hidden;
}
.callout nav {
  background-color: #f9f9f9;
}
.callout nav button {
  font-size: 18px;
}
</style>

<template>
  <div class="callout card" @click="view(item.id)">
    <Picture :id="this.item.img[0]" v-if="this.item.img[0]"></Picture>
    <pre v-if="text.length"><code>{{text}}</code></pre>
    <nav v-show="status.auth">
      <span class="item" v-show="false">{{new Date(item.lastChange).toDateString()}}</span>
      <button type="button" @click.stop="edit(item.id)">EDIT</button>
    </nav>
  </div>
</template>


<script lang="babel">
  import Picture from './Picture.vue'

  export default {
    props: ['item', 'status'],
    computed: {
      text() {
        return this.item.text.split(/\n/).slice(0,9).join('\n')
      }
    },

    methods: {
      view(id) {
        this.$dispatch('view', id)
      },
      edit(id) {
        this.$dispatch('edit', id)
      }
    },

    components: { Picture }
  }
</script>
