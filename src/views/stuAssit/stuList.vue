<template>
  <div>
    <el-button @click="addFeeItem" style="margin-bottom: 20px;">新增收费项</el-button>
    <el-table :data="list" border @selection-change="selectChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="s_no" label="学号" align="center"></el-table-column>
      <el-table-column prop="s_grade" label="年级" align="center"></el-table-column>
      <el-table-column prop="s_name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="class_id" label="班级序号" align="center"></el-table-column>
      <el-table-column prop="class_name" label="班级名称" align="center"></el-table-column>
      <el-table-column prop="s_power" label="学生身份" :formatter="powerFormatter" align="center"></el-table-column>
      <el-table-column label="查询学生缴费情况" align="center">
        <template slot-scope="scope">
          <el-button @click="openStu(scope.row.s_name)">查询</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="增添收费项" :visible.sync="FeedialogFormVisible">
      <el-form :model="FeeForm" status-icon ref="FeeForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="学年" prop="year">
          <el-select v-model="FeeForm.year" placeholder="请选择对应的年份" @change="getSelectedYear">
            <el-option label="2022-2023" value="2022-2023"></el-option>
            <el-option label="2021-2022" value="2021-2022"></el-option>
            <el-option label="2020-2021" value="2020-2021"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="remark" :rules="[{required: true, message: '描述不能为空', trigger: 'blur'}]">
          <el-input type="text" v-model="FeeForm.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="fee"
                      :rules="[{required: true, message: '金额不能为0', trigger: 'blur'},]">
          <el-input type="number" v-model="FeeForm.fee" autocomplete="off">

          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('FeeForm')">提交</el-button>
          <el-button @click="resetForm('FeeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="学生缴费情况查询" :visible.sync="getStuVisible">
      <el-select placeholder="请选择查询学年" ref="mySelect" @change="changeSelect">
        <el-option label="2022-2023" value="2022-2023"></el-option>
        <el-option label="2021-2022" value="2021-2022"></el-option>
        <el-option label="2020-2021" value="2020-2021"></el-option>
        <el-option label="2019-2020" value="2019-2020"></el-option>
      </el-select>
      <el-table :data="singleList">
        <el-table-column label="姓名" prop="s_name" align="center"></el-table-column>
        <el-table-column label="学号" prop="s_no" align="center"></el-table-column>
        <el-table-column label="年级" prop="s_grade" align="center"></el-table-column>
        <el-table-column label="学年" prop="year" align="center"></el-table-column>
        <el-table-column label="班级号" prop="class_id" align="center"></el-table-column>
        <el-table-column label="班级名" prop="class_name" align="center"></el-table-column>
        <el-table-column label="缴费状态" prop="flag" align="center" :formatter="statusFormatter"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "stu_list",
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
      getStuVisible: false,
      FeeForm: {
        year: '',
        remark: '',
        fee: ''
      },
      stu_name:'',
      stu_year:'',
      singleList:{
        class_name: '',
        year: '',
        class_id:'',
        flag:'',
        s_no:'',
        s_grade:'',
        s_name:''
      }
    }
  },
  methods: {
    getData() {
      let params = '?S_no=' + localStorage.getItem('S_no')
      axios.get('/student/manager/student' + params).then((response) => {
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
      this.selectedUser = []
      val.forEach(item => {
        this.selectedUser.push(item.s_no)
      })
    },
    addFeeItem() {
      this.FeedialogFormVisible = true
    },
    getSelectedYear(val) {
      this.FeeForm.year = val
    },
    submitForm(formName) {
      if(this.selectedUser === []){
        this.$message.error('请选中需要添加收费款项的学生')
        this.FeedialogFormVisible = false
      }else{
        this.selectedUser.forEach((item)=>{
          let params = new URLSearchParams()
          params.append('S_no',item)
          params.append('year',this.FeeForm.year)
          params.append('remark',this.FeeForm.remark)
          params.append('fee',this.FeeForm.fee)
          axios.post('/student/manager/insert',params,{
            headers: {
              'Access-Control-Allow-Credentials': 'true', //解决session问题
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
            }
          })
        })
        this.$message.success('添加收费款项成功')
        this.FeedialogFormVisible = false
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    openStu(data){
      this.stu_name = data
      this.getStuVisible = true
    },
    getStu(){
      let params = new URLSearchParams()
      params.append('S_no',localStorage.getItem('S_no'))
      params.append('S_name',this.stu_name)
      params.append('year',this.stu_year)
      axios.post('/student/find/student_name',params,{
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response)=>{
          this.singleList = response.data
      })
    },
    changeSelect(val){
      this.stu_year = val
      this.getStu()
    },
    statusFormatter(row,column){
      if(row.flag === 0){
        return '已缴费'
      }else{
        return '未缴费项数:'+row.flag
      }
    }

  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>

</style>
