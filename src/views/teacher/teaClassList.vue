<template>
  <div>
    <el-button @click="generateReport">生成简易报表</el-button>
    <el-table :data="list" border>
      <el-table-column label="班级号" prop="class_id" align="center"></el-table-column>
      <el-table-column label="查询班级缴费情况" align="center">
        <template slot-scope="scope">
          <el-button @click="openClass(scope.row.class_id)">查询</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="班级缴费情况查询" :visible.sync="classVisible">
      <el-select placeholder="请选择查询学年" ref="mySelect" @change="changeSelect" v-model="classYear">
        <el-option label="2022-2023" value="2022-2023"></el-option>
        <el-option label="2021-2022" value="2021-2022"></el-option>
        <el-option label="2020-2021" value="2020-2021"></el-option>
        <el-option label="2019-2020" value="2019-2020"></el-option>
      </el-select>
      <el-table :data="classList" :row-style="changeRowColor">
        <el-table-column label="姓名" prop="s_name" align="center"></el-table-column>
        <el-table-column label="学号" prop="s_no" align="center"></el-table-column>
        <el-table-column label="年级" prop="s_grade" align="center"></el-table-column>
        <el-table-column label="学年" prop="year" align="center"></el-table-column>
        <el-table-column label="班级号" prop="class_id" align="center"></el-table-column>
        <el-table-column label="班级名" prop="class_name" align="center"></el-table-column>
        <el-table-column label="缴费状态" prop="flag" align="center" :formatter="statusFormatter"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="统计报表" :visible.sync="reportVisible" @opened="drawCharts"
               style="align-items: center; justify-content: center">
      <div style="width: 100%; height: 600px" id="charts">

      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "teaClassList",
  data() {
    return {
      list: [],
      list_transformed: [],
      list_pay: [],
      list_unpay: [],
      classVisible: false,
      classYear: '',
      classList: {
        class_name: '',
        year: '',
        class_id: '',
        flag: '',
        s_no: '',
        s_name: '',
        s_grade: '',
      },
      class: '',
      reportClass: false,
      reportVisible: false,
      personListByClass: [],
      personListByYear: []
    }
  },
  methods: {
    getData() {
      let params = new URLSearchParams()
      params.append('T_id', localStorage.getItem('user_id'))
      axios.post('/teacher/find/class', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.list.push({
            'class_id': response.data[i]
          })
          this.list_transformed.push(response.data[i])
        }
        console.log(this.list)
      })
    },
    openClass(data) {
      this.classVisible = true
      this.class = data
    },
    changeSelect(val) {
      this.classYear = val
      this.getClass()
    },
    statusFormatter(row, column) {
      if (row.flag === 0) {
        return '已缴费'
      } else {
        return '未缴费项数:' + row.flag
      }
    },
    getClass() {
      let params = new URLSearchParams()
      params.append('class_id', this.class)
      params.append('year', this.classYear)
      axios.post('/teacher/find/student_list', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        this.classList = response.data
      })
    },
    generateReport() {
      this.reportVisible = true
      this.getReportData()

    },
    getReportData() {
      this.list.forEach((item) => {

      })
    },
    drawCharts() {
      let myChart = this.$echarts.init(document.getElementById("charts"));
      // 需要写后端的查询接口
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "班级统计报表",
        },
        tooltip: {},
        legend: {
          data: ["已缴清费用", "未缴清费用"],
        },
        xAxis: {
          type: 'category',
          data: this.list_transformed,
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: "已缴清费用",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20, 13],
            stack: 'x'
          },
          {
            name: "未缴清费用",
            type: "bar",
            data: [15, 25, 36, 40, 12, 18, 14],
            stack: 'x'
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    changeRowColor({row,rowIndex}){
      if(row.flag !== 0){
        return{
          color: 'red'
        }
      }
    },
  },
  created() {
    this.getData()
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
