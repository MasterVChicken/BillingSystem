<template>
  <div>
    <el-table :data="filteredList" border empty-text="暂无未提交待审核收费项">
      <el-table-column align="center" prop="check_id" label="ID"></el-table-column>
      <el-table-column align="center" prop="money_yingshou" label="应收金额"></el-table-column>
      <el-table-column align="center" prop="money_shishou" label="实收金额"></el-table-column>
      <el-table-column align="center" prop="date" label="日期"></el-table-column>
      <el-table-column align="center" prop="flag" label="审核状态" :formatter="itemFormatter"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "submitReview",
  data(){
    return{
      itemList: [{
        check_id: '',
        money_yingshou: '',
        money_shishou: '',
        data: '',
        flag: ''
      }],
      filteredList: []
    }
  },
  methods:{
    getData(){
      axios.get('/treasurer/check/find').then((response)=>{
        this.itemList = response.data
        console.log(this.itemList)
        this.filteredList = this.itemList.filter(item=>{
          return item.flag === 0
        })
        console.log(this.filteredList)
      })
    },
    itemFormatter(row, column) {
      if (row.flag === 0) {
        return '未审核'
      } else if (row.flag === 1) {
        return '核对人员已核对'
      } else if (row.flag === 2) {
        return '总管已审核'
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
