<style lang="scss" src='./style.scss'></style>

<template lang="pug">
  div( :class="{ 'ie11': $store.state.isIE11 }" )
    transition(
      mode='in-out'
      v-on:before-enter='beforeEnter'
      v-on:enter='enter'
      v-on:leave='leave'
    )
      router-view
</template>

<script>
  import AppTransition from '@/mixins/AppTransition'

  export default {
    name: 'App',
    mixins: [AppTransition]
  }
</script>


