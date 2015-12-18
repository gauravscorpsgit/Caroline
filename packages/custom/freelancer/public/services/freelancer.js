'use strict';


angular.module('mean.freelancer').factory('Freelancer', ['$resource',
    function($resource) {
        return {
            compose_resource : $resource('/api/compose/register',{},{post :{method : 'POST',compose_data : '@_compose_data'},
                get : {method : 'GET',isArray: false}
            }),
            freelancer_details_resource : $resource('/api/user/freelancer/landing',{},{update :{method : 'PUT',data : '@_data'},
                get : {method : 'GET',isArray: false}
            }),
            storefront_resource : $resource('/api/user/storefront',{freelancerId :'@_freelancerId'},{
                get : {method : 'GET',isArray: false},post :{method : 'POST',data : '@_data'}
            }),
            paypal_resource : $resource('/api/user/paypalEmail',{},{
                put :{method : 'PUT',data : '@_data'}
            }),
            product_resource : $resource('/api/product/:product_id',{product_id : '@_product_id'},{
                save : {method : 'POST', data:'@_data'}
            }),
            getWorker_resource : $resource('/api/freelancer/addworker',{email_id: '@_email_id'},{
                get : {method : 'GET',isArray: false}
            }),
            getfreelancerWorker_resource : $resource('/api/freelancer/freelancerworker',{email_id: '@_email_id'},{
                get : {method : 'GET',isArray: false}
            }),
            getSearchEmail_resource :$resource('/api/freelancer/searchEmail',{searchEmail_id: '@_searchEmail_id'}, {
                get : {method: 'GET', isArray: false}
            }),
            addWorker_resource :$resource('/api/freelancer/updateWorker',{Worker_id : '@_Worker_id'}, {
                put : {method: 'PUT'}
            }),
            order_resource : $resource('/api/order',{}, {
                save : {method: 'POST', data: '@_data'},
                put : {method: 'PUT' , data: '@_data'}
            }),
            productOrder_resource :$resource('/api/freelancer/productOrder',{}, {
                put : {method: 'PUT', data: '@_data'},
                post_work_to_client : {method : 'POST', data :'@_data'}
            }),
            getClientWork_resource : $resource('/api/getClientWork',{},{
                get : {method: 'GET', isArray: false},
                approve_work : {method: 'PUT' , data: '@_data'}
            }),
            require_resource :$resource('/api/freelancer/require',{}, {
            put : {method: 'PUT', data: '@_data'}
        })
        };

    }
]);
