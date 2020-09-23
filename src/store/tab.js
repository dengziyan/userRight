export default {
  state: {
    isCollapse: false,
    currentMenu: null,
    menu: [],
    tabsList: [
      {
        path: '/',
        name: 'home',
        title: '首页',
        icon: 'home',
        type: '',
        effect: 'dark'
      }
    ]
  },
  mutations: {
    selectMenu(state, val) {
      if (val.name !== 'home') {
        console.log(val.name)
        state.currentMenu = val
        const result = state.tabsList.findIndex(item => item.name === val.name)
        state.tabsList[0].effect='plain'
        val.effect = 'dark'
        result === -1 ? state.tabsList.push(val) : ''
      } else {
        val.effect = 'dark'
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
    }
  },
  actions: {}
}
