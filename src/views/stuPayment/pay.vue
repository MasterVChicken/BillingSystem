<template>
  <div>
    <el-table border empty-text="已完成全部缴费" :data="list" @row-click="updateRowData">
      <el-table-column align="center" prop="s_no" label="学号"></el-table-column>
      <el-table-column align="center" prop="year" label="学年"></el-table-column>
      <el-table-column align="center" prop="fee" label="费用"></el-table-column>
      <el-table-column align="center" prop="remark" label="描述"></el-table-column>
      <el-table-column align="center" label="缴费操作">
        <el-button @click="payFee">缴费</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "pay",
  data() {
    return {
      list: [],
      rowData: {
        s_no: '',
        F_id: '',
        remark: '',
        money: '',
        year: ''
      }
    }
  },
  methods: {
    getData() {
      let params = new URLSearchParams()
      params.append('S_no', localStorage.getItem('S_no'))
      axios.post('/student/find/jiaofei', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.list = response.data
      })
    },
    updateRowData(row) {
      this.rowData.s_no = row.s_no
      this.rowData.year = row.year
      this.rowData.remark = row.remark
      this.rowData.money = row.fee
      if (row.remark === '学费') {
        this.rowData.F_id = '1'
      } else if (row.remark === '住宿费') {
        this.rowData.F_id = '2'
      } else {
        this.rowData.F_id = '3'
      }
    },
    payFee() {
      let params = new URLSearchParams()
      params.append('S_no', this.rowData.s_no)
      params.append('F_id', this.rowData.F_id)
      params.append('remark', this.rowData.remark)
      params.append('money', this.rowData.money)
      params.append('year', this.rowData.year)
      axios.post('/student/tuijiaofei/jiaofei', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        if(response.data === -1){
          this.$message.warning('银行卡未签订自动退扣款协议，请签订后再进行缴费')
        }else if(response.data === 1){
          this.$message.success('缴费成功')
        }else if(response.data === -0){
          this.$message.error('缴费失败')
        }
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
