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
          <div v-if="scope.row.flag===0">
            <el-button @click="submitReview(scope.row)">通过审核</el-button>
            <el-button @click="submitNoReview(scope.row)">不通过审核</el-button>
          </div>
          <div v-else>{{scope.row.flag === 1? '审核通过' : '审核未通过'}}</div>
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
    },
    submitReview(data){
      let params = new URLSearchParams()
      params.append('S_no', data.s_no)
      params.append('year', data.year)
      params.append('flag', '1')
      axios.post('/teacher/jianmian/shenhe', params, {
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
    submitNoReview(data){
      let params = new URLSearchParams()
      params.append('S_no', data.s_no)
      params.append('year', data.year)
      params.append('flag', '2')
      axios.post('/teacher/jianmian/shenhe', params, {
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
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>

</style>
