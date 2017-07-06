<template>
    <div class="view layer">
        <section class="row card">
            <Picture v-for="id in item.img" :id="id" :key="id"></Picture>

            <div class="content" v-if="text" v-html="text"></div>
        </section>
    </div>
</template>

<script>
    import Picture from '../components/Picture.vue'
    import marked from 'marked'

    export default {
        components: { Picture },

        props: ['set'],

        computed: {
            item() {
                return this.$store.getters.currentItem
            },
            text() {
                return marked(this.item.text, {
                    breaks: true,
                    sanitize: true
                })
            }
        },

        created() {
            let id = this.$route.params.id
            this.$store.commit('setCurrentItemId', id)
        },

        destroyed() {
            this.$store.commit('setCurrentItemId', '')
        }
    }

</script>

<style scoped>
    .view .card {
        min-height: 128px;
    }
    
    .view .content {
        padding: 1rem;
        word-wrap: break-word;
    }
    
    .view pre>code {
        word-wrap: normal;
    }
    
    @media screen and (max-width: 39.9375em) {
        .view .content {
            padding: 0.5rem;
        }
    }
</style>