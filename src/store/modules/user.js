import { login, signup, logout, getInfo, updateUserInfo, updateUserPassword } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/cookies'
const state = {
  token: getToken(),
  nikename: '',
  avatar: '',
  introduction: '',
  roles: [],
  userinfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NIKENAME: (state, nikename) => {
    state.nikename = nikename
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
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        if (response.code === 200) {
          const { token } = response.data.userinfo
          commit('SET_TOKEN', token)
          setToken(token)
          resolve(true)
        } else {
          console.log(response)
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user signup
  signup({ commit }, signupForm) {
    const { mobile, password, repassword, captcha } = signupForm
    return new Promise((resolve, reject) => {
      signup({ mobile: mobile.trim(), password, repassword, captcha }).then(response => {
        if (response.code === 200) {
          const { token, avatar } = response.data.userinfo
          commit('SET_AVATAR', avatar)
          commit('SET_TOKEN', token)
          setToken(token)
        }
        resolve(true)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { userinfo } = response.data
        if (!userinfo) {
          reject('Verification failed, please Login again.')
        }

        let { roles, nikename, avatar, introduction } = userinfo
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NIKENAME', nikename)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_USERINFO', userinfo)
        resolve(userinfo)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        // resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit, dispatch }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      dispatch('tagsView/delAllViews', null, { root: true })
      removeToken()
      resolve()
    })
  },
  // dynamically modify permissions
  updateUserInfo({ commit }, userInfo) {
    console.log(userInfo)
    return new Promise((resolve, reject) => {
      updateUserInfo({ nikename: userInfo.nikename, introduction: userInfo.introduction }).then(response => {
        resolve(response.content)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // dynamically modify permissions
  updateUserPassword({ commit }, pwdForm) {
    console.log(pwdForm)
    return new Promise((resolve, reject) => {
      updateUserPassword({ oldPwd: pwdForm.oldPwd, newPwd: pwdForm.newPwd }).then(response => {
        console.log(response)
        resolve(response.content)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
