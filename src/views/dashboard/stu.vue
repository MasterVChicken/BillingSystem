<template>
  <div style="display: flex; align-items: center; flex-direction: column">
    <el-descriptions title="用户信息">
      <el-descriptions-item label="用户名">{{this.userInfo.s_name}}</el-descriptions-item>
      <el-descriptions-item label="统一认证码">{{this.$store.getters.getUserID}}</el-descriptions-item>
      <el-descriptions-item label="所属单位">重庆邮电大学</el-descriptions-item>
      <el-descriptions-item label="年级">{{this.userInfo.s_grade}}</el-descriptions-item>
      <el-descriptions-item label="班级">{{this.userInfo.class_id}}</el-descriptions-item>
      <el-descriptions-item label="年龄">{{this.userInfo.s_age}}</el-descriptions-item>
      <el-descriptions-item label="性别">{{this.userInfo.s_sex}}</el-descriptions-item>
      <el-descriptions-item label="身份">{{ this.userInfo.s_power===0?'普通学生':'辅导员助理' }}</el-descriptions-item>
    </el-descriptions>
    <el-button @click="PWDdialogFormVisible = true">修改密码</el-button>
    <el-dialog title="学生密码修改" :visible.sync="PWDdialogFormVisible">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPWDForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-button @click="BankIDdialogFormVisible = true">修改银行卡号</el-button>
    <el-dialog title="学生银行卡号修改" :visible.sync="BankIDdialogFormVisible">
      <el-form :model="BankForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="银行卡号" prop="pass">
          <el-input type="text" v-model="BankForm.bank" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitBankForm()">提交</el-button>
          <el-button @click="resetForm('BankForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-button type="text" @click="openConfirm">签订银行卡自动扣款协议</el-button>
    <el-button type="text" @click="openCancel">取消签订银行卡自动扣款协议</el-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "stu",
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
      BankIDdialogFormVisible: false,
      autoFlag: false,
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      BankForm:{
        bank: ''
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
        s_no: '',
        s_pwd:'',
        class_id:'',
        academy_id:'',
        s_grade:'',
        s_name:'',
        s_power:'',
        s_age:'',
        s_sex:''
      },
      classList:[]
    }
  },
  methods: {
    submitPWDForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams()
          params.append('S_no', this.userInfo.s_no)
          params.append('S_pwd', this.ruleForm.pass)
          console.log(params)
          axios.post('/student/update/pwd', params, {
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
    submitBankForm() {
      if(this.BankForm.bank === ''){
        this.$message.error('请输入银行卡号')
        this.BankIDdialogFormVisible = false
      }else{
        let params = new URLSearchParams()
        params.append('S_no',this.userInfo.s_no)
        params.append('Card_no',this.BankForm.bank)
        axios.post('/student/update/bank_card',params,{
          headers: {
            'Access-Control-Allow-Credentials': 'true', //解决session问题
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
          }
        }).then((response)=>{
          if(response.data === 0){
            this.$message.error('修改银行卡号失败')
          }else if(response.data === 1){
            this.$message.success('修改银行卡号成功')
          }else if(response.data === -1){
            this.$message.error('请检查卡号是否正确')
          }
          this.BankIDdialogFormVisible = false
          this.BankForm.bank = ''
        })
      }
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
        this.userInfo.s_no = response.data.s_no
        this.userInfo.s_pwd = response.data.s_pwd
        this.userInfo.class_id = response.data.class_id
        this.userInfo.academy_id = response.data.academy_id
        this.userInfo.s_grade = response.data.s_grade
        this.userInfo.s_name = response.data.s_name
        this.userInfo.s_power = response.data.s_power
        this.userInfo.s_age = response.data.s_age
        this.userInfo.s_sex = response.data.s_sex
        localStorage.setItem('S_no',response.data.s_no)
        localStorage.setItem('S_name',response.data.s_name)
      })
      if(this.$store.getters.getUserRole === 'stu_assit'){
        let params = '?S_no=' + localStorage.getItem('S_no')
        axios.get('/student/find/class'+params).then((response)=>{
          response.data.forEach((item)=>{this.classList.push({
            'class_id':item
          })})
        })
      }
    },
    changeBindStatus(){
      console.log(this.autoFlag)
    },
    openConfirm(){
      this.$confirm('此操作将签订银行卡自动扣款协议, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams()
        params.append('S_no',localStorage.getItem('S_no'))
        params.append('flag',1)
        axios.post('/student/update/bank_xieyi',params,{
          headers: {
            'Access-Control-Allow-Credentials': 'true', //解决session问题
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
          }
        }).then((response)=>{
          if(response.data === 1){
            this.$message({
              type: 'success',
              message: '签订成功!'
            });
          }else{
            this.$message({
              type: 'error',
              message: '签订操作失败!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    openCancel(){
      this.$confirm('此操作将取消签订银行卡自动扣款协议, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams()
        params.append('S_no',localStorage.getItem('S_no'))
        params.append('flag',0)
        axios.post('/student/update/bank_xieyi',params,{
          headers: {
            'Access-Control-Allow-Credentials': 'true', //解决session问题
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
          }
        }).then((response)=>{
          if(response.data === 1){
            this.$message({
              type: 'success',
              message: '取消签订成功!'
            });
          }else{
            this.$message({
              type: 'error',
              message: '取消签订操作失败!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style scoped>

</style>
