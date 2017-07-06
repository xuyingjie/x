<template>
    <form class="row join" @submit.prevent="join">
        <label>
            Name
            <input type="text" v-model="name">
        </label>
        <label>
            Password
            <input type="text" v-model="passwd">
        </label>
        <label>
            Key
            <input type="text" v-model="user.key">
        </label>
        <label>
            AK
            <input type="text" v-model="user.AK">
        </label>
        <label>
            SK
            <input type="text" v-model="user.SK">
        </label>
        <button type="submit">JOIN</button>
    </form>
</template>

<script>
    import { post } from '../tools'

    export default {
        data() {
            return {
                name: '',
                passwd: '',

                user: {
                    AK: '',
                    SK: '',
                    key: '',
                }
            }
        },

        methods: {
            async join() {
                localStorage.user = JSON.stringify(this.user)

                await post(this.name, this.user, { passwd: this.passwd })
                console.log('success')
            }
        }
    }

</script>

<style scoped>
    .join {
        max-width: 960px;
        display: flex;
        flex-direction: column;
    }
    
    .join label {
        margin: 5px 0;
    }
</style>