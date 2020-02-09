import Vue from 'vue'
import Vuex from 'vuex'
import { get, post } from '@/utils/tools'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        auth: Boolean(localStorage.user),

        list: [],
        set: [],

        index: 0,
        count: 7,

        keyword: '',
        currentItemId: '',
    },

    getters: {
        filterSet: state => {
            const re = new RegExp(state.keyword, 'i')
            return state.set.filter(el => el.text.match(re))
        },

        hasMore: state => state.list.length > state.index,

        currentItem: state =>
            state.set.find(el => el.id === +state.currentItemId) || { img: [], text: '' },
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
            state.set = state.set.map(el => (el.id === item.id ? item : el))
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
        },
    },

    actions: {
        async loadList({ commit, dispatch }) {
            const out = (await get('list')) || { list: [] }
            commit('initList', out.list)
            dispatch('loadItem')
        },

        loadItem({ state, commit }, loadAll = false) {
            const end = loadAll ? state.list.length : state.index + state.count

            state.list.slice(state.index, end).forEach(async id => {
                commit('indexIncrement')

                const item = await get(`paper/${id}`)
                commit('initSet', item)
            })
        },

        async saveItem({ state, commit }, item) {
            const paper = { id: Date.now(), ...item, lastChange: Date.now() }
            await post(`paper/${paper.id}`, paper)

            if (!item.id) {
                const list = [paper.id, ...state.list]
                await post('list', { list })
                commit('initList', list)
                commit('addItem', paper)
                commit('indexIncrement')
            } else {
                commit('updateItem', paper)
            }
        },
    },
})
