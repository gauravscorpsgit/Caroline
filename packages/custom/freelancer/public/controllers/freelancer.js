'use strict';

angular.module('mean.freelancer',['ui-notification','angucomplete-alt']).controller('FreelancerController', ['$scope', 'Global', 'Freelancer','Notification','$rootScope','$stateParams',
    function($scope, Global, Freelancer, Notification, $rootScope, $stateParams) {
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


        $scope.Search_initial = true;
        $scope.Search_success = true;
        /*$scope.worker = {email:};*/
        $scope.getCoworker = function(email){
            $scope.Search_initial = true;
            $scope.Search_success = true;
            Freelancer.getWorker_resource.get({email : email}, function(response,header,error){
                if(response.success){
                    $scope.Search_initial = false;
                    console.log(response);
                    $scope.Freelancer_list = response.freelancer_object;
                }
                else{
                    console.log('there is an issue');
                    $scope.Search_success = false;
                }
            })
        };

        $scope.getFreelancersId = function(){
            Freelancer.getfreelancerWorker_resource.get(function(response,header,error){
                if(response.success){
                    $scope.Freelancer_list = {data:response.freelancer_object};
                }
                else{
                    Notification.error('No contractors found, Please try again');
                }
            })
        };


        $scope.addWorker =function(id, email){
            Freelancer.addWorker_resource.put({freelancer_id:id, freelancer_email:email}, function(response,header,error) {
                if(response.success){
                    if( response.status == 1)
                        Notification.warning('Freelancer already added as Co-Worker');
                    else
                        Notification.success('Freelancer added as your Co-worker');
                    $scope.activeTemplate = 'freelancer/views/add_worker.html';
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            })

        };


        $scope.email_search = function(){
            Freelancer.getSearchEmail_resource.get(function(response,header,error){
                if(response.success){
                    $scope.contractors_list = {data:response.contrator_list};
                }
                else{
                    Notification.error('No contractors found, Please try again');
                }
            })
        };

        $scope.updateFreelancerLanding = function(){
            Freelancer.freelancer_details_resource.update($scope.landing_info,function(response,header,error){
                if(response.success){
                    Notification.success('Freelancer details updated successfully.');
                    $scope.landing_editable = false;
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

        $rootScope.$on('Add_CoWorker', function(){
            $scope.activeTemplate = 'freelancer/views/add_worker.html';
        });

        $rootScope.$on('Your_CoWorker', function(){
            $scope.activeTemplate = 'freelancer/views/coworkers.html';
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
                    console.log(response);
                    Notification.success('Emails fetched successfully');
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            });

        };



        $scope.saveOrder = function(id){
            Freelancer.order_resource.save( {product_id : id}, function(response,header, error){
                if(response.success){
                   $scope.order_list = response.order_object;
                    Notification.success('Order is saved');
                }
                else{
                    Notification.error('There was an issue, Order not saved');
                }


            });
        };

        $scope.product_skeleton = {
            title : '',
            description:'',
            image : '',
            price : ''

        };



        $scope.pushFirstProduct = function(){
            if($scope.product_skeleton.title.length > 0 && $scope.product_skeleton.image.length > 0 && $scope.product_skeleton.description.length > 0  && $scope.product_skeleton.price.length != 0){
                /* $scope.landing_info.products.push();
                 Notification.success('Save changes to make the persistent.');*/

                Freelancer.product_resource.save($scope.product_skeleton, function(response,header, error){
                    if(response.success){
                        $scope.landing_info.products.push(response.product_object);
                        Notification.success('Service created, save changes to make the persistent.');
                    }
                    else{
                        Notification.error('There was an issue, Please try again');
                    }


                });
            }
        };
        $scope.removeProduct = function(index){
            $scope.landing_info.products.splice(index, 1);
        };


        $scope.openProductPicDialog = function(index, is_intial){
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
                        $scope.product_skeleton.image = Blobs[0].url;
                    }
                    $scope.$apply();
                },
                function(error){
                    console.log(JSON.stringify(error));
                }
            );
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


        $scope.email_form = function(email_auto){
            $scope.emailForm.to_user = email_auto;
            Freelancer.compose_resource.post($scope.emailForm, function(response,header,error) {
                if(response.success){
                    Notification.success('Email has been saved and sent to '+ email_auto);
                    $scope.emailForm.to_user='';
                    $scope.emailForm.subject='';
                    $scope.emailForm.content='';
                }

                else{
                    Notification.error('There was an issue, Please try again');
                }
            })
        };


        $scope.getYourCoworker = function(){
            Freelancer.storefront_resource.get(function(response,header,error){
                if(response.success){
                    console.log(response);
                    $scope.coWorker_object = response.freelancer_object;
                    Notification.success('coworker details added successfully.');

                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            })
        };


    }]);
