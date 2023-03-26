import { login, logout, getUserViewsByPage, getUserViewsCount, getUserViewByToken } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    avatar: '',
    roles: [],
    isAddRoutes: false
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
  SET_NAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username, password: password }).then(response => {
        const { data } = response
        // console.log(data.token)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserViewsByPage(data) {
    const { keyword, page, perPage } = data
    return new Promise((resolve, reject) => {
      getUserViewsByPage(keyword, page, perPage).then(resp => {
        const { data } = resp
        if (data.code !== 200) {
          return reject(resp.data.msg)
        }
        resolve(data)
      })
    })
  },
  getUserViewsCount() {
    return new Promise((resolve, reject) => {
      getUserViewsCount().then(resp => {
        const { data } = resp
        if (data.code !== 200) {
          return reject(resp.data.msg)
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getCurrUserViewByToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserViewByToken().then(response => {
        const { data } = response
        if (!data) {
          return reject('令牌失效,请重新登陆.')
        }
        // console.log(data)
        const { username, roleId } = data

        // console.log(response)
        // 信息更新到session
        sessionStorage.setItem('uid', response.data.id)
        sessionStorage.setItem('username', response.data.username)
        sessionStorage.setItem('nickname', response.data.nickname)
        sessionStorage.setItem('rid', response.data.roleId)
        commit('SET_NAME', username)
        // commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roleId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
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
      removeToken() // must remove  token  first
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

