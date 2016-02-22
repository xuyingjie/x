import Vue from 'vue'
import App from './components/App.vue'
import Join from './components/Join.vue'
import { get, upload, privacy } from './tools'

// Vue.config.debug = true
new Vue({
  el: 'body',
  data: {
    list: [],
    set: [],
    index: 0,
    keyword: '',

    auth: false,
    page: '',

    current: {
      id: 0,
      img: [],
      text: '',
      lastChange: 0
    },

    currentView: 'App'
  },

  computed: {
    filterSet() {
      return this.set.filter(el => (el.text.search(this.keyword) !== -1))
    },
    hasMore() {
      return this.list.length > this.index
    }
  },

  created() {
    this.hashChange()
    window.onhashchange = this.hashChange

    if (localStorage.user) {
      this.auth = true
    }
  },

  methods: {
    // router
    hashChange() {
      var hash = location.hash.split('/')
      switch (hash[1]) {
        case 'join':
          this.currentView = 'Join'
          break
        case 'view':
          this.page = 'view'
          break
        case 'edit':
          this.page = 'edit'
          break
        case 'file':
          this.page = 'file'
          break
        default:
          this.currentView = 'App'
          this.page = ''
      }
    },
    cache() {
      get('list').then(out => {
        this.list = out.list
        this.load()
      })
    },
    load() {
      var num = 10
      this.list.slice(this.index, this.index + num).forEach(id => {
        get(`set/${id}`).then(item => {
          // this.set.$set(i, out)  // error
          this.set.push(item)  // order?
        })
      })
      this.index += num
    }
  },

  events: {
    init() {
      if ((privacy && this.auth) || !privacy) {
        this.cache()
      }
    },
    more() {
      this.load()
    },
    login() {
      this.auth = true
      if (privacy) this.cache()
    },
    logout() {
      this.auth = false
      if (privacy) this.$data = {}
    },
    save(item, newItem) {
      var l = [...this.list]
      var s = [...this.set]
      if (newItem) {
        l = [item.id, ...l]
        s = [item, ...s]
      } else {
        s = s.map(el => el.id === item.id ? item : el)
      }

      upload(`set/${item.id}`, item).then(() => {
        if (newItem) {
          upload(`list`, { list: l }).then(() => {
            this.list = l
            this.index += 1
            this.set = s
            location.replace('#/')
          })
        } else {
          this.set = s
          location.replace('#/')
        }
      })
    },
    search(keyword) {
      this.keyword = keyword
      while (this.hasMore) {
        this.load()
      }
    },
  },

  components: { App, Join }
})
