<template>
    <div class="bar">
        <nav class="row">
            <template v-if="auth">
                <router-link to="/" v-if="layer">
                    <h1>BACK</h1>
                </router-link>

                <template v-else>
                    <h1 class="item">X</h1>
                    <input type="text" v-model="keyword" @keyup="search">
                    <router-link class="button" to="/edit">ADD</router-link>
                    <router-link class="button" to="/file">FILE</router-link>
                    <button type="button" @click="logout">LOGOUT</button>
                </template>
            </template>

            <form @submit.prevent="login" v-else>
                <input type="text" v-model="name">
                <input type="password" v-model="passwd">
                <button type="submit">LOGIN</button>
            </form>
        </nav>
    </div>
</template>

<script>
import { get } from '../tools'

export default {
    data() {
        return {
            name: '',
            passwd: '',
            keyword: ''
        }
    },

    computed: {
        auth() {
            return this.$store.state.auth
        },
        hasMore() {
            return this.$store.getters.hasMore
        },
        layer() {
            return this.$route.path !== '/'
        }
    },

    methods: {
        async login() {
            let user = await get(this.name, { passwd: this.passwd })
            this.name = ''
            this.passwd = ''
            this.$store.dispatch('login', user)
        },
        logout() {
            this.$store.dispatch('logout')
        },
        search() {
            if (this.hasMore) {
                this.$store.dispatch('loadItem', true)
            }
            this.$store.commit('setKeyword', this.keyword)
        }
    }
}

</script>

<style scoped>
.bar nav {
    justify-content: space-between;
}

.bar form {
    width: 100%;
    display: flex;
    align-items: center;
}

.bar input[type=password],
.bar button[type=submit] {
    opacity: 0.42;
}

.bar nav input {
    overflow: hidden;
    /*!!!*/
}

.bar h1 {
    margin: 0 10px 0 0;
    color: #676767;
}
</style>