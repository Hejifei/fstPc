<template>
  <div class="indexC">
    <div class="listtitle">首页</div>
    <div class="indexBGC" :style="indexBG" style="background-position:center center;"></div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      indexBG:{
        backgroundImage: "url(" + require("../../assets/img/main_bgpic.png") + ")",
        backgroundRepeat: "no-repeat",
        backgrounPosition:'center',
        backgroundSize: "cover",
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
