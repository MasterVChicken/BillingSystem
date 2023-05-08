<template>
  <div>
    <el-descriptions title="用户信息">
      <el-descriptions-item label="用户名">{{this.userInfo.tr_name}}</el-descriptions-item>
      <el-descriptions-item label="统一认证码">{{this.userInfo.tr_id}}</el-descriptions-item>
      <el-descriptions-item label="所属单位">重庆邮电大学</el-descriptions-item>
      <el-descriptions-item label="职位">{{this.userInfo.tr_pos}}</el-descriptions-item>
      <el-descriptions-item label="权限等级">{{this.power}}</el-descriptions-item>
    </el-descriptions>
    <el-button @click="PWDdialogFormVisible = true">修改密码</el-button>
    <el-dialog title="管理员密码修改" :visible.sync="PWDdialogFormVisible">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "finance",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      PWDdialogFormVisible: false,
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'},
          {min: 6, max: 18, message: '用户密码长度必须介于 6 和 18 之间', trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'},
          {min: 6, max: 18, message: '用户密码长度必须介于 6 和 18 之间', trigger: 'blur'}
        ]
      },
      userInfo:{
        tr_power: '',
        tr_id: '',
        tr_name: '',
        tr_pos: ''
      },
      power: ''
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams()
          params.append('Tr_id', this.$store.getters.getUserID)
          params.append('Tr_pwd', this.ruleForm.pass)
          console.log(params)
          axios.post('/treasurer/update/pwd', params, {
            headers: {
              'Access-Control-Allow-Credentials': 'true', //解决session问题
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
            }
          }).then((response) => {
            if (response.data === 1) {
              this.$message({
                type: "success",
                message: "密码修改成功",
                duration: 2000
              })
            } else {
              this.$message({
                type: "error",
                message: "密码修改失败失败",
                duration: 2000
              })
            }
            this.ruleForm.pass = ''
            this.ruleForm.checkPass = ''
          })
          this.PWDdialogFormVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '错误的提交',
            duration: 2000
          })
          this.dialogFormVisible = false
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getUserInfo(){
      let params = new URLSearchParams()
      params.append('user_id',this.$store.getters.getUserID)
      params.append('user_pwd',this.$store.getters.getUserPWD)
      axios.post('/login/user',params,{
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response)=>{
        this.userInfo.tr_power = response.data.tr_power
        this.userInfo.tr_name = response.data.tr_name
        this.userInfo.tr_pos = response.data.tr_pos
        this.userInfo.tr_id = response.data.tr_id
        if(this.userInfo.tr_power !== 0){
          this.$store.commit('RESET_ROLE',this.userInfo.tr_power)
        }
        localStorage.setItem('userRole', this.$store.getters.getUserRole)
        this.getPower()
      })
      console.log(this.$store.getters.getUserRole)
      console.log(localStorage.getItem('userRole'))
      setStorage('Tr_power',this.userInfo.tr_power)
    },
    getPower(){
      if(this.userInfo.tr_power === 0){
        this.power =  '会计'
      }else if(this.userInfo.tr_power === 1){
        this.power = '审核人员'
      }else if(this.userInfo.tr_power === 2){
        this.power = '总管'
      }
    }
  },
  created() {
    this.getUserInfo()
  }
}

const setStorage = (k, v) => {
  if (typeof (v) === 'object') {
    v = JSON.stringify(v)
  }
  sessionStorage.setItem(k, v)
}

</script>

<style scoped>

</style>
