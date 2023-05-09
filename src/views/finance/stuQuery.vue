<template>
  <div>
    <div style="margin-bottom: 1%">
      <el-input placeholder="姓名长度2-8" v-model="name" type="text" maxlength="8" style="width: 50%"></el-input>
    </div>
    <el-select ref="mySelect" @change="getValue" v-model="year">
      <el-option value="2022-2023">2022-2023</el-option>
      <el-option value="2021-2022">2021-2022</el-option>
      <el-option value="2020-2021">2020-2021</el-option>
      <el-option value="2019-2020">2019-2020</el-option>
    </el-select>
    <el-button @click="search">查询</el-button>
    <div style="margin-bottom: 20px;margin-top: 20px; align-items: center; width: 100%">年度总体费用</div>
    <el-table size="small" :data="basicData" highlight-current-row style="width: 100%;" border :span-method="basicSpan" :summary-method="getSummaries" show-summary>
      <el-table-column align="center" prop="year" label="学年">
      </el-table-column>
      <el-table-column align="center" prop="type" label="类型">
      </el-table-column>
      <el-table-column align="center" prop="money" label="金额">
      </el-table-column>
      <el-table-column align="center" prop="flag" label="是否缴纳" :formatter="flagFormatter">
      </el-table-column>
    </el-table>
    <div style="margin-bottom: 20px;margin-top: 20px; align-items: center; width: 100%">年度其他费用</div>
    <el-table :data="otherList" border>
      <el-table-column align="center" prop="s_no" label="学生学号"></el-table-column>
      <el-table-column align="center" prop="s_name" label="学生姓名"></el-table-column>
      <el-table-column align="center" prop="year" label="年份"></el-table-column>
      <el-table-column align="center" prop="remark" label="费用类型"></el-table-column>
      <el-table-column align="center" prop="fee" label="贷款金额"></el-table-column>
      <el-table-column align="center" prop="flag" label="是否已偿还" :formatter="flagFormatter"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "stuQuery",
  data() {
    return {
      name: '',
      year: '',
      basicData: [],
      otherList: [{
        s_name: '',
        s_no: '',
        year: '',
        remark: '',
        fee: '',
        flag: ''
      }]
    }
  },
  methods: {
    getValue(val) {
      this.year = val
    },
    queryAllByYear(){
      let params = new URLSearchParams()
      params.append('S_name',this.name)
      params.append('year',this.year)

      axios.post('/treasurer/jiaofei/find_feiyong', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response)=>{
        for (let i = 0; i < response.data.length; i++) {
          this.basicData.push({
            'year': response.data[i].year,
            'type': '学费',
            'money': response.data[i].xuefei,
            'flag': response.data[i].xuefeiflag
          })
          this.basicData.push({
            'year': response.data[i].year,
            'type': '住宿费',
            'money': response.data[i].zhusufei,
            'flag': response.data[i].zhusufeiflag
          })
          this.basicData.push({
            'year': response.data[i].year,
            'type': '其他费用',
            'money': response.data[i].qitatotal,
            'flag': response.data[i].qitaflag
          })
        }
      })
      this.getOtherPay()
    },
    search(){
      this.queryAllByYear()
      let now = new Date()
      let day = now.getDate()
      let month = now.getMonth()+1
      let year = now.getFullYear()
      this.$message.success('Day: ' + day +' Month: '+month+ ' year :'+year)
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
    },
    getSummaries(param) {
      const {columns, data} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '应缴';
          return;
        }
        if (index === 2) {
          sums[index] = '未缴';
          return;
        }
        if(index === 1){
          sums[1] = 0
          for(let i = 0;i<param.data.length;i++){
            sums[1] += Number(param.data[i].money)
          }
          sums[1] += '元'
        }
        if(index === 3){
          sums[3] = 0
          for(let i = 0;i<param.data.length;i++){
            if(param.data[i].flag === 1){
              sums[3] += param.data[i].money
            }
          }
          sums[3] += '元'
        }
      });
      return sums;
    },
    getOtherPay(){
      let params = new URLSearchParams()
      params.append('S_name',this.name)
      params.append('year',this.year)
      axios.post('/treasurer/jiaofei/find_qita', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response)=>{
          this.otherList = response.data
      })
    },
  },
  created() {

  }
}
</script>

<style scoped>


</style>
