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
    <el-table size="small" :data="basicData" style="width: 100%;" border :span-method="basicSpan">
      <el-table-column align="center" prop="year" label="学年">
      </el-table-column>
      <el-table-column align="center" prop="name" label="姓名">
      </el-table-column>
      <el-table-column align="center" prop="type" label="类型">
      </el-table-column>
      <el-table-column align="center" prop="money" label="金额">
      </el-table-column>
      <el-table-column align="center" prop="flag" label="是否缴纳" :formatter="flagFormatter">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="totalPay(scope.row)" :disabled="scope.row.is_payed === 1 ? true:false">缴纳</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-bottom: 20px;margin-top: 20px; align-items: center; width: 100%">年度其他费用</div>
    <el-table :data="otherList" border>
      <el-table-column align="center" prop="s_no" label="学生学号"></el-table-column>
      <el-table-column align="center" prop="s_name" label="学生姓名"></el-table-column>
      <el-table-column align="center" prop="year" label="年份"></el-table-column>
      <el-table-column align="center" prop="remark" label="费用类型"></el-table-column>
      <el-table-column align="center" prop="fee" label="缴费金额"></el-table-column>
      <el-table-column align="center" prop="flag" label="缴费状态" :formatter="flagFormatter"></el-table-column>
      <el-table-column align="center" label="缴费操作">
        <template slot-scope="scope">
          <el-button @click="otherPay(scope.row)" :disabled="scope.row.flag === 1 ? false : true">缴纳</el-button>
        </template>
      </el-table-column>
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
      s_no: '',
      basicData: [],
      otherList: []
    }
  },
  methods: {
    getValue(val) {
      this.year = val
    },
    queryAllByYear() {
      this.basicData = []
      let params = new URLSearchParams()
      params.append('S_name', this.name)
      params.append('year', this.year)

      axios.post('/treasurer/jiaofei/find_feiyong', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.s_no = response.data[0].s_no
        for (let i = 0; i < response.data.length; i++) {
          this.basicData.push({
            'year': response.data[i].year,
            'name': response.data[i].s_name,
            'type': '学费',
            'money': response.data[i].xuefei,
            'flag': response.data[i].xuefeiflag,
            'is_payed': response.data[i].xuefeiflag === 1 ? 0 : 1
          })
          this.basicData.push({
            'year': response.data[i].year,
            'name': response.data[i].s_name,
            'type': '住宿费',
            'money': response.data[i].zhusufei,
            'flag': response.data[i].zhusufeiflag,
            'is_payed': response.data[i].zhusufeiflag === 1 ? 0 : 1
          })
          this.basicData.push({
            'year': response.data[i].year,
            'name': response.data[i].s_name,
            'type': '其他费用',
            'money': response.data[i].qitatotal,
            'flag': response.data[i].qitaflag,
            'is_payed': 1
          })
        }
      })
      this.getOtherPay()
    },
    search() {
      this.queryAllByYear()
    },
    flagFormatter(row, column) {
      if (row.flag === 0) {
        return '已缴纳'
      } else if (row.flag === 1) {
        return '未缴纳'
      } else if(row.flag === 2){
        return '处理中'
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
      if (columnIndex === 1) {
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
    getOtherPay() {
      let params = new URLSearchParams()
      params.append('S_name', this.name)
      params.append('year', this.year)
      axios.post('/treasurer/jiaofei/find_qita', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.otherList = response.data
      })
    },
    totalPay(data){
      console.log(data.flag)
      let params = new URLSearchParams()
      let f_id = (data.type==='学费'?'1':'2')
      params.append('S_no',this.s_no)
      params.append('F_id',f_id)
      params.append('remark',data.type)
      params.append('money',data.money)
      params.append('year',data.year)
      axios.post('/treasurer/jiaofei', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response)=>{
        if(response.data===1){
          this.$message.success('缴费成功')
        }else{
          this.$message.error('缴费失败')
        }
      })
    },
    otherPay(){
      let params = new URLSearchParams()
      params.append('S_no',this.s_no)
      params.append('F_id','3')
      params.append('remark',data.remark)
      params.append('money',data.fee)
      params.append('year',data.year)
      axios.post('/treasurer/jiaofei', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response)=>{
        if(response.data===1){
          this.$message.success('缴费成功')
        }else{
          this.$message.error('缴费失败')
        }
      })
    }
  },
  created() {

  }
}
</script>

<style scoped>


</style>
