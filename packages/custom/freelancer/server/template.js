'use strict';

module.exports = {
    notify_contrator: function(mailOptions, data) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+
            data.content+''
        ].join('\n\n');
        mailOptions.subject = data.subject;
        return mailOptions;
    },
    notify_freelancer: function(mailOptions, data) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+
            data.content+''
        ].join('\n\n');
        mailOptions.subject = data.subject;
        return mailOptions;
    },

    co_worker_Mail: function(mailOptions) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+

            'Hi, you have been added as co-worker.<br><br><a href="http://perfect.agency">http://perfect.agency</a>'
        ].join('\n\n');
        mailOptions.subject = 'New Co-Worker Added';
        return mailOptions;
    },
    paypalSuccess_Mail: function(mailOptions) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+

            'Hi your payment have been completed successfully.<br><br><a href="http://perfect.agency">http://perfect.agency</a>'
        ].join('\n\n');
        mailOptions.subject = 'Paypal  Payment Success';
        return mailOptions;
    },
    paybackSuccess_Mail: function(mailOptions,object) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+
            'Hi Perfect Agency your payment have been received successfully from '+object.freelancer_name+' for OrderId # '+object.orderID+'.<br><br><a href="http://perfect.agency">http://perfect.agency</a>'
        ].join('\n\n');
        mailOptions.subject = 'Payback Success';
        return mailOptions;
    },

    Success_Mail: function(mailOptions,object) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+
            'Hey, glad to see you have had some sales this week. Please pay $'+object.pay+' to help us keep this platform running & growing. This is just 7% of the sales we have processed through perfect.agency for you this week.'+
            'Kind Regards:<br>Perfect Agency<br><a href="http://perfect.agency">http://perfect.agency</a>'
        ].join('\n\n');
        mailOptions.subject = 'Payment to Perfect Agency';
        return mailOptions;
    },
    paypalFail_Mail: function(mailOptions) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+

            'Hi, your payment has not been completed, Please try again.<br><br><a href="http://perfect.agency">http://perfect.agency</a>'
        ].join('\n\n');
        mailOptions.subject = 'Paypal  Payment Failed';
        return mailOptions;
    },
    client_Mail: function(mailOptions,object) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+
            'Hi '+object.freelancer.name+',<br><br>'+object.contractor+ ' has just sent you the requirements, please go through it mentioned below: <br><br>'+object.clientrequire+'.<br><br>Kind Regards:<br>'+object.contractor+'<br><a href="http://perfect.agency">http://perfect.agency</a>'
        ].join('\n\n');
        mailOptions.subject = 'Hi '+object.freelancer.name+'! You have received the requirements from order #'+object.orderId+'.';
        return mailOptions;
    },
    deliverable_notify: function(mailOptions, object) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+

            'Hi '+object.customer.name+',<br><br>'+object.freelancer.name+' has submitted the work.<br><br>Kindly download the work from <a href="'+object.deliverable.url+'">Here</a><br/><br/>' +
            'Please go through the work and approve it <a href="http://localhost:3000/client/work">here</a>.<br><br>Kind Regards:<br>Perfect Agency<br><a href="http://perfect.agency">http://perfect.agency</a>'
        ].join('\n\n');
        mailOptions.subject = 'Hi Five! Work submission for order #'+object.order._id;
        return mailOptions;
    },
    work_approval: function(mailOptions, object) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+

            'Hi '+object.freelancer.name+',<br><br>'+object.customer.name+' has approved your work for order #'+object.order._id+'<br/><br/>' +
            'Kind Regards:<br>Perfect Agency<br><a href="http://perfect.agency">http://perfect.agency</a>'
        ].join('\n\n');
        mailOptions.subject = 'Hi Five! Your has been approved for order #'+object.order._id;
        return mailOptions;
    },
    notify_payback: function(mailOptions, object) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+
            'Hi '+object.freelancer.name+',<br><br>Hey, glad to see you have had some sales this week. Kindly pay from your dashboard to help us keep this platform growing.<br><br>' +
            'Kind Regards:<br>Perfect Agency<br><a href="http://perfect.agency">http://perfect.agency</a>'
        ].join('\n\n');
        mailOptions.subject = 'Keep Perfect Agency going.....';
        return mailOptions;
    },
    storefront_blocked_notify : function(mailOptions, object) {
        mailOptions.html = [
            '<img src="http://perfect.agency/system/assets/theme/landing/img/logo.jpg" style="width: 200px; margin: 2px;"/><br/>'+
            'Hi '+object.freelancer.name+',<br><br>Hey, your storefront has been stopped. Please pay to get it back. It’s just 7% of your sales from last week.<br><br>If you are having any questions or need help please send us an email on help@perfect.agency.<br><br>' +
            'Kind Regards:<br>Perfect Agency<br><a href="http://perfect.agency">http://perfect.agency</a>'
        ].join('\n\n');
        mailOptions.subject = 'Please clear balance to keep your store running.';
        return mailOptions;
    }
};
