import Vue from 'vue'
import App from './components/App.vue'
import Join from './components/Join.vue'
import File from './components/File.vue'
import { get, upload } from './tools'

// Vue.config.debug = true
new Vue({
  el: 'body',
  data: {
    list: [],
    set: [],
    index: 0,

    status: {
      auth: false,
      edit: false,
      view: false,
    },

    current: {
      id: 0,
      img: [],
      text: '',
      lastChange: 0
    },

    currentView: 'App'
  },

  computed: {
    hasMore() {
      return this.list.length > this.index
    }
  },

  created() {
    this.hashChange()
    window.onhashchange = this.hashChange

    if (localStorage.user) {
      this.status.auth = true
    }
  },

  methods: {
    // router
    hashChange() {
      var hash = location.hash.split('/')
      if (hash[1] === 'join') {
        this.currentView = 'Join'
      } else if (hash[1] === 'file') {
        this.currentView = 'File'
      } else {
        this.currentView = 'App'
      }
    },
    cache() {
      get('list').then(out => {
        this.list = out.list
        this.set = []
        this.index = 0
        this.load(10)
      })
    },
    load(n) {
      this.list.slice(this.index, this.index + n).forEach(id => {
        get(`set/${id}`).then(item => {
          // this.set.$set(i, out)  // error
          this.set.push(item)  // order?
          this.index += 1
        })
      })
    }
  },

  events: {
    init() {
      this.cache()
    },
    login() {
      this.cache()
      this.status.auth = true
    },
    logout() {
      this.set = []
      this.index = 0
      this.status.auth = false
    },
    cancel() {
      this.status.edit = false
      this.status.view = false
    },
    add() {
      this.current = {
        id: 0,
        img: [],
        text: '',
        lastChange: 0
      }
      this.status.edit = true
    },
    edit(id) {
      this.current = Object.assign({}, this.set.filter(el => el.id === id)[0])
      this.status.edit = true
    },
    view(id) {
      this.current = Object.assign({}, this.set.filter(el => el.id === id)[0])
      this.status.view = true
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
            this.set = s
            this.status.edit = false
          })
        } else {
          this.set = s
          this.status.edit = false
        }
      })
    },
    more() {
      this.load(10)
    },

  },

  components: { App, Join, File }
})
