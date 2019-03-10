angular.module('speed')
.controller('SuppliersController', SuppliersController)
.service('SuppliersService', SuppliersService);

SuppliersService.$inject = ['$http', '$stateParams'];
function SuppliersService($http, $stateParams){
	var service = this;
	service.supplier = function (supplier_code){
		// console.log("supplier_code in service", suppplier_code)
		return $http({
			method: "GET",
			url: server_uri + "suppliers/" + suppliers_code, 
		})
		.then(
		function successful(response){
			// console.log("reponse.data in supplier service", response.data)
			return response.data
		},
		function error(response){
			console.log("error", response)
		});
	}

	service.findOneSupplier = function(_id) {
		// console.log("Suppliers_code in service", _id)
		return $http({
			method: "GET",
			url: server_uri + "suppliers/" + _id, 
		})
	}
};

SuppliersController.$inject = ['SuppliersService'];
function SuppliersController(SuppliersService) {
	var ctrl = this;
	ctrl.supplier = supplier;


	// SupplierssController.Suppliers = SuppliersService.Suppliers;
}
