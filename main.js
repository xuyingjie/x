import Vue from 'vue'
import App from './components/App.vue'
import Join from './components/Join.vue'
import { get, upload, encStr, decStr } from './tools'

// Vue.config.debug = true
var app = new Vue({
  el: 'body',
  data: {
    list: [],
    set: [],

    status: {
      auth: false,
      edit: false,
    },

    current: {},

    currentView: 'App'
  },

  compiled() {
    this.cache()

    if (localStorage.user) {
      this.status.auth = true
    }
  },

  methods: {
    cache() {
      get('list', {responseType: 'json'}).then(out => {
        this.list = out.list
        this.set = []
        this.list.forEach(id => {
          get(`set/${id}`).then(data => {
            decStr(data).then(item => {
              // this.set.$set(i, out)  // error?
              this.set.push(item)  // order?
            })
          })
        })
      })
    }
  },

  events: {
    login() {
      this.cache()
      this.status.auth = true
    },
    logout() {
      this.set = []
      this.status.auth = false
    },
    cancel() {
      this.status.edit = false
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
    save(item, newItem) {
      let l = [...this.list]
      let s = [...this.set]
      if (newItem) {
        l.push(item.id)
        s.push(item)
      } else {
        s = s.map(el => el.id === item.id ? item : el)
      }

      encStr(item).then(enc => {
        upload(`set/${item.id}`, enc).then(() => {
          if (newItem) {
            upload(`list`, JSON.stringify({ list: l })).then(() => {
              this.list = l
              this.set = s
              this.status.edit = false
            })
          } else {
            this.set = s
            this.status.edit = false
          }
        })
      })
    },

  },

  components: { App, Join }
})


// router
function hashChange() {
  let hash = location.hash.split('/')
  if (hash[1] === 'join') {
    app.currentView = 'Join'
  } else {
    app.currentView = 'App'
  }
}

hashChange()
window.onhashchange = hashChange
