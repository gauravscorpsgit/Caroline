'use strict';

module.exports = {
    notify_contrator: function(mailOptions, data) {
        mailOptions.html = [
            '<img src="https://tm-prod.global.ssl.fastly.net/uploaded/companies/327/small_logo.png?v=c02a621135266a7af9528438d863fda5" style="width: 200px; margin: 2px;"/><br/>'+
            data.content+''
        ].join('\n\n');
        mailOptions.subject = data.subject+' [freelancer.com]';
        return mailOptions;
    }
};

module.exports = {
    co_worker_Mail: function(mailOptions) {
        mailOptions.html = [
            'Hi you have been added as co-worker'
        ].join('\n\n');
        mailOptions.subject = 'New co-worker Added[freelancer.com]';
        return mailOptions;
    }
};

module.exports = {
    paypalSuccess_Mail: function(mailOptions) {
        mailOptions.html = [
            'Hi your payment have been completed successfully'
        ].join('\n\n');
        mailOptions.subject = 'Payment Success';
        return mailOptions;
    }
};

module.exports = {
    paypalFail_Mail: function(mailOptions) {
        mailOptions.html = [
            'Hi your payment has not been completed'
        ].join('\n\n');
        mailOptions.subject = 'Payment Failed';
        return mailOptions;
    }
};
