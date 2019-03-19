angular.module('speed')
.directive('login', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.login = function(modelValue, viewValue) {
      	// console.log("modelValue", modelValue)
        return true;
      };
    }
  };
});


