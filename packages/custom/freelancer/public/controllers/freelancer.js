'use strict';

angular.module('mean.freelancer',['ui-notification']).controller('FreelancerController', ['$scope', 'Global', 'Freelancer','Notification','$rootScope',
    function($scope, Global, Freelancer, Notification, $rootScope) {
        $scope.global = Global;
        $scope.package = {
            name: 'freelancer'
        };

        $scope.getFreelancerDetails = function(){
            Freelancer.freelancer_details_resource.get(function(response,header,error){
                if(response.success){
                    console.log(response);
                    $scope.landing_info = response.freelancer_object[0];
                    Notification.success('Freelancer details fetched');
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            });
        };

        $scope.activeTemplate = 'freelancer/views/compose_email.html';
        $rootScope.$on('openCompose', function(){
            $scope.activeTemplate = 'freelancer/views/compose_email.html';
        });

        $rootScope.$on('openInbox', function(){
            $scope.activeTemplate = 'freelancer/views/email_inbox.html';
        });''

        $rootScope.$on('free_landing_demo', function(){
            $scope.activeTemplate = 'freelancer/views/freelancer_demo_page.html';
        });


        $scope.emailForm = {
            to_user:'',
            subject:'',
            content:''
        };

        $scope.openComposePage = function(){
            $scope.activeTemplate = 'freelancer/views/compose_email.html';
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
                    maxFiles: 1
                },
                function(Blobs){
                    console.log(JSON.stringify(Blobs));
                    $scope.uploaded_files_array = Blobs;
                    $scope.uploadDone= true;
                    $scope.emailForm.content= $scope.emailForm.content +' Attachment: '+ Blobs[0].url;
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
