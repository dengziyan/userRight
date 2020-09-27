// eslint-disable-next-line no-unused-vars

const baseTabList = [{
  path: '/',
  name: 'home',
  title: '首页',
  icon: 'home',
  type: '',
  effect: 'plain'
}]

export default {
  state: {
    isCollapse: false,
    currentMenu: null,
    menu: [],
    tabsList: baseTabList
  },
  mutations: {
    selectMenu(state, val) {
      if (val.name !== 'home') {
        // console.log(val.name)
        state.currentMenu = val
        const result = state.tabsList.findIndex(item => item.name === val.name)
        // tags动态显示，当前路由高亮
        state.tabsList.forEach(function(value, index) {
          value.effect = 'plain'
          state.tabsList.splice(index, 1, value)
        })
        val.effect = 'dark'
        result === -1 ? state.tabsList.push(val) : state.tabsList.splice(result, 1, val)
      } else {
        // tags动态显示，当前路由高亮
        val.effect = 'dark'
        // console.log(state.tabsList)
        state.tabsList.forEach(function(value, index) {
          if (index !== 0) {
            value.effect = 'plain'
            state.tabsList.splice(index, 1, value)
          }
        })
        state.tabsList.splice(0, 1, val)
        state.currentMenu = null
      }

      // val.name === 'home' ? (state.currentMenu = null) : (state.currentMenu = val)
    },
    closeTab(state, val) {
      const result = state.tabsList.findIndex(item => item.name === val.name)
      state.tabsList.splice(result, 1)
    },
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse
    },
    setTabList(state, menu) {
      // console.log(menu)
      state.tabsList.forEach(function(value, index) {
        value.effect = 'plain'
        state.tabsList.splice(index, 1, value)
      })
      const result = state.tabsList.findIndex(item => item.name === menu.name)
      result === -1 ? state.tabsList.push(menu) : state.tabsList.splice(result, 1, menu)
      state.currentMenu = menu.name === 'home' ? null : menu
    }
  },
  actions: {}
}
