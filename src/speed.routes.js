angular.module('speed')
.config(RouterConfig);

RouterConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function RouterConfig($stateProvider, $urlRouterProvider) {

  var loginState = {
    name: 'login',
    url: '/login',
    templateUrl: 'templates/login.template.html',
    controller: 'LoginController as ctrl'
  }

  var clientsState = {
    name: 'clients',
    url: '/clients',
    templateUrl: 'templates/clients.template.html',
    controller: 'ClientsController as ctrl',
    resolve: {
      clients: ['ClientsService', function(ClientsService){
        console.log('ClientsService.clients', ClientsService.clients)
        return ClientsService.clients
      }],
    }
  }

  var clientState = {
    name: 'client',
    url: '/clients/:client_code',
    templateUrl: 'templates/client.template.html',
    controller: 'ClientController as ctrl',
    resolve: {
      client: ['ClientService', '$stateParams', function (ClientService, $stateParams){
        return ClientService.client($stateParams.client_code)
      }]}
  }

  var supplierState = {
    name: 'supplier',
    url: '/suppliers/:supplier_code',
    templateUrl: 'templates/supplier.template.html',
    controller: 'SupplierController as ctrl',
    resolve: {
      supplier: ['SupplierService', '$stateParams', function (SupplierService, $stateParams){
        return SupplierService.supplier($stateParams.supplier_code)
      }]}
  }

  // var dossier_historyState = {
  //   name: 'supplier.dossier_history',
  //   url: 'suppliers/{supplier_code}/dossier_history',
  //   templateUrl: 'templates/dossier_history.template.html'
  // }

  var supplier_updateState = {
    name: 'supplier.update',
    url: '/update',
    // controller: 'SupplierController as ctrl',
    // controller: 'SupplierUpdateController as ctrl',
    templateUrl: 'templates/supplier.update.template.html'
  }

  $urlRouterProvider.otherwise('/login');

  $stateProvider.state(loginState);
  $stateProvider.state(clientsState);
  $stateProvider.state(clientState);
  $stateProvider.state(supplierState);
  // $stateProvider.state(dossier_historyState);
  $stateProvider.state(supplier_updateState);

};
