<template>
  <el-table :data="otherList" border>
    <el-table-column align="center" prop="year" label="年份"></el-table-column>
    <el-table-column align="center" prop="remark" label="费用类型"></el-table-column>
    <el-table-column align="center" prop="fee" label="贷款金额"></el-table-column>
    <el-table-column align="center" prop="flag" label="是否已偿还" :formatter="flagFormatter"></el-table-column>
    <el-table-column align="center" label="缴费操作" width="200" prop="flag">
      <template slot-scope="scope">
        <el-button :disabled="(!scope.row.flag)" @click="pay(scope.row)">缴费操作</el-button>
      </template>
    </el-table-column>
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
    pay(data) {
      let params = new URLSearchParams()
      params.append('S_no', localStorage.getItem('S_no'))
      params.append('F_id', '3')
      params.append('money', data.fee)
      params.append('remark', data.remark)
      params.append('year', data.year)
      // axios.post('/student/tuijiaofei/jiaofei', params, {
      //   headers: {
      //     'Access-Control-Allow-Credentials': 'true', //解决session问题
      //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
      //   }
      // }).then((response) => {
      //   if (response.data === 1) {
      //     this.$message.success('缴费成功')
      //   } else if (response.data === 0) {
      //     this.$message.error('缴费失败')
      //   } else if (response.data === -1) {
      //     this.$message.error('未开通自动扣款协议或银行卡余额不足')
      //   }
      // })
      console.log(localStorage.getItem('S_no'))
      console.log(data.fee)
      console.log(data.remark)
      console.log(data.year)
    },
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>

</style>
