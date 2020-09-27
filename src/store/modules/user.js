import { login, logout, getInfo, setLoginStatus } from '@/api/user'
import { getToken, getIDKey, setCookies, removeCookies } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    realName: '',
    id: getIDKey(),
    avatar: '',
    email: '',
    mobilePhone: '',
    createDate: '',
    gender: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_REALNAME: (state, name) => {
    state.realName = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_MOBILEPHNE: (state, mobilePhone) => {
    state.mobilePhone = mobilePhone
  },
  SET_CREATEDATE: (state, createDate) => {
    state.createDate = createDate
  },
  SET_GENDER: (state, gender) => {
    state.gender = gender
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const data = response.data
        const token = data.tokenHead + data.token

        commit('SET_TOKEN', token) // token
        commit('SET_ID', data.id) // 用户编号
        setCookies(token, data.id)

        setLoginStatus(data.id)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.id).then(response => {
        const data = response.data

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const name = data.userInfo.account
        const avatar = data.userInfo.avatarUrl
        const email = data.userInfo.email
        const mobilePhone = data.userInfo.mobilePhone
        const createDate = data.userInfo.createDate
        const realName = data.userInfo.realName
        const gender = data.userInfo.gender
        commit('SET_REALNAME', realName)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_EMAIL', email)
        commit('SET_MOBILEPHNE', mobilePhone)
        commit('SET_CREATEDATE', createDate)
        commit('SET_GENDER', gender)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.name).then(response => {
        removeCookies() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeCookies() // must remove  token  first
      sessionStorage.clear()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
