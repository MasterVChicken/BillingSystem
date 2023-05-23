<template>
  <div class="load_wapper">
    <div class="title">学生收费系统</div>
    <el-form class="form_wapper" size="mini" :model="UserForm" :rules="rules">
      <el-form-item label="统一认证码:" prop="user">
        <el-input v-model="UserForm.user"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-model="UserForm.password" type="password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item align="center">
        <el-button @click="login" type="primary" plain> 登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      UserForm: {
        user: '',
        password: ''
      },
      rules: {
        user: [
          { required: true, message: '统一认证码不能为空' },
        ],
        password: [
          { required: true, message: '密码不能为空' },
        ]
      }
    }
  },
  methods: {
    login() {
      let params = new URLSearchParams()
      params.append('user_id', this.UserForm.user)
      params.append('user_pwd', this.UserForm.password)
      axios.post('/login', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        if (Object.keys(response.data).length == 0) {
          this.$message({
            type: 'warning',
            message: '请检查账号或者密码是否正确'
          })
        } else {
          this.$message({
            type: 'success',
            message: '登陆成功'
          })
          this.$store.dispatch('login', response.data)
          localStorage.setItem('userRole', this.$store.getters.getUserRole)
          localStorage.setItem('user_id', this.$store.getters.getUserID)
          if (localStorage.getItem('userRole') === 'teacher') {
            this.$router.push({
              path: '/dashboard/teacher'
            })
          } else if (localStorage.getItem('userRole') === 'admin') {
            this.$router.push({
              path: '/dashboard/admin'
            })
          } else if (localStorage.getItem('userRole') === 'finance' || localStorage.getItem('userRole') === 'checkee' || localStorage.getItem('userRole') === 'manager') {
            this.$router.push({
              path: '/dashboard/finance'
            })
          } else if (localStorage.getItem('userRole') === 'stu' || localStorage.getItem('userRole') === 'stu_assit') {
            this.$router.push({
              path: '/dashboard/stu'
            })
          }
        }
      })
    }
  },
  mounted() {

  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.load_wapper {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(48, 65, 86);
}

.form_wapper {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20%;
  transform: translate(-50%, -50%);
  background-color: #1f2d3d !important;
  padding: 10px 30px;
  border-radius: 10px;
  border: 1px solid #fff;
  color: #fff;
  font-size: 14px;
}

.title {
  position: absolute;
  left: 40%;
  top: 32%;
  width: 20%;
  color: whitesmoke;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px
}

</style>
