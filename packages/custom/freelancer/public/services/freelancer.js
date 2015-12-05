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
                get : {method : 'GET',isArray: false}
            }),
            product_resource : $resource('/api/product/:product_id',{product_id : '@_product_id'},{
                save : {method : 'POST', data:'@_data'}
            })
        };
    }
]);
