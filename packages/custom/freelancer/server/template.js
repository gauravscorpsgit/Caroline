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
