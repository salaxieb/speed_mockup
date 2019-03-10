var ctx = document.getElementById("capacity-graph").getContext('2d');
var mixedChart = new Chart(ctx, {
  type: 'bar',
  data: {
    datasets: [{
          label: 'Plan montage',
          data: [1890, 4858, 5488, 2478, 4408, 2030, 4837, 5397, 5467, 5426, 3405, 2807, 4149, 5368, 5610, 6099, 3739, 2210, 3928, 5410, 5901, 5928, 3386, 3361, 5325],
          borderColor: 'rgba(0, 0, 255, 1)',
          backgroundColor: 'rgba(0, 0, 255, 1)'
        }, {
          label: 'Capacity',
          data: [8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500,  8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500,  8500, 8500],
          borderColor: 'rgba(0, 255, 0, 1)',
          type: 'line',
          fill: false,
          borderWidth: 2,
          radius: 0,
          lineTension: 0,
        },
        {
          label: 'CR',
          data: [6820, 6820, 6820, 7040, 7040, 7040, 7040, 6768, 6768, 6768, 6768, 6679, 6679, 6679, 6679, 6679, 6713, 6713, 6713, 6713, 6719, 6719, 6719, 6719, 6719, 6830, 6827, 6661, 6907, 6907, 6603, 6806, 6974, 7160, 7466, 8235, 8235, 6883, 7335, 7338, 7772, 7774],
          borderColor: 'rgba(255, 0, 0, 1)',
          type: 'line',
          fill: false,
          borderWidth: 2,
          radius: 0,
          lineTension: 0,
        }],
    labels: ['2019/7 11-Feb', '2019/8 18-Feb', '2019/9 25-Feb',  '2019/1 04-Mar', '2019/11 11-Mar', '2019/12 18-Mar', '2019/13 25-Mar', '2019/14 01-Apr', '2019/15 08-Apr', '2019/16 15-Apr', '2019/17 22-Apr', '2019/18 29-Apr', '2019/19 06-May', '2019/20 13-May', '2019/21 20-May', '2019/22 27-May',
     '2019/23 03-Jun', '2019/24 10-Jun', '2019/25 17-Jun', '2019/26 24-Jun', '2019/27 01-Jul', '2019/28 08-Jul', '2019/29 15-Jul', '2019/30 22-Jul', '2019/31 29-Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ,'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  options: {
      maintainAspectRatio: false,
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }],
      elements: { point: { radius: 0 } }
      }
  }
});
