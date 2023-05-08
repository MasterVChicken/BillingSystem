import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  //维护全局需要使用的状态数据
  state: {
    user_id: '',
    user_pwd: '',
    userRole: ''
  },
  getters: {
    getUserID: (state) =>{
      return state.user_id ? state.user_id : getStorage('user_id')
    },
    getUserPWD: (state) =>{
      return state.user_pwd ? state.user_pwd : getStorage('user_pwd')
    },
    getUserRole: (state) =>{
      return state.userRole ? state.userRole : getStorage('userRole')
    }
  },
  //里面定义方法，操作state方发
  mutations: {
    RESET_ROLE: (state, tr_power) => {
      if(tr_power === 1){
        state.userRole = 'checkee'
        // localStorage.setItem('userRole','checkee')
      }else if(tr_power === 2){
        state.userRole = 'manager'
        // localStorage.setItem('userRole','manager')
      }
      setStorage('userRole',state.userRole)
    },
    SET_USER_ID: (state, user_id) => {
      state.user_id = user_id
      setStorage('user_id',user_id)
    },
    SET_USER_PWD: (state, user_pwd) => {
      state.user_pwd = user_pwd
      setStorage('user_pwd',user_pwd)
    },
    SET_ROLE: (state, user_id_class) => {
      if(user_id_class === 0){
        // user_id_class为0表示管理员
        state.userRole = 'admin'
      }else if(user_id_class === 1){
        // user_id_class为1表示学生
        state.userRole = 'stu'
      }else if(user_id_class === 2){
        // user_id_class为2表示教师
        state.userRole = 'teacher'
      }else if(user_id_class === 3){
        // user_id_class为3表示财务人员
        state.userRole = 'finance'
      }else if(user_id_class === 4){
        // user_id_class为4表示辅导员助理
        state.userRole = 'stu_assit'
      }
      setStorage('userRole',state.userRole)
    }
  },
  // 操作异步操作mutation
  actions: {
    login({commit},data){
      commit('SET_USER_ID',data.user_id)
      commit('SET_USER_PWD',data.user_pwd)
      commit('SET_ROLE',data.user_id_class)
    }
  },
  modules: {

  },
})

const setStorage = (k, v) => {
  if (typeof (v) === 'object') {
    v = JSON.stringify(v)
  }
  sessionStorage.setItem(k, v)
}

let getStorage = (item) => {
  let str = sessionStorage.getItem(item)
  return JSON.parse(str)
}
