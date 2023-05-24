<template>
  <div>
    <el-table :data="List" border>
      <el-table-column align="center" prop="s_no" label="学生学号"></el-table-column>
      <el-table-column align="center" prop="s_name" label="学生姓名"></el-table-column>
      <el-table-column align="center" prop="remark" label="新增费用备注"></el-table-column>
      <el-table-column align="center" prop="fee" label="费用金额"></el-table-column>
      <el-table-column align="center" prop="year" label="年份"></el-table-column>
      <el-table-column align="center" prop="flag" label="审核状态">
        <template slot-scope="scope">
          <div v-if="scope.row.flag===0">
            <el-button @click="submitReview(scope.row)">通过审核</el-button>
          </div>
          <div v-else>审核通过</div>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>
import axios from "axios";


export default {
  name: "financeFee",
  data() {
    return {
      List: []
    }
  },
  methods: {

    getData() {
      axios.get('/treasurer/qita/find', {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.List = response.data
      })
    },
    submitReview(data){
      let params = new URLSearchParams()
      params.append('S_no', data.s_no)
      params.append('fee', data.fee)
      params.append('year', data.year)
      params.append('remark', data.remark)

      axios.post('/treasurer/qita/shenh', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        if(response.data === 1){
          this.$message.success('提交审核成功')
        }else{
          this.$message.error('提交失败，请检查网络')
        }
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
