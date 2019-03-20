angular.module('speed')
.controller('ClientsController', ClientsController)
.service('ClientsService', ClientsService);

ClientsService.$inject = ['$http'];
function ClientsService($http){
	var service = this;

	service.clients = $http.get(server_uri + "clients")
	.then(
	function successful(response){
		// console.log(response.data[0]._id)
		return response.data
	},
	function error(response){
		console.log("error", response)
	});


	service.findOneClient = function(_id){
		console.log("Client_code in service", _id)
		return $http({
			method: "GET",
			url: server_uri + "clients/" + _id,
		});

		
}};




ClientsController.$inject = ['clients', 'ClientService', 'SuppliersService', '$q', '$timeout'];
function ClientsController(clients, ClientService, SuppliersService, $q, $timeout) {
	var ctrl = this;
	ctrl.clients = clients;
	ctrl.list_loaded = false;

	promise_array = [];


	////coloring clients labels////
	after_client_load_coloring_one_by_one = function(z) {
		if (z > 1) {
			sleep(1000);
		}
		console.log(document.getElementsByClassName("environment_rating_" + 0)[0])
		document.getElementsByClassName("environment_rating_" + z)[0].style.backgroundColor = ctrl.clients[z].environment_rating_color
		document.getElementsByClassName("logistics_rating_" + z)[0].style.backgroundColor = ctrl.clients[z].logistics_rating_color
		document.getElementsByClassName("capacity_rating_" + z)[0].style.backgroundColor = ctrl.clients[z].capacity_rating_color
		document.getElementsByClassName("product_rating_" + z)[0].style.backgroundColor = ctrl.clients[z].product_rating_color
		document.getElementsByClassName("quality_rating_" + z)[0].style.backgroundColor = ctrl.clients[z].quality_rating_color
			
	}



	$timeout(function(){
		for (p = 0; p < ctrl.clients.length; p++) { 
			promise_array[p] = [];
			if (ctrl.clients[p].supplier_ids.length == 0) {
				promise_array[p].push($timeout(function(){}, 1000+1000 * p))
			}
			else {
				for (u = 0; u < ctrl.clients[p].supplier_ids.length; u++) { 
					promise_array[p].push(SuppliersService.findOneSupplier(ctrl.clients[p].supplier_ids[u]));
				}
			}
		} 

		__e = -1;
		// __e = 1;
		for (e = 0; e < ctrl.clients.length; e++) {
			$q.all(promise_array[e]).then(function success(response) {
				// if (response.length == 0) {
				// 	console.log("very bad code here")
				// 	__e++;
				// 	console.log("small e", __e)
				// } 
				// else {
				// 	_e++;
				// 	__e = _e
				// }
				__e++;

				// console.log(ctrl)
				// console.log(__e)
				// console.log(ctrl.clients.length)
				console.log("response", response)

				ctrl.clients[__e].suppliers  = []
				if (response.length>1){
					for (r = 0; r < response.length; r++) {
						console.log("response", response[r].data)
						var supplier = response[r].data;
						ctrl.clients[__e].suppliers.push(supplier)
					};
				}
				console.log("final list of suppliers", ctrl.clients[__e].suppliers)

				ctrl.clients[__e] = ClientService.giveRatingForClient(ctrl.clients[__e]);
				console.log("cliiiiient", ctrl.clients[__e])

				after_client_load_coloring_one_by_one(__e);
				// console.log("_e", _e)
				if (__e == ctrl.clients.length-1) {
					ctrl.list_loaded = true; ///bad code!!!
				}
			})
		}
	}, 100)
}
