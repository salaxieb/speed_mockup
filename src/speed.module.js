angular.module('speed', ['ui.router']);

const server_uri = "http://ec2-18-197-208-44.eu-central-1.compute.amazonaws.com/api/";
// const server_uri = "http://localhost:3000/";

function ColorBasedOnRating(rating){
	//red = (200;20;20)
	//greed = (20; 200; 20)
	//yellow = (251;180;20)

	blue = 20;
	red = 20;
	green = 20;
	if (rating < 5) {
		red = 200 + (251 - 200)*rating/5;
		green = 20 + (180-20)*rating/5;
	}
	else {
		red = 251 - (251-20)*(rating-5)/5;
		green = 180 + (20)*(rating-5)/5;
	}
	red = Math.round(red)
	green = Math.round(green)
	blue = Math.round(blue)
	return "rgb("+red+","+green+","+blue+")";
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


