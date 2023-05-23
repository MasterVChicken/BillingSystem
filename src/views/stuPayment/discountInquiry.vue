<template>
  <div>
    <el-table :data="discountList" border>
      <el-table-column align="center" prop="s_no" label="学生学号"></el-table-column>
      <el-table-column align="center" prop="s_name" label="学生姓名"></el-table-column>
      <el-table-column align="center" prop="name" label="减免项目"></el-table-column>
      <el-table-column align="center" prop="fee" label="费用金额"></el-table-column>
      <el-table-column align="center" prop="year" label="年份"></el-table-column>
      <el-table-column align="center" prop="flag" label="审核状态" :formatter="flagFormatter"></el-table-column>

    </el-table>

  </div>

</template>

<script>
import axios from "axios";


export default {
  name: "discountInquiry",
  data() {
    return {
      discountList: [{
        s_no:'',
        s_name:'',
        name:'',
        year: '',
        fee: '',
        flag: ''
      }]
    }
  },
  methods: {

    getData() {
      let params = new URLSearchParams()
      params.append('S_no', localStorage.getItem('S_no'))
      axios.post('/student/jianmain/find', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.discountList = response.data
      })
    },
    flagFormatter(row, column) {
      if (row.flag === 0) {
        return '审核中'
      } else if (row.flag === 1) {
        return '审核通过'
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
