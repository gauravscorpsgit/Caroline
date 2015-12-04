'use strict';

angular.module('mean.freelancer',['ui-notification']).controller('FreelancerController', ['$scope', 'Global', 'Freelancer','Notification','$rootScope',
    function($scope, Global, Freelancer, Notification, $rootScope) {
        $scope.global = Global;
        $scope.package = {
            name: 'freelancer'
        };

        $scope.landing_editable = false;
        $scope.enableChanges = function(){
            $scope.landing_editable = !$scope.landing_editable;
        };

        $scope.addSkills = function(){
            var skill ={name : 'New Skill', percentage:50};
            $scope.landing_info.user_skills.push(skill);
        };

        $scope.removeSkill = function(index){
            $scope.landing_info.user_skills.splice( index, 1 );
        };


        $scope.updateFreelancerLanding = function(){
            Freelancer.freelancer_details_resource.update($scope.landing_info,function(response,header,error){
                if(response.success){
                    Notification.success('Freelancer details updated successfully.');
                    $scope.landing_editable = false;
                    $scope.$apply();
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            });
        };

        $scope.getFreelancerDetails = function(){
            Freelancer.freelancer_details_resource.get(function(response,header,error){
                if(response.success){
                    $scope.landing_info = response.freelancer_object[0];
                    if($scope.landing_info.user_intro.profile_image.indexOf('filepicker.io') > -1)
                        $scope.landing_info.user_intro.profile_image = $scope.landing_info.user_intro.profile_image;
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

        $scope.portfolio_skeleton = {
            title : '',
            image : ''
        };

        $scope.pushFirstPortfolio = function(){
            if($scope.portfolio_skeleton.title.length > 0 && $scope.portfolio_skeleton.image.length > 0){
                $scope.landing_info.portfolio.push($scope.portfolio_skeleton);
                Notification.success('Save changes to make the persistent.');
                $scope.$apply();
            }
        };

        $scope.removePortfolio = function(index){
            $scope.landing_info.portfolio.splice(index, 1);
        };


        $scope.openPortfolioPicDialog = function(index, is_intial){
            filepicker.setKey("ARoCfO2mWS1yDsyxtUsZPz");
            filepicker.pickMultiple(
                {
                    imageMax: [600 , 600],
                    imageMin: [200, 200],
                    maxFiles: 1
                },
                function(Blobs){
                    console.log(JSON.stringify(Blobs));
                    if(is_intial){
                        $scope.portfolio_skeleton.image = Blobs[0].url;
                    }
                    $scope.$apply();
                },
                function(error){
                    console.log(JSON.stringify(error));
                }
            );
        };

        $scope.openProfilePicDialog = function(){
            filepicker.setKey("ARoCfO2mWS1yDsyxtUsZPz");
            filepicker.pickMultiple(
                {
                    imageMax: [600 , 600],
                    imageMin: [200, 200],
                    maxFiles: 1

                },
                function(Blobs){
                    console.log(JSON.stringify(Blobs));
                    $scope.landing_info.user_intro.profile_image = Blobs[0].url;
                    $scope.$apply();
                },
                function(error){
                    console.log(JSON.stringify(error));
                }
            );
        }


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
