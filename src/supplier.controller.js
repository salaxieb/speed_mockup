angular.module('speed')
.controller('SupplierController', SupplierController)
.service('SupplierService', SupplierService);

SupplierService.$inject = ['$http', '$stateParams'];
function SupplierService($http, $stateParams){
	var service = this;
	service.supplier = function (supplier_code){
		// console.log("supplier_code in service", supplier_code)
		return $http({
			method: "GET",
			url: server_uri + "suppliers/" + supplier_code,
		})
		.then(
		function successful(response){
			console.log("reponse.data in supplier service", response.data)
			return response.data
		},
		function error(response){
			console.log("error", response)
		});
	}

	service.getBiggestLeadTime = function(leadTimes) {
		maximum_lead_time = "0 days"
		for (i = 0; i < leadTimes.length; i++) {
			maximum_lead_time = "3 days" // fooo data
		}
		return maximum_lead_time;
	}

	service.giveRatingForSupplier = function (supplier) {
		// console.log("supllasdfasdfas", supplier)
		date =  new Date(supplier.overall.start_of_deliveries);
		today =  new Date();
		if ((today.getMonth() - date.getMonth()) < 0) {
			years = today.getFullYear() -  date.getFullYear() - 1;
		}
		else {
			years = today.getFullYear() -  date.getFullYear();
		}
		//////getting max_lead timne////
		supplier.maximum_lead_time = service.getBiggestLeadTime(supplier.logistics.lead_time);

		//////calculation environment rating ////////
		experince_rating = years>1?1.3*Math.log(years):0

		supplier.environment_rating = Math.round((experince_rating + Number(supplier.overall.low_cost_country?0:1) +
		Number(supplier.maximum_lead_time<"3"?0:1) + Number(supplier.supplies_to_another_country?0:1) +
		Number(supplier.overseas_supplies?0:2) + Number(supplier.action_plan_size?0:1))*10)/10
		// console.log("experince_rating", experince_rating)
		// console.log(Number(supplier.overall.low_cost_country?0:1))
		// console.log(Number(supplier.maximum_lead_time<"3"?0:1))
		// console.log(Number(supplier.supplies_to_another_country?0:1))
		// console.log(Number(supplier.overseas_supplies?0:2))
		// console.log(Number(supplier.action_plan_size?0:1))
		// console.log("environment risk lvl",supplier.environment_rating)

		supplier.environment_rating_color = ColorBasedOnRating(supplier.environment_rating)
		if (document.getElementsByClassName("environment").length>0) {
			for (i = 0; i < document.getElementsByClassName("environment").length; i++) {
					document.getElementsByClassName("environment")[i].style.backgroundColor = supplier.environment_rating_color
			}
		}
		///////calculating total weights without client///////
		total_actives = 0;
		total_delays = 0;
		for (j = 0; j < supplier.client_ids.length; j++) {
			supplies = supplier.logistics.supplies.filter(supply => {return supply.client_id === supplier.client_ids[j]});
			for (k = 0; k < supplies.length; k++) {
				total_actives += supplies[k].actives
				total_delays += supplies[k].delays
			}
		}

		//////calculation logistics rating ////////
		delays_rating = 3;
		if (total_delays/total_actives>0.2) {
			delays_rating = 0;
		} else {
			delays_rating = (0.2 - total_delays/total_actives) * 3;
		}

		mmog_rating = 1
		if (supplier.logistics.mmog_le_sa_result) {
			if (supplier.logistics.mmog_le_sa_result.mark<90) {
				mmog_rating = 0;
			}
		}

		supplier.logistics_rating = Math.round((Number(total_actives<300?1:0) +
		Number(delays_rating) + Number(mmog_rating) +
		Number(supplier.logistics.assce_audit_result>3?3:0) + Number(supplier.logistics.aplf_audit_result>80?1:0))*10)/10;

		supplier.logistics_rating_color = ColorBasedOnRating(supplier.logistics_rating)
		if (document.getElementsByClassName("logistics").length > 0){
			for (i = 0; i < document.getElementsByClassName("logistics").length; i++) {
					document.getElementsByClassName("logistics")[i].style.backgroundColor = supplier.logistics_rating_color
				}
		}

		//////calculation capacity rating ////////
		if (supplier.capacity.capacity_files) {
			for (i = 0; i < supplier.capacity.capacity_files.length; i++){
				supplier.capacity.capacity_files[i].rating = Math.round((Number(supplier.capacity.capacity_files[i].ref_nb<10?0.5:0) +
				Number((supplier.capacity.capacity_files[i].pm_status=="BLU" || supplier.capacity.capacity_files[i].pm_status=="GRN")?2:0) +
				Number((supplier.capacity.capacity_files[i].pm_status=="BLU" || supplier.capacity.capacity_files[i].y1_status=="GRN")?1:0) +
				Number((supplier.capacity.capacity_files[i].pm_status=="BLU" || supplier.capacity.capacity_files[i].y2_status=="GRN")?1:0) +
				Number(supplier.capacity.capacity_files[i].weekly_working_hours<120?1:0) +
				Number(supplier.capacity.capacity_files[i].new_shift_lead_time<4?1:0) +
				Number(supplier.capacity.capacity_files[i].capacity_audit_result=="OK with AP"?1:0) +
				Number(supplier.capacity.capacity_files[i].several_clients?0:1) +
				Number(supplier.capacity.capacity_files[i].in_shortage?0:1) +
				Number(supplier.capacity.capacity_files[i].in_supply_planning?0:1))*10)/10
				// console.log("capacity file rating", supplier.capacity.capacity_files[i].rating)
			}
			opposit_risk = 0
			for (i = 0; i < supplier.capacity.capacity_files.length; i++){
				opposit_risk += Math.pow((10-supplier.capacity.capacity_files[i].rating), 10);
			}

			opposit_risk = Math.round(Math.pow(opposit_risk, 1/10)*10)/10;
			supplier.capacity_rating = 10-opposit_risk;
			supplier.capacity_rating = Math.round((supplier.capacity_rating<0?0:supplier.capacity_rating)*10)/10;
			// console.log("final risk level", supplier.capacity_rating);

		} else {
			supplier.capacity_rating = 5
		}
		
		supplier.capacity_rating_color = ColorBasedOnRating(supplier.capacity_rating);
		if (document.getElementsByClassName("capacity").length>0) {
			for (i = 0; i < document.getElementsByClassName("capacity").length; i++) {
					document.getElementsByClassName("capacity")[i].style.backgroundColor = supplier.capacity_rating_color
			}
		}

		//////calculation rpoduct rating ////////
		supplier.product_rating = 5
		supplier.product_rating_color = "rgb(100,100,100)"

		//////calculation quality rating ////////
		supplier.quality_rating = 5
		supplier.quality_rating_color = "rgb(100,100,100)"

		//////calculation overall rating ////////
		supplier.overall_rating = Math.round((supplier.environment_rating * supplier.logistics_rating *
			supplier.capacity_rating * supplier.product_rating * supplier.quality_rating)*1)/10;

		return supplier;

	}

	service.save_all = function(supplier) {
		console.log("sending user data to server")
		delete supplier.start_of_deliveries

		// var supplier = {ipn: login,
		// 			pass: password}
		return $http.post(server_uri + "suppliers/", supplier)

	}


}


SupplierController.$inject = ['$rootScope', '$state', 'supplier', 'SuppliersService', 'SupplierService', 'ClientsService','$q','$scope', '$timeout'];
function SupplierController($rootScope, $state, supplier, SuppliersService, SupplierService, ClientsService, $q, $scope, $timeout) {
	$rootScope.$state = $state
	// console.log("$$$$$$$$$$$$state", $state)
	var ctrl = this;
	ctrl.supplier = supplier;
	ctrl.$state = $state

	////////////getting clients ///////////
	ctrl.clients = [];
	promise_array = [];
	promise_array2 = [];

	// console.log("client_ids", ctrl.supplier.client_ids.length)

	for (i = 0; i < ctrl.supplier.client_ids.length; i++) {
		// console.log("ids:", ctrl.supplier.client_ids[i]);
		promise_array.push(ClientsService.findOneClient(ctrl.supplier.client_ids[i]));
	}

	$q.all(promise_array).then(function success(response) {
		// console.log("$q returned value", response);
		for (i = 0; i < response.length; i++) {
			// console.log("response in controller", response)
			var client = { _id: response[i].data._id, code: response[i].data.code, supplier_ids: response[i].data.supplier_ids}
			ctrl.clients.push(client)
		};

		///flow for each client/////
		// console.log("clients.length", ctrl.clients.length);
		for (i = 0; i < ctrl.clients.length; i++) {
			ctrl.clients[i].suppliers_count = ctrl.clients[i].supplier_ids.length;
			promise_array2.push([]);
			for (j = 0; j < ctrl.clients[i].supplier_ids.length; j++) {
				// console.log("ctrl.clients[i].supplier_ids[j]", ctrl.clients[i].supplier_ids[j])
				promise_array2[i].push(SuppliersService.findOneSupplier(ctrl.clients[i].supplier_ids[j]))
			}
		}
		_i = -1
		for (i = 0; i < promise_array2.length; i++) { //iterating by clients
			$q.all(promise_array2[i]).then(
				function success(response){
					_i++;
					ctrl.clients[_i].total_actives = 0
					ctrl.clients[_i].total_delays = 0
					//////calculating client delays & actives
					for (j = 0; j < response.length; j++){  //iterating by suppliers
						supplies = response[j].data.logistics.supplies.filter(supply => {return supply.client_id === ctrl.clients[_i]._id});
						for (k=0; k < supplies.length; k++) { //iterating by supplies
							// console.log("supplies", supplies)
							ctrl.clients[_i].total_actives += supplies[k].actives;
							ctrl.clients[_i].total_delays += supplies[k].delays;
						}
						// console.log("total actives", ctrl.clients[_i].total_actives);
						// console.log("total actives", ctrl.clients[_i].total_delays);
					}

					//inserting weights//
					supplies = ctrl.supplier.logistics.supplies.filter(supply => {return supply.client_id === ctrl.clients[_i]._id});
					// console.log("suppliersm", supplies)
					total_actives = 0;
					total_delays = 0;
					for (k = 0; k < supplies.length; k++) {
						total_actives += supplies[k].actives
						total_delays += supplies[k].delays
						// console.log("total actives)", total_actives);
						// console.log("total delays ))", total_delays);
					}
					// console.log("before devide", total_actives);
					// console.log("client actives", ctrl.clients[_i].total_actives);
					// console.log("DEVIDEEEEE", (total_actives / ctrl.clients[_i].total_actives))
					ctrl.clients[_i].this_supplier_actives = total_actives;
					ctrl.clients[_i].this_supplier_delays = total_delays;
					ctrl.clients[_i].weight_in_actives = Math.round(total_actives *100 / ctrl.clients[_i].total_actives);
					ctrl.clients[_i].weight_in_delays = Math.round(total_delays *100/ ctrl.clients[_i].total_delays);

			})
		}
	})

	//////parsing date//////
	date =  new Date(ctrl.supplier.overall.start_of_deliveries);
	ctrl.supplier.start_of_deliveries = "M" + date.getMonth() + " " + date.getFullYear();
	today =  new Date();
	if ((today.getMonth() - date.getMonth()) < 0) {
		months = 12 + today.getMonth() - date.getMonth();
		years = today.getFullYear() -  date.getFullYear() - 1;
	}
	else {
		months =today.getMonth() - date.getMonth();
		years = today.getFullYear() -  date.getFullYear();
	}
	ctrl.supplier.supplier_for = years + "Y " + months + "M"

	///////pluralize supplier or suppliers////////
	ctrl.supplier.imposed_supplier_plural = "suppliers"
	if (ctrl.supplier.overall.imposed_suppliers_number == 1) {
		ctrl.supplier.imposed_supplier_plural = "supplier"
	}

	///////clients lead time//////

	ctrl.supplier.maximum_lead_time = SupplierService.getBiggestLeadTime(ctrl.supplier.logistics.lead_time);

	///////action plan size///////
	ctrl.supplier.action_plan_size = 0

	//////parsing date for mmog//////
	date =  new Date(ctrl.supplier.logistics.mmog_le_sa_date);
	ctrl.supplier.parsed_mmog_le_sa_date = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
	//////parsing date for assce//////
	date =  new Date(ctrl.supplier.logistics.assce_audit_date);
	ctrl.supplier.parsed_assce_audit_date = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
	//////parsing date for aplf//////
	date =  new Date(ctrl.supplier.logistics.aplf_audit_date);
	ctrl.supplier.parsed_aplf_audit_date = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();

	ctrl.supplier = SupplierService.giveRatingForSupplier(ctrl.supplier)

	/////////saving data from edit page////
	ctrl.save_all = function () {
		element = document.getElementsByClassName("main-container")[1];
		element.style.backgroundColor = "rgb(230,230,230)";

		console.log("saving_started")
		supplier = ctrl.supplier

		console.log("AAAAA удаляем данные поставщика АААААА")
  		delete supplier.capacity
  		delete supplier.news



		SupplierService.save_all(ctrl.supplier).then(

			function successs (response){
				console.log("SUCCCESS");
				element = document.getElementsByClassName("main-container")[1];
				element.style.backgroundColor = "rgb(212,237,218)";
				$timeout(function(){
					element.style.backgroundColor = "";
				}, 800)
			}, 
			function error (response){
				console.log("FAILURE")
				element = document.getElementsByClassName("main-container")[1];
				element.style.backgroundColor = "rgb(248,215,218)";
				$timeout(function(){
					element.style.backgroundColor = "";
				}, 800)

			})
	}

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
	//hiding all graphs by default
	if (ctrl.supplier.capacity.capacity_files) {
		for (i = 0; i < ctrl.supplier.capacity.capacity_files.length; i++){
			ctrl.supplier.capacity.capacity_files[i].hide = true
		}
		ctrl.supplier.capacity.unhide_and_hide_graph = function(index) {
			ctrl.supplier.capacity.capacity_files[index].hide = !ctrl.supplier.capacity.capacity_files[index].hide
		}

	    afterTimeout = function() {
	    	for (i = 0; i < ctrl.supplier.capacity.capacity_files.length; i++){
				// console.log("element by id afterTimeout", document.getElementById("capacity-graph-3"))
				var ctx = document.getElementById("capacity-graph-" + i).getContext('2d');
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
			}
	    }

	    // $timeout(afterTimeout, 2000);

	    $scope.$on('$viewContentLoaded', function () {
	    	$timeout(afterTimeout, 200);
	    });
	}


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

}
