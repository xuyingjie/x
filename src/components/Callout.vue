<template>
    <div class="callout card">
        <router-link :to="`/view/${item.id}`">
            <Picture :id="src" :key="src" v-if="src"></Picture>
            <pre v-if="text"><code>{{text}}</code></pre>
        </router-link>

        <nav>
            <!--<span class="item">{{new Date(item.lastChange).toDateString()}}</span>-->
            <router-link class="button" :to="`/edit/${item.id}`">EDIT</router-link>
        </nav>
    </div>
</template>

<script>
    import Picture from './Picture'

    export default {
        components: { Picture },

        props: ['item'],
        computed: {
            src() {
                return [...this.item.img].sort()[0]
            },
            text() {
                return this.item.text.split(/\n/).slice(0, 9).join('\n')
            }
        }
    }

</script>

<style scoped>
    .callout:hover {
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    }
    
    .callout pre {
        margin: 0;
    }
    
    .callout pre>code {
        border: none;
        background-color: #fefefe;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    
    .callout pre:first-child>code {
        min-height: 90px;
    }
    
    .callout nav {
        background-color: #f9f9f9;
    }
    
    .callout nav button {
        font-size: 16px;
    }
</style>