<template>
  <div class="menutree">
    <label v-for="menu in data" :key="menu.id">
      <el-submenu v-if="menu.children" :index="'/' + menu.name">
        <template slot="title">
          <i :class="'el-icon-'+menu.icon" />
          <span>{{ menu.title }}</span>
        </template>
        <label>
          <menutree :data="menu.children"/>
        </label>
      </el-submenu>
      <el-menu-item
        v-else
        :index="'/'+menu.title"
        @click="clickMenu(menu)"
      >
        <i :class="'el-icon-' + menu.icon" />
        <span slot="title">{{ menu.title }}</span>
      </el-menu-item>
    </label>
  </div>
</template>

<script>
import menutree from '@/components/menutree'
export default {
  name: 'menutree',
  components: {
    menutree: menutree
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['data'],
  data() {
    return {
      menu_data: {}
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
