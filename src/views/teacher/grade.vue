<template>
  <div>
    <el-select placeholder="请选择查询学年" @change="changeSelect" v-model="classYear">
      <el-option label="2022-2023" value="2022-2023"></el-option>
      <el-option label="2021-2022" value="2021-2022"></el-option>
      <el-option label="2020-2021" value="2020-2021"></el-option>
      <el-option label="2019-2020" value="2019-2020"></el-option>
    </el-select>
    <div style="width: 100%; height: 100%; align-items: center; justify-content: center; flex-direction: column">
      <div style="width: 1000px; height: 800px" id="charts"></div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "grade",
  data() {
    return {
      classYear: '',
      id_list: [],   // 班级号列表
      sum_list: [],   // 应缴人数列表
      sum1_list: [],     // 实缴人数列表
      unsum_list: []      // 未缴人数列表
    }
  },
  methods: {
    generateData() {
      let params = new URLSearchParams()
      params.append('T_grade', localStorage.getItem('T_grade'))
      params.append('year',this.classYear)
      params.append('T_academyid',localStorage.getItem('T_academyid'))
      axios.post('/teacher/find/nianji', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response)=>{
        this.id_list = []
        this.sum_list = []
        this.sum1_list = []
        this.unsum_list = []
        for (let i = 0; i < response.data.length; i++) {
          this.id_list.push(response.data[i].class_id)
          this.sum_list.push(response.data[i].sum)
          this.sum1_list.push(response.data[i].sum1)
          this.unsum_list.push(response.data[i].sum - response.data[i].sum1)
        }
      })

    },
    changeSelect(val) {
      this.classYear = val
      this.generateData()
      this.drawCharts()
    },
    drawCharts() {
      // let myChart = this.$echarts.init(document.getElementById("charts"));
      let myChart = this.$echarts.getInstanceByDom(document.getElementById("charts"))

      if(myChart == null){
        myChart = this.$echarts.init(document.getElementById("charts"))
      }
      // 需要写后端的查询接口
      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['班级已缴费人数', '班级应缴费人数', '班级未缴费人数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            data: this.id_list
          }
        ],
        series: [
          {
            name: '班级应缴费人数',
            type: 'bar',
            label: {
              show: true,
              position: 'inside'
            },
            emphasis: {
              focus: 'series'
            },
            data: this.sum_list
          },
          {
            name: '班级已缴费人数',
            type: 'bar',
            stack: 'Total',
            label: {
              show: true,
              position: 'inside'
            },
            emphasis: {
              focus: 'series'
            },
            data: this.sum1_list
          },
          {
            name: '班级未缴费人数',
            type: 'bar',
            stack: 'Total',
            label: {
              show: true,
              position: 'inside'
            },
            emphasis: {
              focus: 'series'
            },
            data: this.unsum_list
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
  created() {
  }
}
</script>

<style scoped>

</style>
