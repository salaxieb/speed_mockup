angular.module('speed')
.controller('LoginController', LoginController)
.service('LoginService', LoginService);

LoginService.$inject = ['$http'];
function LoginService($http){
	var service = this;
	// $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	service.writeLoginAndPassword = function(login, password) {
		console.log("sending user data to server")
		var body = {ipn: login,
					pass: password}
	return $http.post(server_uri + "users/", body)
		// return $http({
		// 	method: "POST",
		// 	url: server_uri + "users/",
 	// 		data: { test: 'test' } 
		// })
		// .then(
		// function successful(response){
		// 	// console.log("reponse.data in supplier service", response.data)
		// 	return response.data
		// },
		// function error(response){
		// 	console.log("error", response)
		// });
	}
};



LoginController.$inject = ['LoginService'];
function LoginController(LoginService) {
	var ctrl = this;
	
	ctrl.putLoginAndPassword = function (){
		console.log("func", LoginService.writeLoginAndPassword())
		LoginService.writeLoginAndPassword(ctrl.login, ctrl.password)
	}
	console.log(ctrl.putLoginAndPassword)
};
