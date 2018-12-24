<template>
  <div class="hello">
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        登陆界面
        <router-view/>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
    
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
