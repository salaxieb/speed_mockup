var ctx = document.getElementById("bar-chart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["w24","w25","w26","w27","w28","w29","w30","w31","w32","w33","w34","w35","w36",'w37',"w38","w39","w40","w41",'w42'],
        datasets: [{
            label: 'Ranking',
            data: [200,220,230,220,180,220,240,210,200,230,220,180,220,240,210,270,230,220,180,220,240,210],
            backgroundColor: 'rgba(251, 160, 18, 1)',
            borderColor: 'rgba(251, 160, 18, 1)',
            borderWidth: 1
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
