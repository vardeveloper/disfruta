<template lang="html">
  <div class="page-next-loader page-next-loader-bar">
    <slot></slot>
    <div class="page-next-loader-path-content">
      <svg class="page-next-loader-path-bar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 452 36">
        <path d="M0 36h452V0H291.5a48.51 48.51 0 0 0-39 19.7 33 33 0 0 1-46.25 6.75 33.22 33.22 0 0 1-6.75-6.75 48.51 48.51 0 0 0-39-19.7H0z" data-name="bar"/>
      </svg>
      <div class="page-next-loader-path-lateral page-next-loader-path-left"></div>
      <div class="page-next-loader-path-lateral page-next-loader-path-right"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageNextLoaderBar'
}
</script>

<style scoped>
  .page-next-loader-bar {
    width: 100%;
    height: 60px;
    transition: opacity .2s ease-in-out, transform .2s ease-in-out;
    transform: translateY(0px);
  }

  .page-next-loader-path-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page-next-loader-path-bar {
    height: 100%;
  }

  .page-next-loader-path-lateral {
    position: absolute;
    top: 0;
    height: 100%;
    width: 42%;
  }

  .page-next-loader-path-right {
    right: 0;
  }

  .page-next-loader-path-left {
    left: 0;
  }

  @media (max-width: 650px) {
    .page-next-loader-path-lateral {
      width: 33%;
    }
  }

  @media (max-width: 620px) {
    .page-next-loader-path-bar {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 480px;
      margin-left: -240px;
    }
    .page-next-loader-path-lateral {
      width: 20%;
    }
  }
</style>
