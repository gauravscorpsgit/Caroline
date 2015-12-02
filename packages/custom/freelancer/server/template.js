'use strict';

module.exports = {
    dish_captured_mail: function(mailOptions, user, dish) {
        mailOptions.html = [
            '<img src="http://ec2-54-68-194-54.us-west-2.compute.amazonaws.com:3000/system/assets/img/logo.png"style="width: 200px; margin: 2px;"/><br/>'+
            'Hi Chef '+dish.chef_name+',<br/><br/> Your dish has been successfully added and is under review, we will get back to you within 24 hours with dish approval status.'+
            '<br/><br/>Regards:<br/>Team ChefMother<br/>Reach Us At: care@chefmother.com'
        ].join('\n\n');
        mailOptions.subject = 'Your dish '+dish.title+' captured notification';
        return mailOptions;
    }
};
