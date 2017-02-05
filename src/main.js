import './assets/base.css'

import Vue from 'vue'
import router from './router'
import store from './store'

new Vue({
    el: '#app',
    router: router,
    store: store,
    template: '<router-view></router-view>'
})