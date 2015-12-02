'use strict';

angular.module('mean.freelancer',['ui-notification']).controller('FreelancerController', ['$scope', 'Global', 'Freelancer','Notification','$rootScope',
    function($scope, Global, Freelancer, Notification, $rootScope) {
        $scope.global = Global;
        $scope.package = {
            name: 'freelancer'
        };

        $scope.activeTemplate = 'freelancer/views/compose_email.html';
        $rootScope.$on('openCompose', function(){
            $scope.activeTemplate = 'freelancer/views/compose_email.html';
        });

        $rootScope.$on('openInbox', function(){
            $scope.activeTemplate = 'freelancer/views/email_inbox.html';
        });


        $scope.emailForm = {
            to_user:'',
            subject:'',
            content:''
        };

        $scope.getInboxMessage = function(){
            Freelancer.compose_resource.get(function(response,header,error) {
                if(response.success){
                    $scope.user_emails = response.emails;
                    Notification.success('Emails fetched successfully');
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            });

        };

        $scope.openUploadDialog = function(){
            filepicker.setKey("ARoCfO2mWS1yDsyxtUsZPz");
            filepicker.pickMultiple(
                {
                    imageMax: [600 , 600],
                    imageMin: [200, 200],
                    maxFiles: 4
                },
                function(Blobs){
                    console.log(JSON.stringify(Blobs));
                    $scope.uploaded_files_array = Blobs;
                    $scope.uploadDone= true;
                    $scope.$apply();
                },
                function(error){
                    console.log(JSON.stringify(error));
                }
            );
        }

        $scope.email_form = function(){
            Freelancer.compose_resource.post($scope.emailForm, function(response,header,error) {
                if(response.success){
                    Notification.success('Email has been saved and sent to '+ $scope.emailForm.to_user);

                    $scope.emailForm.to_user='';
                    $scope.emailForm.subject='';
                    $scope.emailForm.content='';
                }

                else{
                    Notification.error('There was an issue, Please try again');
                }
            })
        };
    }]);
