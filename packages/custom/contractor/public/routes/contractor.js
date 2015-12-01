'use strict';

angular.module('mean.contractor').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('contractor', {
      url: '/contractor',
      templateUrl: 'contractor/views/index.html'
    });
  }
]);
