<template>
  <div>
    <el-table :data="receiptList" border>
      <el-table-column align="center" prop="shouju_id" label="收据ID"></el-table-column>
      <el-table-column align="center" prop="jiaofeixiang" label="缴费项"></el-table-column>
      <el-table-column align="center" prop="money" label="金额"></el-table-column>
      <el-table-column align="center" prop="date" label="时间"></el-table-column>
      <el-table-column align="center" prop="year" label="年份"></el-table-column>
      <el-table-column align="center" prop="flag" label="缴费方式" :formatter="flagFormatter"></el-table-column>
      <el-table-column align="center" label="报表">
        <template slot-scope="scope">
          <el-button @click="generateReceipt(scope.row)">生成电子收据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible">
      <personal-receipt :msg="propData" :s_name="s_name"></personal-receipt>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import PersonalReceipt from "../../components/personalReceipt.vue";

export default {
  name: "receiptInquiry",
  components: {PersonalReceipt},
  data() {
    return {
      receiptList: [{
        year: '',
        date: '',
        jiaofeixiang: '',
        money: '',
        flag: '',
        s_no: '',
        shouju_id: ''
      }],
      dialogVisible: false,
      propData:{},
      s_name:''
    }
  },
  methods: {
    getData() {
      let params = new URLSearchParams()
      params.append('S_no', localStorage.getItem('S_no'))
      axios.post('/student/find/shouju', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.receiptList = response.data
      })
    },
    flagFormatter(row, column) {
      if (row.flag === 1) {
        return '自主系统缴费'
      } else if (row.flag === 2) {
        return '通过财务处缴费'
      }
    },
    generateReceipt(data){
      this.propData = data
      this.s_name = localStorage.getItem('S_name')
      this.dialogVisible = true
    },
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>

</style>
