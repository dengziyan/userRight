<template>
  <div>
    <el-menu :collapse="isCollapse" default-active="1" unique-opened="true" class="el-menu-vertical-demo" background-color="#409EFF" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item v-for="item in noChildren" :key="item.path" :index="item.path" @click="clickMenu(item)">
        <i :class="'el-icon-'+item.icon" />
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>

      <el-submenu v-for="(item,index) in hasChildren" :key="index" :index="index">
        <template slot="title">
          <i :class="'el-icon-'+item.icon" />
          <span slot="title">{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for=" (subItem,subIndex) in item.children" :key="subIndex" :index="subItem.path" @click="clickMenu(subItem)">{{ subItem.label }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asideMenu: [
        {
          path: '/',
          name: 'home',
          label: '首页',
          icon: 's-home'
        },
        {
          label: '权限',
          name: 'authoraty',
          icon: 'set-up',
          children: [
            {
              path: '/userList',
              name: 'userList',
              label: '用户列表',
              icon: 'table'
            },
            {
              path: '/roleList',
              name: 'roleList',
              label: '角色列表',
              icon: 'tree'
            },
            {
              path: '/menuList',
              name: 'menuList',
              label: '菜单列表',
              icon: 'table'
            },
            {
              path: '/resourceList',
              name: 'resourceList',
              label: '资源列表',
              icon: 'tree'
            }
          ]
        },
        {
          label: '系统管理',
          name: 'system',
          icon: 's-tools',
          children: [
            {
              path: '/opeDiary',
              name: 'opeDiary',
              label: '操作日志',
              icon: 'table'
            },
            {
              path: '/logDiary',
              name: 'logDiary',
              label: '登录日志',
              icon: 'table'
            },
            {
              path: '/online',
              name: 'online',
              label: '在线用户',
              icon: 'table'
            }
          ]
        }
      ]
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
  methods: {
    clickMenu(item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    }
  }

}
</script>

<style lang="scss" scoped>
  .el-menu-vertical-demo{
    height:100vh;
  }
  .el-menu{
    border:none;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse){
    width: 160px;
    min-height: 400px;
  }
</style>
