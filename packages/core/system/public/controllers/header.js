'use strict';

angular.module('mean.system',['ui-notification']).controller('HeaderController', ['$scope', '$rootScope', 'Menus', 'MeanUser', '$state','$location','$stateParams','Freelancer','Notification','$http','$cookies',
    function($scope, $rootScope, Menus, MeanUser, $state, $location, $stateParams, Freelancer, Notification, $http, $cookies) {

        var vm = this;

        vm.menus = {};
        vm.hdrvars = {
            authenticated: MeanUser.loggedin,
            user: MeanUser.user,
            isAdmin: MeanUser.isAdmin,
            isContractor : MeanUser.isContractor,
            isFreelancer : MeanUser.isFreelancer
        };

        $scope.saveOrder = function(id){
            $http.get('/api/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0'){
                    Freelancer.order_resource.save( {product_id : id, freelancer_id: $stateParams.freelancerId}, function(response,header, error){
                        if(response.success){
                            $scope.order_list = response.order_object;
                            Notification.success('Order is saved');
                        }
                        else{
                            Notification.error('There was an issue, Order not saved');
                        }
                    });
                }
                // Not Authenticated
                else {
                    Notification.warning('Login to proceed');
                    $cookies.put('redirect', $location.path());
                    $location.url('/auth/login');
                }
            });
        };

        $scope.getLandingObject = function(){
            //$stateParams.FreelancerId
            Freelancer.storefront_resource.get({freelancerId: $stateParams.freelancerId}, function(response,header,error){
                if(response.success){
                    Notification.success('Freelancer details updated successfully.');
                    if(response.freelancer_object.length > 0)
                    $scope.freelancer_object = response.freelancer_object[0];
                    else
                    $location.url('/')
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            });
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

                case  'paid':
                    $scope.flag = flag;
                    $scope.category = 'Email';
                    $rootScope.$broadcast('openPaid');
                    break;

                case 'free_landing_demo':
                    $scope.flag = flag;
                    $scope.category = 'Page';
                    $rootScope.$broadcast('free_landing_demo');
                    //$location.url('/freelancer/landing/demo');
                    break;

                case 'public_landing':
                    $scope.flag = flag;
                    $scope.category = 'Page';
                    $location.url('/freelancer/storefront/'+MeanUser.user._id);
                    break;

                case 'Add_CoWorker':
                    $scope.flag = flag;
                    $scope.category = 'Worker';
                    $rootScope.$broadcast('Add_CoWorker');
                    break;

                case 'Your_CoWorker':
                    $scope.flag = flag;
                    $scope.category = 'Worker';
                    $rootScope.$broadcast('Your_CoWorker');
                    break;

                case 'YourJob':
                    $scope.flag = flag;
                    $scope.category = 'Jobs';
                    $rootScope.$broadcast('YourJob');
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
