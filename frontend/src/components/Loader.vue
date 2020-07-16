<template lang="pug">
.loader
  .loader-ico
</template>
<script>
export default {
  name: 'Loader'
}
</script>
<style scoped lang="scss">
.loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFF;
  opacity: 0.7;
  z-index: 2;
}
.loader-ico {
  background-color: transparent;
  background-image: url(#{$static-path}/svg/loader.svg);
  background-repeat: no-repeat;
  background-position: center center;
  width: 38px;
  height: 38px;
}
</style>
