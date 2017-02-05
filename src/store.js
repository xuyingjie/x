import Vue from 'vue'
import Vuex from 'vuex'
import { get, post } from './tools'

Vue.use(Vuex)

var store = new Vuex.Store({
    state: {
        auth: false,

        list: [],
        set: [],

        index: 0,
        count: 7,

        keyword: '',
        currentItemId: ''
    },

    getters: {
        filterSet: (state) => {
            var re = new RegExp(state.keyword, 'i')
            return state.set.filter(el => (el.text.match(re)))
        },

        hasMore: state => state.list.length > state.index,

        currentItem: state => state.set.find(el => el.id === +state.currentItemId)
    },

    mutations: {
        auth(state) {
            state.auth = true
        },

        initList(state, list) {
            state.list = list
        },

        initSet(state, item) {
            state.set = [...state.set, item]
        },

        indexIncrement(state) {
            state.index += 1
        },

        addItem(state, item) {
            state.set = [item, ...state.set]
        },

        updateItem(state, item) {
            state.set = state.set.map(el => el.id === item.id ? item : el)
        },

        setCurrentItemId(state, id) {
            state.currentItemId = id
        },

        setKeyword(state, keyword) {
            state.keyword = keyword
        },

        clear(state) {
            state.auth = false
            state.list = []
            state.set = []
            state.index = 0
        }
    },

    actions: {
        async loadList({commit, dispatch}) {
            let out = await get('list')
            commit('initList', out.list)
            dispatch('loadItem')
        },

        loadItem({state, commit}, loadAll = false) {
            let end = loadAll ? state.list.length : state.index + state.count

            state.list.slice(state.index, end).forEach(async id => {
                commit('indexIncrement')

                let item = await get(`set/${id}`)
                commit('initSet', item)
            })
        },

        async saveItem({state, commit}, {item, isNew}) {
            await post(`set/${item.id}`, item)
            if (isNew) {
                let list = [item.id, ...state.list]
                await post('list', { list })
                commit('initList', list)
                commit('addItem', item)
                commit('indexIncrement')
            } else {
                commit('updateItem', item)
            }
            location.replace('#/')
        },

        login({commit, dispatch}, user) {
            localStorage.user = JSON.stringify(user)
            commit('auth')
            dispatch('loadList')
        },

        logout({commit}) {
            localStorage.removeItem('user')
            commit('clear')
        }
    }
})

if (localStorage.user) {
    store.commit('auth')
    store.dispatch('loadList')
}

export default store
