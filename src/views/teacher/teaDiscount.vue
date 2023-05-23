<template>
  <div>
    <el-table :data="discountList" border>
      <el-table-column align="center" prop="s_no" label="学生学号"></el-table-column>
      <el-table-column align="center" prop="s_name" label="学生姓名"></el-table-column>
      <el-table-column align="center" prop="name" label="减免项目"></el-table-column>
      <el-table-column align="center" prop="fee" label="费用金额"></el-table-column>
      <el-table-column align="center" prop="year" label="年份"></el-table-column>
      <el-table-column align="center" prop="flag" label="审核状态" :formatter="flagFormatter">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.flag">审核</el-button>
          <text v-else>{{scope.row.flag}}</text>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>
import axios from "axios";


export default {
  name: "teaDiscount",
  data() {
    return {
      discountList: []
    }
  },
  methods: {

    getData() {
      axios.get('/teacher/jianmian/find', {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.discountList = response.data
        console.log(this.discountList)
      })
    },
    flagFormatter(row, column) {
      if (row.flag === 0) {
        return '学生已提交'
      } else if (row.flag === 1) {
        return '审核通过'
      } else{
        return '审核不通过'
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
