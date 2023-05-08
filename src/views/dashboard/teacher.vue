<template>
  <div>
    <el-descriptions title="用户信息">
      <el-descriptions-item label="用户名">{{this.userInfo.t_name}}</el-descriptions-item>
      <el-descriptions-item label="统一认证码">{{this.userInfo.t_id}}</el-descriptions-item>
      <el-descriptions-item label="学院">{{this.userInfo.t_academyid}}</el-descriptions-item>
      <el-descriptions-item label="年级">{{this.userInfo.t_grade}}</el-descriptions-item>
      <el-descriptions-item label="权限">{{this.teacherPower}}</el-descriptions-item>
      <el-descriptions-item label="职位">{{this.userInfo.t_pos}}</el-descriptions-item>
      <el-descriptions-item label="所属单位">重庆邮电大学</el-descriptions-item>
    </el-descriptions>
    <el-button @click="PWDdialogFormVisible = true">修改密码</el-button>
    <el-dialog title="教师密码修改" :visible.sync="PWDdialogFormVisible">
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
  name: "teacher",
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
        t_power: '',
        t_dept: '',
        t_id: '',
        t_grade: '',
        t_pos: '',
        t_academyid: '',
        t_name: ''
      },
      teacherPower: ''
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams()
          params.append('T_id', this.$store.getters.getUserID)
          params.append('T_pwd', this.ruleForm.pass)
          console.log(params)
          axios.post('/teacher/update/pwd', params, {
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
        this.userInfo.t_dept = response.data.t_dept
        this.userInfo.t_id = response.data.t_id
        this.userInfo.t_grade = response.data.t_grade
        this.userInfo.t_pos = response.data.t_pos
        this.userInfo.t_academyid = response.data.t_academyid
        this.userInfo.t_name = response.data.t_name
        this.userInfo.t_power = response.data.t_power
        this.teacherPower = this.getTeacherPower()
        localStorage.setItem('T_grade',response.data.t_grade)
        localStorage.setItem('T_academyid',response.data.t_academyid)
      })
    },
    getTeacherPower(){
      if(this.userInfo.t_power === 0){
        return '辅导员'
      }else if(this.userInfo.t_power === 1){
        return '年级负责人'
      }else if(this.userInfo.t_power === 2){
        return '学院负责人'
      }
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style scoped>

</style>
