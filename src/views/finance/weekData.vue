<template>
<div style="width: 100%; height: 100%">
  <div id="PieChart" style="width: 100%;height: 400px;"></div>
  <div id="LineChart" style="width: 100%; height: 400px;"></div>
</div>
</template>

<script>
import axios from "axios";
export default {
  name: "weekData",
  data(){
    return{
      weekMoney:[],
      weekDate:[]
    }
  },
  methods: {
    getData(){
      axios.get('/treasurer/check/data').then((response)=>{
      })
      this.generateLineChart()
      this.generatePieChart()
    },
    generatePieChart(){
      let piechart = this.$echarts.init(document.getElementById('PieChart'))
      let somedata = []
      for(let i = 0;i<this.weekMoney.length;i++){
        let temp = { value: this.weekMoney[i], name: this.weekDate[i]}
        somedata.push(temp)
      }
      let option = {
        title: {
          text: '缴费数据饼状图',
          subtext: '按周展示',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} : {c}',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '缴费数据',
            type: 'pie',
            radius: '50%',
            data: somedata,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      piechart.setOption(option)
      piechart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 6
      });
    },
    generateLineChart(){
      let linechart = this.$echarts.init(document.getElementById("LineChart"))
      this.weekMoney = [1100,1200,1300,1400,1500,1600,7700]
      this.weekDate = ['2023-04-29','2023-04-30','2023-05-01','2023-05-02','2023-05-03','2023-05-04','2023-05-05']
      let option = {
        title: {
          text: "周度缴费统计",
        },
        tooltip: {},
        legend: {
        },
        xAxis: {
          type: 'category',
          data: this.weekDate
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: "缴费金额",
            type: "line",
            data: this.weekMoney
          }
        ]
      }
      linechart.setOption(option)
    }
  },
  created(){

  },
  mounted(){
    this.getData()
  }
}
</script>

<style scoped>

</style>
