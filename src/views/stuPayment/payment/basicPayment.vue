<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>缴费基础管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table size="small" :data="basicData" style="width: 100%;" border :span-method="basicSpan" :summary-method="getSummaries" show-summary>
      <el-table-column align="center" prop="year" label="学年" >
      </el-table-column>
      <el-table-column align="center" prop="type" label="类型" >
      </el-table-column>
      <el-table-column align="center" prop="money" label="金额" >
      </el-table-column>
      <el-table-column align="center" prop="flag" label="是否缴纳"  :formatter="flagFormatter">
      </el-table-column>
      <el-table-column align="center" label="年度合计" prop="sum">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "basicPayment",
  data() {
    return {
      // searchByName: '',
      basicData: [],
    }
  },
  methods: {

    getBasicData() {
      let params = new URLSearchParams()
      params.append('S_no', localStorage.getItem('S_no'))
      axios.post('/student/find/feiyong', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        // 转换一下数据
        for (let i = 0; i < response.data.length; i++) {
          this.basicData.push({
            'year': response.data[i].year,
            'type': '学费',
            'money': response.data[i].xuefei,
            'flag': response.data[i].xuefeiflag,
            'sum': response.data[i].sum
          })
          this.basicData.push({
            'year': response.data[i].year,
            'type': '住宿费',
            'money': response.data[i].zhusufei,
            'flag': response.data[i].zhusufeiflag,
            'sum': response.data[i].sum
          })
          this.basicData.push({
            'year': response.data[i].year,
            'type': '其他费用',
            'money': response.data[i].qitatotal,
            'flag': response.data[i].qitaflag,
            'sum': response.data[i].sum
          })
        }
      })
    },
    flagFormatter(row, column) {
      if (row.flag === 0) {
        return '已缴纳'
      } else if (row.flag === 1) {
        return '未缴纳'
      }
    },
    basicSpan({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else if (rowIndex % 3 === 1 || rowIndex % 3 === 2) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex === 4) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else if (rowIndex % 3 === 1 || rowIndex % 3 === 2) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    getSummaries(param) {
      const {columns, data} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 1) {
          sums[index] = '应缴';
          return;
        }
        if (index === 3) {
          sums[index] = '未缴';
          return;
        }
        if(index === 2){
          sums[2] = 0
          for(let i = 0;i<param.data.length;i++){
            sums[2] += Number(param.data[i].money)
          }
          sums[2] += '元'
        }
        if(index === 4){
          sums[4] = 0
          for(let i = 0;i<param.data.length;i++){
            if(param.data[i].flag === 1){
              sums[4] += param.data[i].money
            }
          }
          sums[4] += '元'
        }
      });
      return sums;
    },
  },
  created() {
    this.getBasicData()
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
