<template>
  <div>
    <el-button @click="submitReview">批量提交审核</el-button>
    <el-table :data="filteredList" border empty-text="暂无未提交待审核收费项" @selection-change="selectChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column align="center" prop="check_id" label="ID"></el-table-column>
      <el-table-column align="center" prop="money_yingshou" label="应收金额"></el-table-column>
      <el-table-column align="center" prop="date" label="日期"></el-table-column>
    </el-table>

  </div>
</template>

<script>
import axios from "axios";
import ReceiptInquiry from "../stuPayment/receiptInquiry.vue";
import PersonalReceipt from "../../components/personalReceipt.vue";
export default {
  name: "submitReview",
  components: {PersonalReceipt, ReceiptInquiry},
  data(){
    return{
      itemList: [{
        check_id: '',
        money_yingshou: '',
        money_shishou: '',
        data: '',
        flag: ''
      }],
      filteredList: [],
      selectedItem: []
    }
  },
  methods:{
    getData(){
      axios.get('/treasurer/check/find').then((response)=>{
        this.itemList = response.data
        this.filteredList = this.itemList.filter(item=>{
          return item.flag === 0
        })
      })
    },
    submitReview(){
      if (this.selectedItem == []) {
        this.$message.error('请选中需要提交审核项')
      } else{
        this.selectedItem.forEach((item)=>{
          let params = new URLSearchParams()
          params.append('Tr_id', localStorage.getItem('user_id'))
          params.append('money', item)
          axios.post('/treasurer/check/tijiao', params, {
            headers: {
              'Access-Control-Allow-Credentials': 'true', //解决session问题
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
            }
          }).then((response)=>{
            if(response.data === 0){
              this.$message.error('提交失败')
            }else if(response.data === 1){
              this.$message.success('提交成功')
            }
          })
        })
      }
    },
    selectChange(val) {
      this.selectedItem = []
      val.forEach(item => {
        this.selectedItem.push(item.money_yingshou)
      })
    },
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>

</style>
