<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="简易搜索">
        <el-input size="small" v-model="searchByName" placeholder="输入用户名"></el-input>
      </el-form-item>
    </el-form >
    <el-button @click="addFeeItem" style="margin-bottom: 20px;">新增退费项</el-button>
    <el-table :data="list.filter(data => !searchByName || data.s_name.toLowerCase().includes(searchByName.toLowerCase()))" border @selection-change="selectChange" :key="getRowKey">
      <el-table-column type="selection" width="50" align="center" :reserve-selection="true"></el-table-column>
      <el-table-column prop="s_no" label="学号" align="center"></el-table-column>
      <el-table-column prop="s_grade" label="年级" align="center"></el-table-column>
      <el-table-column prop="s_name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="class_id" label="班级序号" align="center"></el-table-column>
      <el-table-column prop="class_name" label="班级名称" align="center"></el-table-column>
      <el-table-column prop="s_power" label="学生身份" :formatter="powerFormatter" align="center"></el-table-column>
    </el-table>
    <el-dialog title="批量退费" :visible.sync="FeedialogFormVisible" before-destroy="destroyFee">
      <el-form :model="FeeForm" status-icon ref="FeeForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="学年" prop="year">
          <el-select v-model="FeeForm.year" placeholder="请选择对应的年份" @change="getSelectedYear">
            <el-option label="2022-2023" value="2022-2023"></el-option>
            <el-option label="2021-2022" value="2021-2022"></el-option>
            <el-option label="2020-2021" value="2020-2021"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="fee" :rules="[{required: true, message: '金额不能为0', trigger: 'blur'},]">
          <el-input type="number" v-model="FeeForm.fee" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('FeeForm')">提交</el-button>
          <el-button @click="resetForm('FeeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "addRefund",
  data() {
    return {
      list: {
        s_no: '',
        s_grade: '',
        s_name: '',
        class_id: '',
        class_name: '',
        s_power: ''
      },
      selectedUser: [],
      FeedialogFormVisible: false,
      FeeForm: {
        year: '',
        fee: ''
      },
      stu_name: '',
      stu_year: '',
      searchByName: ''
    }
  },
  methods: {
    getData() {
      let params = '?T_id=' + this.$store.getters.getUserID
      axios.get('/teacher/manager/student' + params).then((response) => {
        this.list = response.data
      })
    },
    powerFormatter(row, column) {
      if (row.s_power === 1) {
        return '辅导员助理'
      } else if (row.s_power === 0) {
        return '普通学生'
      }
    },
    selectChange(val) {
      this.selectedUser = val
    },
    addFeeItem() {
      this.FeedialogFormVisible = true
    },
    getSelectedYear(val) {
      this.FeeForm.year = val
    },
    submitForm(formName) {
      if (this.selectedUser.length === 0) {
        this.$message.error('请选中需要退费的学生')
        this.FeedialogFormVisible = false
      } else {
        this.selectedUser.forEach((item) => {
          let params = new URLSearchParams()
          params.append('S_no', item.s_no)
          params.append('year', this.FeeForm.year)
          params.append('money', this.FeeForm.fee)
          axios.post('/teacher/tuifei/insert', params, {
            headers: {
              'Access-Control-Allow-Credentials': 'true', //解决session问题
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
            }
          }).then((response)=>{
            if(response.data === 1){
              this.$message.success('新增退费成功')
            }else{
              this.$message.error('请求错误，请检查网络')
            }
          })
        })
        this.FeedialogFormVisible = false
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    changeSelect(val) {
      this.stu_year = val
      this.getStu()
    },
    destroyFee(done) {
      this.FeeForm = {
        year: '',
        remark: '',
        fee: ''
      }
      done()
    },
    getRowKey(row) {
      return row.id
    },
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>

</style>
