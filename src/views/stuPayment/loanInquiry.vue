<template>
  <div>
    <el-table :data="loanList" border>
      <el-table-column align="center" prop="year" label="年份"></el-table-column>
      <el-table-column align="center" prop="money" label="贷款金额"></el-table-column>
      <el-table-column align="center" prop="flag" label="是否已偿还" :formatter="flagFormatter"></el-table-column>

    </el-table>

  </div>

</template>

<script>
import axios from "axios";


export default {
  name: "loanInquiry",
  data() {
    return {
      loanList: [{
        year: '',
        money: '',
        flag: ''
      }]
    }
  },
  methods: {

    getData() {
      let params = new URLSearchParams()
      params.append('S_no', localStorage.getItem('S_no'))
      axios.post('/student/find/daikuan', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.loanList = response.data
      })
    },
    flagFormatter(row, column) {
      if (row.flag === 0) {
        return '未偿还'
      } else if (row.flag === 1) {
        return '已偿还'
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
