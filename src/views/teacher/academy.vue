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
  name: "academy",
  data() {
    return {
      classYear: '',
      grade_list: [],
      sum_list: [],
      unsum_list: [],
    }
  },
  methods: {
    generateData(){
      let params = new URLSearchParams()
      params.append('year',this.classYear)
      params.append('T_academyid',localStorage.getItem('T_academyid'))
      axios.post('/teacher/find/xueyuan', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response)=>{
        this.grade_list = []
        this.sum_list = []
        this.unsum_list = []
        for(let i = 0;i<response.data.length;i++){
          this.grade_list.push(response.data[i].t_grade)
          this.sum_list.push(response.data[i].sum)
          this.unsum_list.push(-response.data[i].sum1)
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

      if (myChart == null) {
        myChart = this.$echarts.init(document.getElementById("charts"))
      }
      // 需要写后端的查询接口
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: this.classYear + '年度学院缴费情况报表'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            if (!params.length) return ''
            let s = params[0].axisValueLabel + '<br/>'
            for (const iterator of params) {
              let d = iterator.data < 0 ? -iterator.data : iterator.data
              s += iterator.marker + iterator.seriesName + '：' + d
            }
            return s
          }

        },
        legend: {
          data: ['学院未缴费人数', '学院应缴费人数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: (value) => {
                if (value < 0) return -value //这里是针对取负值
                else return value
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            data: this.grade_list
          }
        ],
        series: [
          {
            name: '学院应缴费人数',
            type: 'bar',
            stack: 'Total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.sum_list
          },
          {
            name: '学院未缴费人数',
            type: 'bar',
            stack: 'Total',
            label: {
              show: true,
              formatter: (value) => {
                return -value.data
              },
              position: 'left'
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
