'use strict';

angular.module('mean.freelancer').factory('Freelancer', ['$resource',
  function($resource) {
    return {
      compose_resource : $resource('/api/compose/register',{},{post :{method : 'POST',compose_data : '@_compose_data'}})
    };
  }
]);