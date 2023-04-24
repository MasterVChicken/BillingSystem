<template>
  <div>

    <el-table :data="list" border>
      <el-table-column label="班级号" prop="class_id" align="center"></el-table-column>
      <el-table-column label="查询班级缴费情况" align="center">
        <template slot-scope="scope">
          <el-button @click="openClass(scope.row.class_id)">查询</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="班级缴费情况查询" :visible.sync="classVisible">
      <el-select placeholder="请选择查询学年" ref="mySelect" @change="changeSelect" v-model="value">
        <el-option label="2022-2023" value="2022-2023"></el-option>
        <el-option label="2021-2022" value="2021-2022"></el-option>
        <el-option label="2020-2021" value="2020-2021"></el-option>
        <el-option label="2019-2020" value="2019-2020"></el-option>
      </el-select>
      <el-table :data="classList">
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
  name: "classList",
  data() {
    return {
      list: [],
      classVisible: false,
      classYear:'',
      classList:{
        class_name:'',
        year:'',
        class_id:'',
        flag:'',
        s_no:'',
        s_name:'',
        s_grade:''
      },
      class:''
    }
  },
  methods: {
    getData() {
      let params = '?S_no=' + localStorage.getItem('S_no')
      axios.get('/student/find/class' + params).then((response) => {
        for(let i = 0;i<response.data.length;i++){
          this.list.push({
            'class_id': response.data[i]
          })
        }
        console.log(this.list)
      })
    },
    openClass(data){
      this.classVisible = true
      this.class = data
    },
    changeSelect(val) {
      this.classYear = val
      this.getClass()
    },
    statusFormatter(row, column) {
      if(row.flag === 0){
        return '已缴费'
      }else{
        return '未缴费项数:'+ row.flag
      }
    },
    getClass(){
      let params = new URLSearchParams()
      params.append('class_id',this.class)
      params.append('year',this.classYear)
      axios.post('/student/find/student_list',params,{
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response)=>{
        this.classList = response.data
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>

</style>
