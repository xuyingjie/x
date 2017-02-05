<template>
    <div>
        <Navbar></Navbar>
        <template v-if="auth">
            <Fragment></Fragment>
            <router-view></router-view>
        </template>
    </div>
</template>

<script>
    import Navbar from '../components/Navbar'
    import Fragment from './Fragment'

    export default {
        components: { Navbar, Fragment },

        computed: {
            auth() {
                return this.$store.state.auth
            }
        }
    }

</script>