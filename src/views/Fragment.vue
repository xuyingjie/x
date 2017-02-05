<template>
    <div class="fragment layer">
        <div class="row" v-if="small">
            <Callout class="fadedown-enter" v-for="item in set" :item="item" :key="item.id"></Callout>
        </div>

        <div class="row space-between" v-else>
            <div class="col">
                <Callout class="fadedown-enter" v-for="(item, index) in evenSet" :item="item" :key="item.id"></Callout>
            </div>
            <div class="col">
                <Callout class="fadedown-enter" v-for="(item, index) in oddSet" :item="item" :key="item.id"></Callout>
            </div>
        </div>

        <button type="button" @click="more" v-show="hasMore">MORE</button>
    </div>
</template>

<script>
    import Callout from '../components/Callout'

    export default {
        components: { Callout },

        data() {
            return {
                small: false,
            }
        },

        computed: {
            set() {
                return this.$store.getters.filterSet
            },
            hasMore() {
                return this.$store.getters.hasMore
            },
            evenSet() {
                return this.set.filter((el, i) => !(i & 1))
            },
            oddSet() {
                return this.set.filter((el, i) => i & 1)
            }
        },

        methods: {
            resize() {
                this.small = (window.innerWidth < 800) ? true : false
            },
            more() {
                this.$store.dispatch('loadItem')
            }
        },

        created() {
            this.resize()
            window.onresize = this.resize
        }
    }

</script>

<style scoped>
    .space-between {
        display: flex;
        justify-content: space-between;
    }
    
    .fragment .col {
        width: 50%;
    }
    
    .fragment .col:first-child {
        padding-right: 10px;
    }
    
    .fragment .col:last-child {
        padding-left: 10px;
    }
    
    .fragment>button {
        display: block;
        margin: 0 auto;
    }
    
    @media screen and (min-width: 40em) and (max-width: 67.5em) {
        .fragment .col:first-child {
            padding-right: 0.5rem;
        }
        .fragment .col:last-child {
            padding-left: 0.5rem;
        }
        .fragment .callout {
            margin-bottom: 1rem;
        }
    }
    
    @media screen and (max-width: 39.9375em) {
        .fragment .callout {
            margin-bottom: 10px;
        }
    }
</style>