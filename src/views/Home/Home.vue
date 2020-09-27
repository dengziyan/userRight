<template>

  <div>
    <div class="charts">
      <div id="pieGraph" style="height: 350px;"></div>
    </div>
<!--    <div class="charts">-->
<!--      <div id="barGraph" style="height: 350px;"></div>-->
<!--    </div>-->
  </div>
</template>

<script>
// 引入基本模板,按需加载
let echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入柱状图
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

export default {
  name: "WelcomePage",
  data () {
    return { }
  },
  mounted(){
    // this.drawBar();
    this.drawPie();
  },
  methods:{
    // initChart() {
    //   this.chart = echarts.init(this.$el, 'macarons')
    //
    //   this.chart.setOption({
    //     tooltip: {
    //       trigger: 'item',
    //       formatter: '{a} <br/>{b} : {c} ({d}%)'
    //     },
    //     legend: {
    //       left: 'center',
    //       bottom: '10',
    //       data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
    //     },
    //     series: [
    //       {
    //         name: 'WEEKLY WRITE ARTICLES',
    //         type: 'pie',
    //         roseType: 'radius',
    //         radius: [15, 95],
    //         center: ['50%', '38%'],
    //         data: [
    //           { value: 320, name: 'Industries' },
    //           { value: 240, name: 'Technology' },
    //           { value: 149, name: 'Forex' },
    //           { value: 100, name: 'Gold' },
    //           { value: 59, name: 'Forecasts' }
    //         ],
    //         animationEasing: 'cubicInOut',
    //         animationDuration: 2600
    //       }
    //     ]
    //   })
    // },
    // drawBar(){
    //   // 基于dom，初始化echarts实例
    //   let barGraph = echarts.init(document.getElementById('barGraph'));
    //   // 绘制图表
    //   barGraph.setOption({
    //     title: {
    //       text: '全年产量趋势图',
    //       left: 'center'
    //     },
    //     tooltip: {
    //       trigger: 'item',
    //       formatter: '{a} <br/>{b} : {c}'
    //     },
    //     legend: {
    //       left: 'center',
    //       data: ['本年', '上年'],
    //       bottom:0
    //     },
    //     xAxis: {
    //       type: 'category',
    //       name: 'x',
    //       splitLine: {show: false},
    //       data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    //     },
    //     grid: {
    //       left: '1%',
    //       right: '2%',
    //       bottom: '8%',
    //       containLabel: true
    //     },
    //     yAxis: {
    //       type: 'category',
    //       name: 'y',
    //       splitLine: {show: true},
    //       data:['10%','20%','30%','40%','50%','60%','70%','80%','90%','100%']
    //     },
    //     series: [
    //       {
    //         name: '本年',
    //         type: 'line',
    //         data: [0.8, 0.98, 0.96, 0.27, 0.81, 0.47, 0.74, 0.23, .69, 0.25, 0.36, 0.56]
    //       },
    //       {
    //         name: '上年',
    //         type: 'line',
    //         data: [1, 0.2, 0.4, 0.8, 0.16, 0.32, 0.64, 1.28, 5.6, 0.25, 0.63, 0.65, 0.12]
    //       },
    //     ]
    //   })
    // },
    drawPie(){
      let pieGraph = echarts.init(document.getElementById('pieGraph'));
      pieGraph.setOption({
        title : {
          text: '列表数据',
          subtext: '纯属虚构',
          x:'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['用户列表','角色列表','资源列表','菜单列表']
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
              {value:335, name:'用户列表',itemStyle: { color: '#005eff' }},
              {value:310, name:'角色列表',itemStyle: { color: '#99A9BF' }},
              {value:234, name:'资源列表',itemStyle: { color: '#409EFF' }},
              {value:135, name:'菜单列表',itemStyle: { color: '#A349A4' }}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }
}
</script>

