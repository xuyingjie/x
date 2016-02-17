<style>
.card {
  width: 532px;
  background: #fefefe;
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  margin-bottom: 1rem;
}
.card section {
  max-height: 568px;
  overflow: hidden;
}
.card section.show {
  max-height: none;
}
.card .content {
  padding: 1rem;
}
.card nav {
  background-color: #f9f9f9;
}
.card nav span {
  padding: 0 16px;
  line-height: 36px;
  color: #f9f9f9;
}
</style>

<template>
  <div class="card">
    <section id="{{item.id}}">
      <img :src="src" v-for="src in img">
      <div class="content" v-if="text.length">
        {{{text}}}
      </div>
    </section>
    <nav>
      <span class="item" @click="collapse(item.id)">{{new Date(item.lastChange).toDateString()}}</span>
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
      collapse(id) {
        var el = document.getElementById(id)
        el.classList.toggle('show')
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
