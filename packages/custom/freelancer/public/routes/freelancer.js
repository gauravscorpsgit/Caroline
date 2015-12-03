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
            /*.state('freelancer_demo_page', {
                url: '/freelancer/landing/demo',
                templateUrl: 'freelancer/views/freelancer_demo_page.html',
                resolve: {
                    loggedin: function(MeanUser) {
                        return MeanUser.checkLoggedin();
                    }
                }
            });*/
    }
]);
