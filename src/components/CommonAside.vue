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
      <el-menu-item v-for="item in noChildren" :key="item.name" :index="'/'+item.name" @click="clickMenu(item)">
        <i :class="'el-icon-'+item.icon"/>
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>

      <el-submenu v-for="(item,index) in hasChildren" :key="index" :index="index+''">
        <template slot="title">
          <i :class="'el-icon-'+item.icon" />
          <span slot="title">{{ item.title }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for=" (subItem,subIndex) in item.children" :key="subIndex" :index="'/'+subItem.name"
                        @click="clickMenu(subItem)">
            <i :class="'el-icon-'+subItem.icon"/>
            {{ subItem.title }}
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { treeList } from '@/api/authoraty/menu'

export default {
  data() {
    return {
      asideMenu: []
    }
  },
  computed: {
    noChildren() {
      return this.asideMenu.filter(item => !item.children)
    },
    hasChildren() {
      return this.asideMenu.filter(item => item.children)
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
      treeList().then( response => {
        this.$store.commit('setTabList')
        this.$store.commit('setCurrentMenu')
        this.listLoading = false
        this.asideMenu = response.data
        this.total = response.data.total
      })
    },
    clickMenu(item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
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
</style>
