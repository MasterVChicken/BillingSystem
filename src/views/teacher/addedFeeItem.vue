<template>
  <div>
    <el-table :data="List" border>
      <el-table-column align="center" prop="s_no" label="学生学号"></el-table-column>
      <el-table-column align="center" prop="s_name" label="学生姓名"></el-table-column>
      <el-table-column align="center" prop="fee" label="费用金额"></el-table-column>
      <el-table-column align="center" prop="year" label="年份"></el-table-column>
      <el-table-column align="center" prop="remark" label="类型"></el-table-column>
      <el-table-column align="center" prop="flag" label="审核状态" :formatter="flagFormatter"></el-table-column>

    </el-table>

  </div>

</template>

<script>
import axios from "axios";


export default {
  name: "addedFeeItem",
  data() {
    return {
      List: [{
        s_no:'',
        s_name:'',
        year: '',
        fee: '',
        remark: '',
        flag: ''
      }]
    }
  },
  methods: {
    getData() {
      axios.get('/teacher/manager/insert_find', {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.List = response.data
      })
    },
    flagFormatter(row, column) {
      if (row.flag === 0) {
        return '未审核'
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
