'use strict';

angular.module('mean.freelancer').controller('FreelancerController', ['$scope', 'Global', 'Freelancer',
  function($scope, Global, Freelancer) {
    $scope.global = Global;
    $scope.package = {
      name: 'freelancer'
    };
  }
]);
