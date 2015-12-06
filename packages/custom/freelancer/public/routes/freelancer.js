'use strict';

angular.module('mean.freelancer').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('freelancer admin', {
            url: '/admin/freelancer',
            templateUrl: 'freelancer/views/index.html',
            resolve: {
                loggedin: function(MeanUser) {
                    return MeanUser.checkLoggedin();
                }
            }
        })
            .state('freelancer_landing_page', {
                url: '/freelancer/storefront/:freelancerId',
                templateUrl: 'freelancer/views/freelancer_landing.html'
            });

    }
]);
