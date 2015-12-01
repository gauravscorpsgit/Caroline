'use strict';

angular.module('mean.freelancer',['ui-notification']).controller('FreelancerController', ['$scope', 'Global', 'Freelancer','Notification',
  function($scope, Global, Freelancer, Notification) {
    $scope.global = Global;
    $scope.package = {
      name: 'freelancer'
    };

    $scope.emailForm = {
      to_user:document.getElementById('email-to'),
      subject:'',
      content:document.getElementById('wysihtml5')
    };


    $scope.email_form = function(){
      console.log($scope.emailForm);
      Freelancer.compose_resource.post($scope.emailForm, function(response,header,error) {
        if(response.success){
          Notification.success('Email is subbmited');
        }

        else{
          Notification.error('There was an issue, Please try again');
        }
      })
    };
  }]);
