angular.module('speed')
.directive('login', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.login = function(modelValue, viewValue) {
      	console.log("modelValue", modelValue)
        if (modelValue){
          if (modelValue.startsWith("au")) {
            return true;
          }	
        }
        return false;
      };
    }
  };
});


