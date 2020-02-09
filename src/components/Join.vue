<template>
    <form class="row join" @submit.prevent="join">
        <label>
            Name
            <input type="text" v-model="name" />
        </label>
        <label>
            Password
            <input type="text" v-model="passwd" />
        </label>
        <label>
            Key
            <input type="text" v-model="user.key" />
        </label>
        <label>
            AccessKeyId
            <input type="text" v-model="user.accessKeyId" />
        </label>
        <label>
            AccessKeySecret
            <input type="text" v-model="user.accessKeySecret" />
        </label>
        <button type="submit">JOIN</button>
    </form>
</template>

<script>
import { post } from '@/utils/tools'

export default {
    data() {
        return {
            name: '',
            passwd: '',

            user: {
                accessKeyId: '',
                accessKeySecret: '',
                key: '',
            }
        }
    },

    methods: {
        async join() {
            localStorage.user = JSON.stringify(this.user)

            await post(this.name, this.user, { passwd: this.passwd })
            // console.log('success')
            this.name = 'success'
        }
    }
}

</script>

<style scoped>
.join {
    max-width: 960px;
    display: flex;
    flex-direction: column;
    background: #fff;

    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
}

.join label {
    margin: 5px 0;
}
</style>