'use strict';

angular.module('mean.freelancer',['ui-notification','angucomplete-alt']).controller('FreelancerController', ['$scope', 'Global', 'Freelancer','Notification','$rootScope','$stateParams','$location','$cookies','$timeout',
    function($scope, Global, Freelancer, Notification, $rootScope, $stateParams, $location, $cookies, $timeout) {
        $scope.global = Global;
        $scope.package = {
            name: 'freelancer'
        };

        $scope.landing_editable = false;
        $scope.enableChanges = function(){
            $scope.landing_editable = !$scope.landing_editable;
        };

        this.getClientWork = function(){
            Freelancer.getClientWork_resource.get(function(response, error, header){
                if(response.success){
                    Notification.success('Project history fetched successfully.');
                    $scope.orders_client = {myorders : [], freelancer :[], products :[]};
                    var client_product_object_array = [];
                    var client_freelancer_object_array = [];

                    for(var j = 0; j<response.my_orders.length; j=j+1 ) {
                        for (var i = 0; i < response.purchased_products.length; i = i + 1) {
                            if (response.purchased_products[i]._id == response.my_orders[j].product_id) {
                                client_product_object_array.push(response.purchased_products[i]);
                            }
                        }
                        for (var k = 0; k < response.my_freelancer.length; k = k + 1) {
                            if (response.my_freelancer[k]._id == response.my_orders[j].freelancer_id) {
                                client_freelancer_object_array.push(response.my_freelancer[k]);
                            }
                        }
                    }

                    $scope.orders_client.myorders = response.my_orders;
                    $scope.orders_client.freelancer = client_freelancer_object_array;
                    $scope.orders_client.products = client_product_object_array;

                }else{
                    Notification.error('No work history found. Please try again.');
                }
            });
        };


        this.approveWork = function(order_id,index){

            Freelancer.getClientWork_resource.approve_work({order_id : order_id}, function(response, error, header){
                if(response){
                    $scope.orders_client.myorders[index].approval_status = true;
                    Notification.success('Order has been marked approved.');

                }else{
                    Notification.error('There was issue please try again.');
                }
            });

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
                    $scope.Freelancer_list = response.freelancer_object;
                }
                else{
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

        this.clienEmail_search = function(){
            Freelancer.getclienEmail_resource.get(function(response,header,error){
                if(response.success){
                    console.log(response);
                    $scope.freelancer_list = {data:response.Freelancer_list};
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
            $scope.activeTemplate = 'freelancer/views/email_sent.html';
        });

        $rootScope.$on('sentInbox', function(){
            $scope.activeTemplate = 'freelancer/views/email_inbox.html';
        });

        $rootScope.$on('openPaid', function(){
            $scope.activeTemplate = 'freelancer/views/paypal.html';
        });

        $rootScope.$on('free_landing_demo', function(){
            $scope.activeTemplate = 'freelancer/views/freelancer_demo_page.html';
        });

        $rootScope.$on('public_landing', function(){
            $scope.activeTemplate = 'freelancer/views/freelancer_landing_custom.html';
        });

        $rootScope.$on('Your_CoWorker', function(){
            $scope.activeTemplate = 'freelancer/views/coworkers.html';
        });

        $rootScope.$on('YourJob', function(){
            $scope.activeTemplate = 'freelancer/views/yourJob.html';
        });

        $rootScope.$on('public_landing', function(){
            $scope.activeTemplate = 'freelancer/views/freelancer_landing.html';
        });


        $scope.emailForm = {
            to_user:'',
            subject:'',
            content:'',
            reciepient_id:''
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

        $scope.getClientInbox = function(){
            Freelancer.ClientInbox_resource.get(function(response,header,error) {
                if(response.success){

                    $scope.user_emails = response.client_inbox;
                    console.log(response);
                    Notification.success('Emails fetched successfully');
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            });

        };

        $scope.getSentMessage = function(){
            Freelancer.sentMessage_resource.get(function(response,header,error) {
                if(response.success){

                    $scope.user_emails = response.sent_emails;
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
            filepicker.setKey("ASPabrYriTquKmXg2Zg8Az");
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
            filepicker.setKey("ASPabrYriTquKmXg2Zg8Az");
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
            filepicker.setKey("ASPabrYriTquKmXg2Zg8Az");
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
            filepicker.setKey("ASPabrYriTquKmXg2Zg8Az");
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



        $scope.openRequirementDialog = function(){
            filepicker.setKey("ASPabrYriTquKmXg2Zg8Az");
            filepicker.pickMultiple(
                {
                    imageMax: [600 , 600],
                    imageMin: [200, 200],
                    maxFiles: 1
                },
                function(Blobs){
                    console.log(JSON.stringify(Blobs));
                    $scope.uploaded_files_array = Blobs;
                    $scope.uploadDone = true;
                    $scope.emailAttachment = Blobs[0].url;
                    $scope.$apply();

                },
                function(error){
                    console.log(JSON.stringify(error));
                }
            );
        }





        $scope.email_form = function(email_auto, reciepient_id){
            $scope.emailForm.to_user = email_auto;
    $scope.emailForm.reciepient_id=  reciepient_id;

            console.log($scope.emailForm);
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


        $scope.emailClientForm = {
            to_user:'',
            subject:'',
            content:''

        };


        this.emailClient_form = function(email_auto){
            $scope.emailClientForm.to_user = email_auto;


            console.log($scope.emailClientForm);
            Freelancer.getclienEmail_resource.post($scope.emailClientForm, function(response,header,error) {
                if(response.success){
                    Notification.success('Email has been saved and sent to '+ email_auto);
                    $scope.emailClientForm.to_user='';
                    $scope.emailClientForm.subject='';
                    $scope.emailClientForm.content='';


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
                    // $scope.coWorker_object = response.freelancer_object;
                    $scope.postCoworker(response.freelancer_object[0].coworkers)
                    Notification.success('coworker details added successfully.');

                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            })



        };

        $scope.postCoworker = function(coworkers){
            console.log(coworkers);
            Freelancer.storefront_resource.post({coWorker_array :coworkers},function(response,header,error){
                if(response.success){
                    console.log(response);
                    $scope.coworkers_list = response.coworker_objects_arr;
                    Notification.success('coworker details post successfully.');

                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            })
        };

        $scope.paypal = {
            email :''
        };

        $scope.postPaypalEmail = function(){
            Freelancer.paypal_resource.put($scope.paypal, function(response,header,error){
                if(response.success){
                    Notification.success('paypal email_id post successfully.');
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            })
        };

        $scope.getPaypalFail = function(){
            Freelancer.order_resource.put({state: 'Failed', order_id: $stateParams.order_id}, function(response,header,error){
                if(response.success){
                    Notification.success('Your payment has been failed');
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            })
        };

        $scope.getPaypalSuccess = function(){
            Freelancer.order_resource.put({state: 'Success', order_id: $stateParams.order_id}, function(response,header,error){
                if(response.success){
                    Notification.success('Your payment has been completed');
                    /*$cookies.put('redirect', '/enter_requirements');
                     $location.url('/enter_requirements');*/

                    $scope.orderObject = response.order_object;
                    $timeout(function(){
                        $scope.requirement_initial = true;
                    },1000);

                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            })
        };



        $scope.clientReqiuire = {
            description:''
        };
        $scope.sendRequirement =function(freelancer_id){

            Freelancer.require_resource.put({clientAttach :$scope.emailAttachment, freelancer_id:freelancer_id ,client_Des: $scope.clientReqiuire, order_id: $stateParams.order_id}, function(response,header,error){
                if(response.success){
                    Notification.success('Mail send successfully');
                }
                else{
                    Notification.error('Mail not send, Please try again');
                }
            })
        };

        $scope.getOrderUpdate = function(){

        };

        var fm = this;
        $scope.getProductId = function(){
            Freelancer.productOrder_resource.put(function(response,header,error){
                if(response.success){
                    Notification.success('Successfully found.');
                    $scope.orders = {orders : [], customers :[], products :[]}
                    var product_object_array = [];
                    var customers_object_array = [];

                    for(var j = 0; j<response.my_orders.length; j=j+1 ) {
                        for (var i = 0; i < response.purchased_products.length; i = i + 1) {
                            if (response.purchased_products[i]._id == response.my_orders[j].product_id) {
                                product_object_array.push(response.purchased_products[i]);
                            }
                        }
                        for (var k = 0; k < response.my_customers.length; k = k + 1) {
                            if (response.my_customers[k]._id == response.my_orders[j].customer_id) {
                                customers_object_array.push(response.my_customers[k]);
                            }
                        }
                    }

                    $scope.orders.orders = response.my_orders;
                    $scope.orders.customers = customers_object_array;
                    $scope.orders.products = product_object_array;
                }
                else{
                    Notification.error('There was an issue, Please try again');
                }
            })
        };

        this.clientEmailCompose= function(){
            $location.url('/client/client_compose');
        };

        $scope.submitWork = function(oid, index){
            filepicker.setKey("ASPabrYriTquKmXg2Zg8Az");
            filepicker.pickMultiple(
                {
                    imageMax: [600 , 600],
                    imageMin: [200, 200],
                    maxFiles: 1
                },
                function(Blobs){
                    console.log(JSON.stringify(Blobs));
                    Freelancer.productOrder_resource.post_work_to_client({work_url : Blobs[0].url, order_id: oid}, function(response,header,error){
                        if(response.success){
                            Notification.success('Work has been submission successfully.');
                            $scope.orders.orders[index].deliverables.push(response.deliverable);
                        }
                        else{
                            Notification.error('Work submission failed. Try again later.');
                        }
                    });
                    $scope.$apply();
                },
                function(error){
                    console.log(JSON.stringify(error));
                }
            );

        };

    }]);
