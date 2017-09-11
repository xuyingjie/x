<template>
    <img :src="src">
</template>

<script>
import { getSrc } from '../tools'

export default {
    props: ['id'],

    data() {
        return {
            src: ''
        }
    },

    async created() {
        this.src = await getSrc(this.id)
    }
}

</script>