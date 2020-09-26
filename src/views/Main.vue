<template>
  <el-container>
    <el-aside width="auto"><common-aside /></el-aside>
    <el-container>
      <el-header><common-header /></el-header>
      <common-tab />
      <el-main>
        <keep-alive>
        <router-view />
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import CommonHeader from '../components/CommonHeader'
import CommonAside from '../components/CommonAside'
import CommonTab from '../components/CommonTab'
export default {
  components: {
    CommonHeader,
    CommonAside,
    CommonTab
  }
}
</script>

<style>
  .el-header{
    background-color: #99a9bf;
  }

  #app {
    overflow-y:hidden;
  }
  .app-container {
    padding: 20px;
  }
  .el-col-20 {
    /*width: 100.33333%;*/
  }
  .el-submenu .el-menu-item {
    /*min-width: auto;*/
  }
  .el-dialog__footer {
    padding: 10px 20px 50px;
  }
  .el-main{
    overflow: unset;
  }
  .el-container.is-vertical {
    overflow-y: auto;
    height: 100vh;
  }
</style>
