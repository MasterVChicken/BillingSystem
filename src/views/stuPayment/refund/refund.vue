<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>退费基础管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table size="small" :data="refundData" highlight-current-row style="width: 100%;" border>
      <el-table-column align="center" prop="year" label="学年" width="400">
      </el-table-column>
      <el-table-column align="center" prop="money" label="退费金额" width="400">
      </el-table-column>
      <el-table-column align="center" prop="flag" label="退费状态" width="400" :formatter="flagFormatter">
      </el-table-column>
      <el-table-column align="center" label="缴费操作" width="400" prop="flag">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.flag" @click="refund(scope.row)">退费</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "refund",
  data(){
    return{
      refundData:{
        year:'',
        money:'',
        flag:''
      }
    }
  },
  methods:{
    getData(){
      let params = new URLSearchParams()
      params.append('S_no', localStorage.getItem('S_no'))
      axios.post('/student/find/tuifei', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        // 转换一下数据
        this.refundData = response.data
      })
    },
    flagFormatter(row,column){
      if(row.flag === 1){
        return "已退款至学生银行卡"
      }else if(row.flag === 0){
        return "未退款"
      }
    },
    refund(data) {
      let params = new URLSearchParams()
      params.append('S_no', localStorage.getItem('S_no'))
      params.append('money', data.money)
      params.append('year', data.year)
      axios.post(' /student/tuijiaofei/tuifei', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        if (response.data === 1) {
          this.$message.success('提交退费申请成功')
        } else if (response.data === 0) {
          this.$message.error('提交退费申请失败')
        }
      })
    },
  },
  created(){
    this.getData()
  }
}
</script>

<style scoped>

</style>
