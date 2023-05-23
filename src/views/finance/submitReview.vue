<template>
  <div>
    <el-table :data="itemList" border empty-text="暂无未提交待审核收费项">
      <el-table-column align="center" prop="date" label="日期"></el-table-column>
      <el-table-column align="center" prop="money" label="金额"></el-table-column>
      <el-table-column align="center" label="审核操作">
        <template slot-scope="scope">
          <el-button @click="submitReview(scope.row)">提交审核</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import axios from "axios";
import ReceiptInquiry from "../stuPayment/receiptInquiry.vue";
import PersonalReceipt from "../../components/personalReceipt.vue";
export default {
  name: "submitReview",
  data(){
    return{
      itemList: [],
    }
  },
  methods:{
    getData(){
      axios.get('/treasurer/check/data').then((response)=>{
        this.itemList = response.data
      })
    },
    submitReview(data){
      let params = new URLSearchParams()
      params.append('Tr_id', localStorage.getItem('user_id'))
      params.append('money',data.money)
      axios.post('/treasurer/check/tijiao', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        if(response.data === 1){
          this.$message.success('提交审核成功')
        }else if (response.data === 0 ){
          this.$message.error('提交审核失败')
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
