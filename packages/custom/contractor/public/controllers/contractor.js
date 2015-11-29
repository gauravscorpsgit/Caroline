'use strict';

angular.module('mean.contractor').controller('ContractorController', ['$scope', 'Global', 'Contractor',
  function($scope, Global, Contractor) {
    $scope.global = Global;
    $scope.package = {
      name: 'contractor'
    };
  }
]);
