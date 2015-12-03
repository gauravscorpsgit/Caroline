'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Menus', 'MeanUser', '$state','$location',
    function($scope, $rootScope, Menus, MeanUser, $state, $location) {

        var vm = this;

        vm.menus = {};
        vm.hdrvars = {
            authenticated: MeanUser.loggedin,
            user: MeanUser.user,
            isAdmin: MeanUser.isAdmin,
            isContractor : MeanUser.isContractor,
            isFreelancer : MeanUser.isFreelancer
        };


        vm.openFreelancerBlock = function(flag){
            $location.url('/admin/freelancer');
            switch (flag){
                case  'compose':
                    $scope.flag = flag;
                    $scope.category = 'Email';
                    $rootScope.$broadcast('openCompose');

                    break;

                case  'inbox':
                    $scope.flag = flag;
                    $scope.category = 'Email';
                    $rootScope.$broadcast('openInbox');
                    break;

                case 'free_landing_demo':
                    $scope.flag = flag;
                    $scope.category = 'Page';
                    $rootScope.$broadcast('free_landing_demo');
                    //$location.url('/freelancer/landing/demo');
                    break;
            }
        };

        // Default hard coded menu items for main menu
        var defaultMainMenu = [];

        // Query menus added by modules. Only returns menus that user is allowed to see.
        function queryMenu(name, defaultMenu) {

            Menus.query({
                name: name,
                defaultMenu: defaultMenu
            }, function(menu) {
                vm.menus[name] = menu;
            });
        }

        // Query server for menus and check permissions
        queryMenu('main', defaultMainMenu);
        queryMenu('account', []);


        $scope.isCollapsed = false;

        $rootScope.$on('loggedin', function() {
            queryMenu('main', defaultMainMenu);

            vm.hdrvars = {
                authenticated: MeanUser.loggedin,
                user: MeanUser.user,
                isAdmin: MeanUser.isAdmin,
                isContractor : MeanUser.isContractor,
                isFreelancer : MeanUser.isFreelancer
            };
        });

        vm.logout = function(){
            MeanUser.logout();
        };

        $rootScope.$on('logout', function() {
            vm.hdrvars = {
                authenticated: false,
                user: {},
                isAdmin: false
            };
            queryMenu('main', defaultMainMenu);
            $state.go('home');
        });

    }
]);
