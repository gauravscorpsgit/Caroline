'use strict';

module.exports = {
    notify_contrator: function(mailOptions, data) {
        mailOptions.html = [
            '<img src="https://tm-prod.global.ssl.fastly.net/uploaded/companies/327/small_logo.png?v=c02a621135266a7af9528438d863fda5" style="width: 200px; margin: 2px;"/><br/>'+
            data.content+''
        ].join('\n\n');
        mailOptions.subject = data.subject+' [freelancer.com]';
        return mailOptions;
    },
    co_worker_Mail: function(mailOptions) {
        mailOptions.html = [
            'Hi you have been added as co-worker'
        ].join('\n\n');
        mailOptions.subject = 'New co-worker Added[freelancer.com]';
        return mailOptions;
    },
    paypalSuccess_Mail: function(mailOptions) {
        mailOptions.html = [
            'Hi your payment have been completed successfully'
        ].join('\n\n');
        mailOptions.subject = 'Payment Success';
        return mailOptions;
    },
    paypalFail_Mail: function(mailOptions) {
        mailOptions.html = [
            'Hi your payment has not been completed'
        ].join('\n\n');
        mailOptions.subject = 'Payment Failed';
        return mailOptions;
    },
    client_Mail: function(mailOptions,object) {
        mailOptions.html = [
            'Hi'+object.freelancer.name+',<br><br>'+object.contractor+ 'has just sent you the requirements, please go through it mentioned below: <br><br>'+object.clientreqire.description+'.<br><br>Reagrds:<br>'+object.contractor
        ].join('\n\n');
        mailOptions.subject = 'Hi '+object.freelancer.name+'! You have received the requirements from order #'+object.orderId+'.';
        return mailOptions;
    },
    deliverable_notify: function(mailOptions, object) {
        mailOptions.html = [
            'Hi '+object.customer.name+',<br><br>'+object.freelancer.name+' has submitted the work.<br><br>Kindly download the work from <a href="'+object.deliverable.url+'">Here</a><br/><br/>' +
            'Please go through the work and approve it <a href="http://localhost:3000/client/work">here</a>.<br><br>Regards:<br>Admin'
        ].join('\n\n');
        mailOptions.subject = 'Hi Five! Work submission for order #'+object.order._id;
        return mailOptions;
    }
};
