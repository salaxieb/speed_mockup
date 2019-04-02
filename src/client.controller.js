angular.module('speed')
.controller('ClientController', ClientController)
.service('ClientService', ClientService);

ClientService.$inject = ['$http', '$stateParams', 'SupplierService','SuppliersService', '$q'];
function ClientService($http, $stateParams, SupplierService, SuppliersService, $q){
	var service = this;
	service.client = function (client_code){
		// console.log("client_code in service", client_code)
		return $http({
			method: "GET",
			url: server_uri + "clients/" + client_code, 
		})
		.then(
		function successful(response){
			// console.log("reponse.data in service", response.data)
			return response.data
		},
		function error(response){
			console.log("error", response)
		});
	}


	service.giveRatingForClient = function (client) {
		suppliers = []
		for (t = 0; t < client.suppliers.length; t++) {
			// console.log(client.suppliers[t])
			var supplier = SupplierService.giveRatingForSupplier(client.suppliers[t])
			supplier_short = {
				_id: supplier._id,
				brand: supplier.brand,

				environment_rating: supplier.environment_rating,
				environment_rating_color: supplier.environment_rating_color,

				logistics_rating: supplier.logistics_rating,
				logistics_rating_color: supplier.logistics_rating_color,

				capacity_rating: supplier.capacity_rating,
				capacity_rating_color: supplier.capacity_rating_color,

				product_rating: supplier.product_rating,
				product_rating_color: supplier.product_rating_color,

				quality_rating: supplier.quality_rating,
				quality_rating_color: supplier.quality_rating_color,

				overall_rating: supplier.overall_rating
			}
			suppliers.push(supplier_short)
		};
		client.suppliers = suppliers;
		// console.log("final list of suppliers", client.suppliers)



	   	//////////calaculating client total rating//////////////
	   	total_environment = 0;
   		total_logistics = 0;
   		total_capacity = 0;
   		total_product = 0;
   		total_quality = 0;
	   	for (var iter in client.suppliers) {
	   		total_environment += client.suppliers[iter].environment_rating;
	   		total_logistics += client.suppliers[iter].logistics_rating;
	   		total_capacity += client.suppliers[iter].capacity_rating;
	   		total_product += client.suppliers[iter].product_rating;
	   		total_quality += client.suppliers[iter].quality_rating;
	   	}
	   	client.environment_rating = 10
	   	client.logistics_rating = 5
	   	client.capacity_rating = 1
	   	client.product_rating = 5
	   	client.quality_rating = 6.5

	   	if (client.suppliers.length>0) {
		   	client.environment_rating = Math.round((total_environment/client.suppliers.length)*10)/10;
		   	client.logistics_rating = Math.round((total_logistics/client.suppliers.length)*10)/10;
		   	client.capacity_rating = Math.round((total_capacity/client.suppliers.length)*10)/10;
		   	client.product_rating = Math.round((total_product/client.suppliers.length)*10)/10;
		   	client.quality_rating = Math.round((total_quality/client.suppliers.length)*10)/10;
		 }

	   	client.overall_rating = client.environment_rating * client.logistics_rating *
	   	client.capacity_rating * client.product_rating * client.quality_rating;

	   	client.overall_rating = Math.round((client.overall_rating)*1)/10;

	   	client.environment_rating_color = ColorBasedOnRating(client.environment_rating);
	   	client.logistics_rating_color = ColorBasedOnRating(client.logistics_rating);
	   	client.capacity_rating_color = ColorBasedOnRating(client.capacity_rating);
	   	client.product_rating_color = ColorBasedOnRating(client.product_rating);
	   	client.quality_rating_color = ColorBasedOnRating(client.quality_rating);

		return client

	}


};

ClientController.$inject = ['client', 'ClientService', 'SuppliersService', 'SupplierService', '$q', '$timeout'];
function ClientController(client, ClientService, SuppliersService, SupplierService, $q, $timeout) {
	var ctrl = this;
	// console.log("client", client)
	ctrl.client = client;
	ctrl.list_loaded = false;

	//////////////////////////////////////
	// Getting Suppliers list for client//
	//////////////////////////////////////
	ctrl.client.suppliers = [];
	promise_array = [];


	for (i = 0; i < ctrl.client.supplier_ids.length; i++) { 
		promise_array.push(SuppliersService.findOneSupplier(ctrl.client.supplier_ids[i]));
	} 
	///parsing suppliers rating for one client


	$q.all(promise_array).then(function success(response) {
		// console.log("$q returned value", response);
		// console.log(SupplierService.giveRatingForSupplier(response[0].data))
		// console.log(SupplierService.giveRatingForSupplier(response[1].data))
		// console.log(SupplierService.giveRatingForSupplier(response[2].data))
		// console.log("response.length", response.length)
		for (t = 0; t < response.length; t++) {
			// console.log("response", response[t].data)
			var supplier = response[t].data;
			ctrl.client.suppliers.push(supplier)
		};
		// console.log("final list of suppliers", ctrl.client.suppliers)

		ctrl.client = ClientService.giveRatingForClient(ctrl.client);
		// console.log("cliiiiient", ctrl.client)
		ctrl.list_loaded = true;

		$timeout(after_page_load_coloring_suppliers, 200);

		////coloring headers//////
		if (document.getElementsByClassName("environment").length>0) {
			for (i = 0; i < document.getElementsByClassName("environment").length; i++) {
					document.getElementsByClassName("environment")[i].style.backgroundColor = client.environment_rating_color
			}
		}

		if (document.getElementsByClassName("logistics").length>0) {
			for (i = 0; i < document.getElementsByClassName("logistics").length; i++) {
					document.getElementsByClassName("logistics")[i].style.backgroundColor = client.logistics_rating_color
			}
		}
		if (document.getElementsByClassName("capacity").length>0) {
			for (i = 0; i < document.getElementsByClassName("capacity").length; i++) {
					document.getElementsByClassName("capacity")[i].style.backgroundColor = client.capacity_rating_color
			}
		}
	})



	////coloring supplier labels////
	after_page_load_coloring_suppliers = function(){
		if (ctrl.client.suppliers.length>0) {
			console.log(ctrl.client.suppliers.length)
			for (y = 0; y < ctrl.client.suppliers.length; y++) {
				document.getElementsByClassName("environment_rating_" + y)[0].style.backgroundColor = ctrl.client.suppliers[y].environment_rating_color
				document.getElementsByClassName("logistics_rating_" + y)[0].style.backgroundColor = ctrl.client.suppliers[y].logistics_rating_color
				document.getElementsByClassName("capacity_rating_" + y)[0].style.backgroundColor = ctrl.client.suppliers[y].capacity_rating_color
				document.getElementsByClassName("product_rating_" + y)[0].style.backgroundColor = ctrl.client.suppliers[y].product_rating_color
				document.getElementsByClassName("quality_rating_" + y)[0].style.backgroundColor = ctrl.client.suppliers[y].quality_rating_color
			}
		}
	}

	// for (i = 0; i < ctrl.client.supplier_ids.length; i++) { 
	// 	promise_array.push(SuppliersService.findOneSupplier(ctrl.client.supplier_ids[i]));
	// } 
	// ///parsing suppliers rating for one client


	// $q.all(promise_array).then(function success(response) {
	// 	// console.log("$q returned value", response);
	// 	// console.log(SupplierService.giveRatingForSupplier(response[0].data))
	// 	// console.log(SupplierService.giveRatingForSupplier(response[1].data))
	// 	// console.log(SupplierService.giveRatingForSupplier(response[2].data))
	// 	// console.log("response.length", response.length)
	// 	for (t = 0; t < response.length; t++) {
	// 		var suppl = response[t].data;
	// 		var supplier = SupplierService.giveRatingForSupplier(suppl)
	// 		supplier = {
	// 			_id: supplier._id,
	// 			brand: supplier.brand,

	// 			environment_rating: supplier.environment_rating,
	// 			environment_rating_color: supplier.environment_rating_color,

	// 			logistics_rating: supplier.logistics_rating,
	// 			logistics_rating_color: supplier.logistics_rating_color,

	// 			capacity_rating: supplier.capacity_rating,
	// 			capacity_rating_color: supplier.capacity_rating_color,

	// 			product_rating: supplier.product_rating,
	// 			product_rating_color: supplier.product_rating_color,

	// 			quality_rating: supplier.quality_rating,
	// 			quality_rating_color: supplier.quality_rating_color,

	// 			overall_rating: supplier.overall_rating
	// 		}
	// 		ctrl.suppliers.push(supplier)
	// 	};
	// 	console.log("final list of suppliers", ctrl.suppliers)

	//    	$timeout(after_page_load_coloring_suppliers, 200);

	//    	//////////calaculating client total rating//////////////
	//    	total_environment = 0;
 //   		total_logistics = 0;
 //   		total_capacity = 0;
 //   		total_product = 0;
 //   		total_quality = 0;
	//    	for (var iter in ctrl.suppliers) {
	//    		total_environment += ctrl.suppliers[iter].environment_rating;
	//    		total_logistics += ctrl.suppliers[iter].logistics_rating;
	//    		total_capacity += ctrl.suppliers[iter].capacity_rating;
	//    		total_product += ctrl.suppliers[iter].product_rating;
	//    		total_quality += ctrl.suppliers[iter].quality_rating;
	//    	}
	//    	ctrl.client.environment_rating = Math.round((total_environment/ctrl.suppliers.length)*10)/10;
	//    	ctrl.client.logistics_rating = Math.round((total_logistics/ctrl.suppliers.length)*10)/10;
	//    	ctrl.client.capacity_rating = Math.round((total_capacity/ctrl.suppliers.length)*10)/10;
	//    	ctrl.client.product_rating = Math.round((total_product/ctrl.suppliers.length)*10)/10;
	//    	ctrl.client.quality_rating = Math.round((total_quality/ctrl.suppliers.length)*10)/10;
	//    	ctrl.client.overall_rating = ctrl.client.environment_rating * ctrl.client.logistics_rating *
	//    	ctrl.client.capacity_rating * ctrl.client.product_rating * ctrl.client.quality_rating;

	//    	ctrl.client.overall_rating = Math.round((ctrl.client.overall_rating)*100)/1000;

	//    	ctrl.client.environment_rating_color = ColorBasedOnRating(ctrl.client.environment_rating);
	//    	if (document.getElementsByClassName("environment").length>0) {
	// 		for (i = 0; i < document.getElementsByClassName("environment").length; i++) {
	// 				document.getElementsByClassName("environment")[i].style.backgroundColor = ctrl.client.environment_rating_color
	// 		}
	// 	}

	//    	ctrl.client.logistics_rating_color = ColorBasedOnRating(ctrl.client.logistics_rating);
	//    	if (document.getElementsByClassName("logistics").length>0) {
	// 		for (i = 0; i < document.getElementsByClassName("logistics").length; i++) {
	// 				document.getElementsByClassName("logistics")[i].style.backgroundColor = ctrl.client.logistics_rating_color
	// 		}
	// 	}

	//    	ctrl.client.capacity_rating_color = ColorBasedOnRating(ctrl.client.capacity_rating);
	//    	if (document.getElementsByClassName("capacity").length>0) {
	// 		for (i = 0; i < document.getElementsByClassName("capacity").length; i++) {
	// 				document.getElementsByClassName("capacity")[i].style.backgroundColor = ctrl.client.capacity_rating_color
	// 		}
	// 	}

	// 	ctrl.list_loaded = true;
	// })
	
	// ClientsController.client = ClientService.client;
	////////////
	// Charts //
	////////////
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
	var ctx = document.getElementById("line-chart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: ["w24","w25","w26","w27","w28","w29","w30","w31","w32","w33","w34","w35","w36",'w37',"w38","w39","w40","w41",'w42'],
	        datasets: [{
	            label: 'FD service rate',
	            data: [80,88,89,90,88,78,74,78,80,82,83,84,86,88,90,88,86,84,84],
	            // backgroundColor: 'rgba(0,0,0,0)',
	            borderColor: 'rgba(251, 160, 18, 1)',
	            borderWidth: 1,
	            fill: false
	        }, {
	            label: 'FL service rate',
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

	var ctx = document.getElementById("risks-chart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: ["w24","w25","w26","w27","w28","w29","w30","w31","w32","w33","w34","w35","w36",'w37',"w38","w39","w40","w41",'w42'],
	        datasets: [{
	            label: 'Plant risks rating',
	            data: [80,88,89,90,88,78,74,78,80,82,83,84,86,88,90,88,70,55,40],
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
}