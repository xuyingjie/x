<template>
  <img :src="url">
</template>

<script lang="babel">
import { dns } from '../tools'

export default {
  props: ['id'],
  data() {
    return {
      url: ''
    }
  },
  compiled() {
    dns(this.id).then(url => {
      this.url = url
    })
  }
}
</script>
