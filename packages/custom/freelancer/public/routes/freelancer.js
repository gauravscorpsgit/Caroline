'use strict';

angular.module('mean.freelancer').config(['$stateProvider',
    function($stateProvider) {

        $stateProvider.state('freelancer admin', {
            url: '/admin/freelancer',
            templateUrl: 'freelancer/views/index.html',
            resolve: {
                loggedin: function(MeanUser) {
                    return MeanUser.checkLoggedin();
                },
                isFreelancer: function(MeanUser) {
                    return MeanUser.checkFreelancer();
                }
            }
        })
        $stateProvider.state('client_work', {
            url: '/client/work',
            templateUrl: 'freelancer/views/work_approval.html',
            resolve: {
                loggedin: function(MeanUser) {
                    return MeanUser.checkLoggedin();
                },
                isContractor: function(MeanUser) {
                    return MeanUser.checkContractor();
                }
            }
        })

        $stateProvider.state('client_compose', {
            url: '/client/client_compose',
            templateUrl: 'freelancer/views/client_compose.html',
            resolve: {
                loggedin: function(MeanUser) {
                    return MeanUser.checkLoggedin();
                },
                isContractor: function(MeanUser) {
                    return MeanUser.checkContractor();
                }
            }
        })

        $stateProvider.state('client_inbox', {
            url: '/client/inbox',
            templateUrl: 'freelancer/views/clientInbox.html',
            resolve: {
                loggedin: function(MeanUser) {
                    return MeanUser.checkLoggedin();
                },
                isContractor: function(MeanUser) {
                    return MeanUser.checkContractor();
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
           /* .state('client_requirement', {
                url: '/enter_requirements/:order_id',
                templateUrl: 'freelancer/views/client_requirement.html'
            })*/
            .state('payment_failed', {
                url: '/payment_status_failed/:order_id',
                templateUrl: 'freelancer/views/payment_failed.html'
            })


    }
]);
