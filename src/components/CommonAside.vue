<template>
  <div>
    <el-menu :collapse="isCollapse" default-active="2" class="el-menu-vertical-demo" background-color="#409EFF" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item :index="item.path" v-for="item in noChildren" :key="item.path" @click="clickMenu(item)">
        <i :class="'el-icon-'+item.icon"></i>
        <span slot="title">{{item.label}}</span>
      </el-menu-item>

      <el-submenu index="index" v-for="(item,index) in hasChildren" :key="index">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.label}}</span>
        </template>

        <el-menu-item-group>
          <el-menu-item :index="subItem.path" v-for = " (subItem,subIndex) in item.children" :key="subIndex" @click="clickMenu(subItem)">{{subItem.label}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
    export default {
      computed: {
        noChildren() {
          return this.asideMenu.filter(item => !item.children)
        },
        hasChildren() {
          return this.asideMenu.filter(item => item.children)
        },
        isCollapse(){
          return this.$store.state.tab.isCollapse
        }
      },
        data() {
          return {
            asideMenu : [
              {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 's-home'
              },
              {
                label: '权限',
                name: 'authoraty',
                icon: 's-ticket',
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
                    path: '/resourseList',
                    name: 'resourseList',
                    label: '资源列表',
                    icon: 'tree'
                  }
                ]
              },
              {
                label: '系统管理',
                name: 'system',
                icon: 's-custom',
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
      methods:{
        clickMenu(item){
          // debuger;
          this.$router.push({name: item.name})
          this.$store.commit('selectMenu',item)
        }
      }

    }
</script>y

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
