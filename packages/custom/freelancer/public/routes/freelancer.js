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
            })
            .state('payment_success', {
                url: '/payment_status_success/:order_id',
                templateUrl: 'freelancer/views/payment_success.html'
            })
            .state('payment_failed', {
                url: '/payment_status_failed/:order_id',
                templateUrl: 'freelancer/views/payment_failed.html'
            })

    }
]);
