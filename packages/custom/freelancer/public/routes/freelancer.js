'use strict';

angular.module('mean.freelancer').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('freelancer admin', {
      url: '/admin/freelancer',
      templateUrl: 'freelancer/views/index.html'
    });
  }
]);
