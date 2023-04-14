<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {
    this.onresize()()
  },
  mounted() {
    window.onresize = this.onresize()
  },
  methods: {
    onresize() {
      return () => {
        let html = document.documentElement
        function setFontSize(fontSize) {
          html.style.fontSize = `${fontSize}px`;
        }
        function recalc() {

          // *100 之后，则样式中rem的值就需要相应的缩小100倍
          // 即：设计稿中的20px，在样式中就要写成0.2rem
          // const fontSize = windowWidth / designWidth * 100;
          const fontSize = 22 * html.clientWidth / designWidth

          // console.log(windowWidth, designWidth)

          setFontSize(fontSize);
        }
        // 规定默认的设计稿宽度720px
        const designWidth = 220;
        // const windowWidth = html.clientWidth < designWidth ? html.clientWidth : designWidth;
        // console.log('windowWidth', windowWidth)
        recalc()
      }
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
