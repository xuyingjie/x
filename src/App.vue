<template>
    <div id="app">
        <navbar />
        <home />
        <router-view />
    </div>
</template>

<script>
import '@/assets/base.css'
import Navbar from '@/components/Navbar'
import Home from '@/components/Home'

export default {
    components: { Navbar, Home }
}
</script>
