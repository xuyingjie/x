<template>
  <img :src="url">
</template>

<script lang="babel">
import { getSrc } from '../tools'

export default {
  props: ['id'],
  data() {
    return {
      url: ''
    }
  },
  compiled() {
    getSrc(this.id).then(url => {
      this.url = url
    })
  }
}
</script>
