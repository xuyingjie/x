<style>
.card {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  margin: 1rem 0;
}
.card .collapse {
  padding: 16px;
  max-height: 200px;
  overflow: hidden;
}
.card nav {
  border-top: 1px solid rgba(0,0,0,.1);
}
.card nav span {
  padding: 0 16px;
  line-height: 36px;
}
</style>

<template>
  <div class="row card">
    <div class="collapse" @click="collapse($event)">
      <section @click.stop>
        <img :src="src" v-for="src in img">
        {{{text}}}
      </section>
    </div>
    <nav>
      <span class="item">{{new Date(item.lastChange).toDateString()}}</span>
      <button type="button" @click="edit(item.id)" v-show="status.auth">EDIT</button>
    </nav>
  </div>
</template>


<script lang="babel">
  import marked from 'marked'
  import { dns } from '../tools'

  export default {
    props: ['item', 'status'],

    data() {
      return {
        img: [],
        load: false
      }
    },

    computed: {
      text() {
        return marked(this.item.text, { breaks: true, sanitize: true })
      }
    },

    compiled() {
      var id = this.item.img[0]
      if (id) this.img.push(dns(id))
    },

    methods: {
      collapse(event) {
        var maxHeight = event.target.style.maxHeight
        event.target.style.maxHeight = (maxHeight === 'none') ? '200px' : 'none'
        if (!this.load) {
          this.img = this.item.img.map(dns)
          this.load = true
        }
      },
      edit(id) {
        this.$dispatch('edit', id)
      }
    }
  }
</script>
