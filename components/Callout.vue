<style>
.card {
  width: 530px;
  background: #fefefe;
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  margin-bottom: 20px;
  cursor: pointer;
}
.card:hover {
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
}
.card pre {
  margin: 0;
}
.card pre > code {
  text-overflow: ellipsis;
  overflow: hidden;
}
.card nav {
  background-color: #f9f9f9;
}
.card nav button {
  font-size: 18px;
}
</style>

<template>
  <div class="card" @click="view(item.id)">
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
