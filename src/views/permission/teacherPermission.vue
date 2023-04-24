<template>
  <div>
    <!--面包屑的简易导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教师权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="user-search">
      <el-form-item label="简易搜索">
        <el-input size="small" v-model="searchByName" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-button type="primary" @click="openConfirm">重置密码</el-button>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange"
              :data="userData.filter(data => !searchByName || data.t_name.includes(searchByName))"
              highlight-current-row @row-click="updateRowData"
              v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="t_id" label="ID" width="200">
      </el-table-column>
      <el-table-column align="center" sortable prop="t_name" label="姓名" width="200">
      </el-table-column>
      <el-table-column align="center" sortable prop="t_pos" label="职位" width="200">
      </el-table-column>
      <el-table-column align="center" sortable prop="t_grade" label="年级" width="200">
      </el-table-column>
      <el-table-column align="center" sortable prop="dept" label="所属部门" width="200">
      </el-table-column>
      <el-table-column align="center" sortable prop="academy" label="所属学院" width="200">
      </el-table-column>
      <el-table-column align="center" label="修改操作" min-width="200">
        <el-button @click="dialogFormVisible = true">修改权限</el-button>
        <el-button @click="PWDdialogFormVisible = true">修改密码</el-button>
      </el-table-column>
    </el-table>
    <el-dialog title="教师权限管理" :visible.sync="dialogFormVisible">
      <el-form :model="PowerForm">
        <el-form-item label="权限等级" label-width="120px">
          <el-select v-model="PowerForm.power" placeholder="请选择对应的权限等级" @change="getSelectedPower">
            <el-option label="管理员" value="0"></el-option>
            <!--            <el-option label="学生" value="1"></el-option>-->
            <el-option label="辅导员" value="2"></el-option>
            <el-option label="金融人员" value="3"></el-option>
            <!--            <el-option label="辅导员助理" value="4"></el-option>-->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changUserPower">确 定</el-button>
      </div>
    </el-dialog>
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
      // 显示是否正在加载
      loading: false,
      //用户数据
      userData: [],
      selectedUser: [],
      searchByName: '',
      dialogFormVisible: false,
      PWDdialogFormVisible: false,
      rowData: {
        t_name: '',
        t_id: '',
        t_power: ''
      },
      PowerForm: {
        power: ''
      },
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
      }
    }
  },
  methods: {
    getdata() {
      this.loading = true
      axios.get('/admin').then((response) => {
        if (response) {
          this.loading = false
          this.userData = response.data
        }
      })
    },
    selectChange(val) {
      this.selectedUser = []
      val.forEach(item => {
        this.selectedUser.push(item.t_id)
      })
    },
    resetPWD(list) {
      list.forEach(pwd => {
        let params = new URLSearchParams()
        params.append('T_id', pwd)
        axios.post('/admin/reset', params, {
          headers: {
            'Access-Control-Allow-Credentials': 'true', //解决session问题
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
          }
        }).then((response) => {
          if (response.data === 0) {
            this.$message({
              type: 'warning',
              message: '重置出现错误',
              duration: 2000
            })
          }
        })
      })
    },
    // 点击弹出重置密码确认提示
    openConfirm() {
      if (this.selectedUser.length !== 0) {
        this.$confirm('此操作将永久重置选中人员密码（默认重置为123456）, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.resetPWD(this.selectedUser)
          this.$message({
            type: 'success',
            message: '重置成功!',
            duration: 2000
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置',
            duration: 2000
          })
        });
      } else {
        this.$message({
          type: 'warning',
          message: '还没有选中人员哦',
          duration: 2000
        })
      }
    },
    updateRowData(row) {
      this.rowData.t_id = row.t_id
      this.rowData.t_name = row.t_name
      this.rowData.t_power = row.t_power
      console.log(this.rowData)
    },
    getSelectedPower(val) {
      this.PowerForm.power = val
    },
    changUserPower() {
      if (this.rowData.t_power === this.PowerForm.power) {
        this.$message({
          type: "error",
          message: "权限与之前的相同，未进行更改",
          duration: 2000
        })
      } else {
        let params = new URLSearchParams()
        params.append('T_id', this.rowData.t_id)
        params.append('T_power', this.PowerForm.power)
        axios.post('/admin/update', params, {
          headers: {
            'Access-Control-Allow-Credentials': 'true', //解决session问题
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
          }
        }).then((response) => {
          if (response.data === 1) {
            this.$message({
              type: "success",
              message: "权限修改成功",
              duration: 2000
            })
          } else {
            this.$message({
              type: "error",
              message: "权限失败",
              duration: 2000
            })
          }
        })
      }
      this.dialogFormVisible = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams()
          params.append('T_id', this.rowData.t_id)
          params.append('T_pwd', this.ruleForm.pass)
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
          })
          this.PWDdialogFormVisible = false
        } else {
          this.$message({
            type:'error',
            message:'错误的提交',
            duration: 2000
          })
          this.dialogFormVisible = false
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
  ,
  created() {
    this.getdata()
  }
}
</script>

<style scoped>

</style>
