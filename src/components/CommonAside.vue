<template>
  <div>
    <el-menu
      :collapse="isCollapse"
      :default-active="$route.path"
      router
      :unique-opened="true"
      class="el-menu-vertical-demo"
      background-color="#409EFF"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <menutree :data="menu_data" />
    </el-menu>
  </div>
</template>

<script>
import { treeList } from '@/api/authoraty/menu'
import menutree from '@/components/menutree'
export default {
  components: {
    menutree: menutree
  },
  data() {
    return {
      asideMenu: [],
      treeMenu: [],
      menu_data: []
    }
  },
  computed: {
    routePathNow() {
      const activePath = this.treeMenu.filter(item => item.path === this.$route.path)
      activePath.length !== 0 ? activePath[0].effect = 'dark' : ''
      console.log(activePath[0])
      return activePath[0]
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      treeList(this.$store.getters.id).then(response => {
        this.dynamicRouter(response.data)
        this.$store.commit('setTabList', this.routePathNow)
        // this.listLoading = false
        this.asideMenu = response.data
        this.total = response.data.total
        this.menu_data = response.data
      })
    },
    dynamicRouter(item) {
      for (const val in item) {
        const obj = item[val]
        if (obj.children) {
          this.dynamicRouter(obj.children)
        } else {
          this.treeMenu.push({
            path: '/' + obj.name,
            name: obj.name || '',
            title: obj.title || '',
            icon: obj.icon || '',
            type: '',
            effect: 'plain'
          })
        }
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  height: 100vh;
}

.el-menu {
  border: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
  min-height: 400px;
}

.el-submenu .el-menu-item {
  min-width: auto;
}
  .el-menu-vertical-demo[data-v-a28ad4e6]:not(.el-menu--collapse) {
    /*width: auto;*/
  }
</style>
