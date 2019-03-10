var ctx = document.getElementById("risks-chart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["w24","w25","w26","w27","w28","w29","w30","w31","w32","w33","w34","w35","w36",'w37',"w38","w39","w40","w41",'w42'],
        datasets: [{
            label: 'Supplier risks rating',
            data: [80,88,89,90,88,78,74,78,80,82,83,84,86,88,90,80,65,50,35],
            // backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgb(250, 0, 0, 1)',
            borderWidth: 1,
            pointRadius: 0
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
