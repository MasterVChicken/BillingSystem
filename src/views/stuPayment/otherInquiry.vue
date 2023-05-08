<template>
  <el-table :data="otherList" border>
    <el-table-column align="center" prop="year" label="年份"></el-table-column>
    <el-table-column align="center" prop="remark" label="费用类型"></el-table-column>
    <el-table-column align="center" prop="fee" label="贷款金额"></el-table-column>
    <el-table-column align="center" prop="flag" label="是否已偿还" :formatter="flagFormatter"></el-table-column>
  </el-table>
</template>

<script>
import axios from "axios";

export default {
  name: "otherInquiry",
  data() {
    return {
      otherList: [{
        year: '',
        remark: '',
        fee: '',
        flag: ''
      }]
    }
  },
  methods: {
    getData() {
      let params = new URLSearchParams()
      params.append('S_no', localStorage.getItem('S_no'))
      axios.post('/student/find/qita', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.otherList = response.data
      })
    },
    flagFormatter(row, column) {
      if (row.flag === 0) {
        return '已缴费'
      } else if (row.flag === 1) {
        return '未缴费'
      }
    },
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>

</style>
