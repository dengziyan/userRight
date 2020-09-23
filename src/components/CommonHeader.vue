<template>
  <div>
    <header>
      <div class="l-content">
        <el-button type="primary" icon="el-icon-s-fold" @click="collapseMenu"/>
        <!-- 面包屑-->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="current" :to="'/'+current.name" :replace="true">{{
              current.title
            }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="r-content">
        <el-dropdown trigger="click" size="mini">
          <span class="el-dropdown-link">
            <img :src="userImg" class="user" alt="">
          </span>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/personal">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
    </header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '../store'

export default {
  data() {
    return {
      userImg: store.getters.avatar
    }
  },
  computed: {
    ...mapState({
      current: state => state.tab.currentMenu
    })
  },
  methods: {
    collapseMenu() {
      this.$store.commit('collapseMenu')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/logout').then(() => {
          location.href = '/login'
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
header {
  color: white;
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: space-between;
}

.el-button {
  padding: 6px 12px;
}

//左边
.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }
}

.el-breadcrumb__item {
  .el-breadcrumb__inner {
    color: #f4f4f4;
  }

  &:last-child {
    .el-breadcrumb__inner {
      color: #fff;
    }
  }
}

el-button {
  display: block;
}

//右边
.r-content {
  display: flex;

}

.r-content {
  .user {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}

//右边下拉（个人中心）
.el-dropdown-link {
  cursor: pointer;
  color: white;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-dropdown-menu--mini .el-dropdown-menu__item {
  font-size: 16px;
}

</style>
