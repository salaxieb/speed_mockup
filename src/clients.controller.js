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
		// console.log("error", response)
	});


	service.findOneClient = function(_id){
		// console.log("Client_code in service", _id)
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

	
	////coloring clients labels////
	after_client_load_coloring_one_by_one = function(z) {
		// console.log(document.getElementsByClassName("environment_rating_" + 0)[0])
		document.getElementsByClassName("environment_rating_" + z)[0].style.backgroundColor = ctrl.clients[z].environment_rating_color
		document.getElementsByClassName("logistics_rating_" + z)[0].style.backgroundColor = ctrl.clients[z].logistics_rating_color
		document.getElementsByClassName("capacity_rating_" + z)[0].style.backgroundColor = ctrl.clients[z].capacity_rating_color
		document.getElementsByClassName("product_rating_" + z)[0].style.backgroundColor = ctrl.clients[z].product_rating_color
		document.getElementsByClassName("quality_rating_" + z)[0].style.backgroundColor = ctrl.clients[z].quality_rating_color	
	}


	// ////////calculating all ratings for clients
	promise_array = [];

	for (p = 0; p < ctrl.clients.length; p++) { 
		promise_array[p] = [];
		if (ctrl.clients[p].supplier_ids.length == 0) {
			promise_array[p].push($timeout(function(){}, 1000 * (p+1)))
		}
		else {
			for (u = 0; u < ctrl.clients[p].supplier_ids.length; u++) { 
				promise_array[p].push(SuppliersService.findOneSupplier(ctrl.clients[p].supplier_ids[u]));
			}
		}
		promise_array[p].push(p)
	} 

	for (e = 0; e < ctrl.clients.length; e++) {
		$q.all(promise_array[e]).then(function success(response) {

			// console.log("response", response)
			index = response[response.length-1]

			ctrl.clients[index].suppliers  = []
			if (response.length>2){
				for (r = 0; r < response.length-1; r++) {
					supplier = response[r].data;
					ctrl.clients[index].suppliers.push(supplier)
				}
			} 

			ctrl.clients[index] = ClientService.giveRatingForClient(ctrl.clients[index]);
			after_client_load_coloring_one_by_one(index);
			if (index == ctrl.clients.length-1) {
				ctrl.list_loaded = true; ///bad code!!!
			}
		})
	}
}
