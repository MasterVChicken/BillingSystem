import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //数据，相当于data
  state: {
    user_id: '',
    user_pwd: '',
    role: ''
  },
  getters: {},
  //里面定义方法，操作state方发
  mutations: {
    SET_USER_ID: (state, user_id) => {
      state.user_id = user_id
    },
    SET_USER_PWD: (state, user_pwd) => {
      state.user_pwd = user_pwd
    },
    SET_ROLE: (state, user_id_class) => {
      if(user_id_class === 0){
        // user_id_class为0表示管理员
        state.role = 'admin'
      }else if(user_id_class === 1){
        // user_id_class为1表示学生
        state.role = 'stu'
      }else if(user_id_class === 2){
        // user_id_class为2表示教师
        state.role = 'teacher'
      }else if(user_id_class === 3){
        // user_id_class为3表示财务人员
        state.role = 'finance'
      }else if(user_id_class === 4){
        // user_id_class为4表示辅导员助理
        state.role = 'stu_assit'
      }
    }
  },
  // 操作异步操作mutation
  actions: {
    login({commit},data){

    }
  },
  modules: {


  },
})
