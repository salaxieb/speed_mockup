var ctx = document.getElementById("line-chart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["w24","w25","w26","w27","w28","w29","w30","w31","w32","w33","w34","w35","w36",'w37',"w38","w39","w40","w41",'w42'],
        datasets: [{
            label: 'RENAULTRUSSIA SR',
            data: [80,88,89,90,88,78,74,78,80,82,83,84,86,88,90,88,86,84,84],
            // backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(251, 160, 18, 1)',
            borderWidth: 1,
            fill: false
        }, {
            label: 'AVTOVAZRUSSIA SR',
            data: [78,80,88,89,90,88,78,74,78,80,82,83,84,86,88,90,88,86,84],
            // backgroundColor: 'rgb(0,0,0,0)',
            borderColor: 'rgb(0, 0, 255, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
