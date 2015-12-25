/**
 * Created by akhil on 01-12-2015.
 */

'use strict';

var mongoose = require('mongoose'),
    FreelancerEmailsSchema = mongoose.model('freelancer_emails'),
    UserSchema = mongoose.model('User'),
    ProductSchema = mongoose.model('freelancer_products'),
    Freelancer_DetailsSchema = mongoose.model('freelancer_landing'),
    OrderSchema = mongoose.model('freelancer_order'),
    mean = require('meanio'),
    nodemailer = require('nodemailer'),
    templates = require('../template'),
    config = require('meanio').loadConfig(),
    _ = require('lodash'),
    schedule = require('node-schedule');


var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(5)];
rule.hour = 0;
rule.minute = 5;

var remind_payback = schedule.scheduleJob(rule, function(){
    OrderSchema.find({paybackStatus : false}, function(err,res){
        if(err){
            console.log(err);
        }else{
            var freelancer_id_array = [];
            for (var i =0; i<res.length; i=i+1){
                freelancer_id_array.push(res[i].freelancer_id);
            }
            UserSchema.find({'_id': { $in: freelancer_id_array}}, function(err, freelancers){
                if(err){
                    console.log(err)
                }else{

                    var freelancer_email_array = [];
                    for (var i =0; i<freelancers.length; i=i+1){
                        var mailOptions = {
                            to: freelancers[i].email,
                            bcc: config.emailFrom,
                            from: config.emailFrom
                        };


                        var email_content ={
                            order: res[i],
                            freelancer : freelancers[i]
                        }

                        mailOptions = templates.notify_payback(mailOptions,email_content);
                        sendMail(mailOptions);

                    }

                }
            })

        }

    });

});


exports.render = function(req, res) {
    res.render('index');
};

exports.getUserSentEmails = function(req,resMain){

    FreelancerEmailsSchema.find({user_id : req.user._id}, function(err,res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        } else{
            resMain.json({success: true, emails : res});
        }
    }).sort({ created: -1 });
};
exports.getSentInbox = function(req,resMain){
    FreelancerEmailsSchema.find({reciepient_id: req.body.reciepient_id, from : 'contractor'}, function(err,res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        } else{
            resMain.json({success: true, sent_emails : res});
        }
    }).sort({ created: -1 });
};

exports.getClient_Inbox = function(req,resMain){
    FreelancerEmailsSchema.find({reciepient_id:req.body.reciepient_id, from : 'freelancer'}, function(err,res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        } else{
            resMain.json({success: true, client_inbox : res});
        }
    }).sort({ created: -1 });
};



exports.createFreelancerProduct = function(req,resMain){
    req.body.user_id = req.user._id;
    req.body.username = req.user.name;

    var product_db = new ProductSchema(req.body);
    product_db.save(function(err,res) {
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else
        {
            resMain.json({success: true, product_object : res});
        }
    })
};

exports.createEmail = function(req,resMain){

    var composeObject ={
        user_id : req.user._id,
        reciepient_id : req.body.reciepient_id,
        to_user :req.body.to_user,
        subject:req.body.subject,
        content:req.body.content,
        from:'freelancer'
    };
    var freelancer_db = new FreelancerEmailsSchema(composeObject);
    freelancer_db.save(function(err,res) {
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else
        {
            resMain.json({success: true});
            var mailOptions = {
                to: req.body.to_user,
                from: config.emailFrom
            };
            mailOptions = templates.notify_contrator(mailOptions,req.body);
            sendMail(mailOptions);
        }
    })
};



exports.postClienEmail = function(req,resMain){

    var composeObject ={
        user_id : req.user._id,

        to_user :req.body.to_user,
        subject:req.body.subject,
        content:req.body.content,
        from:'contractor'
    };
    var freelancer_db = new FreelancerEmailsSchema(composeObject);
    freelancer_db.save(function(err,res) {
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else
        {
            resMain.json({success: true});
            var mailOptions = {
                to: req.body.to_user,
                from: config.emailFrom
            };
            mailOptions = templates.notify_freelancer(mailOptions,req.body);
            sendMail(mailOptions);

            console.log(res);
        }
    })
};



exports.getUserWorkerEmail = function(req,resMain){
    UserSchema.findOne({email : req.query.email}, function(err,res){
        if(err){
            console.log('err',err);
            resMain.json({success: false});
        } else{
            console.log(res);
            if(res != null){
                if((res.roles.indexOf('freelancer')!= -1) && (res.email != req.user.email)){
                    resMain.json({success: true, freelancer_object : res});
                }else{
                    resMain.json({success: false});
                }
            }else{
                resMain.json({success: false});
            }
        }
    })
};


exports.getFreelancerEmail =function(req,resMain){
    UserSchema.find({roles : 'freelancer'}, function(err,res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        } else{
            resMain.json({success: true, freelancer_object :res});
        }
    })
};

exports.putWorker = function(req, resMain){
    Freelancer_DetailsSchema.findOneAndUpdate(
        {$and :[{user_id: req.user._id},{coworkers:{$nin:[req.body.freelancer_id]}}]},
        {$push: {coworkers: req.body.freelancer_id}},
        {safe: true},function(err, res) {
            if(err){
                console.log(err);
                resMain.json({success: false});
            }
            else{
                console.log(res);
                if(res != null){

                    var mailOptions = {
                        to: req.body.freelancer_email,
                        from: config.emailFrom
                    };
                    mailOptions = templates.co_worker_Mail(mailOptions,req.body);
                    sendMail(mailOptions);

                    resMain.json({success: true, status : 0});
                }else{
                    resMain.json({success: true, status : 1});
                }
            }
        });
};

exports.getSearchEmail =function(req,resMain){
    UserSchema.find({roles : 'contractor'}, function(err,res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        } else{
            resMain.json({success: true, contrator_list :res});
        }
    })

};

exports.getClienEmail =function(req,resMain){
    UserSchema.find({roles : 'freelancer'}, function(err,res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        } else{
            console.log(res);

            resMain.json({success: true, Freelancer_list :res});


        }
    })

};


exports.createOrder = function(req,resMain){

    if(req.user != undefined){
        if(req.user.roles.indexOf('freelancer') != -1){
            req.body.freelancer_id = req.user._id;
            req.body.customer_id = req.user._id;
        }else{
            req.body.customer_id = req.user._id;
        }
    }


    var order_db = new OrderSchema(req.body);
    order_db.save(function(err,res) {
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else
        {
            resMain.json({success: true, order_object : res});
        }
    })
};

exports.updateOrderId = function(req,resMain) {
    OrderSchema.findOneAndUpdate({_id: req.body.order_id}, {paymentStatus: req.body.state}, function(err,res){
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else
        {
            console.log(res);
            if(req.body.state == 'Success'){
                UserSchema.findById(res.freelancer_id, function(err,user){
                    if(err){
                        console.log(err);
                    }else{
                        var mailOptions = {
                            to: req.user.email,
                            bcc: user.email,
                            from: config.emailFrom
                        };
                        mailOptions = templates.paypalSuccess_Mail(mailOptions,req.body);
                        sendMail(mailOptions);


                        ProductSchema.findById(res.user_id, function(err,product){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log(req.body.price);
                                var mailOptions = {
                                    to:user.email,
                                    from: config.emailFrom
                                };

                                var pricing = {
                                    pay : ((product.price * 7)/100)
                                };

                                mailOptions = templates.Success_Mail(mailOptions,pricing);
                                sendMail(mailOptions);
                            }
                        });



                    }
                });
            }
            else{
                var mailOptions = {
                    to: req.user.email,
                    from: config.emailFrom
                };
                mailOptions = templates.paypalFail_Mail(mailOptions,req.body);
                sendMail(mailOptions);
            }

            resMain.json({success: true, order_object : res});
        }
    })
};

exports.updatePayback = function(req,resMain){
    console.log(req.body.order_id);
    OrderSchema.findOneAndUpdate({_id: req.body.order_id}, {paybackStatus: req.body.state}, function(err,res) {
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else {
            resMain.json({success: true});
        }
    })
};


exports.putRequirement = function(req,resMain){
    UserSchema.findById(req.body.freelancer_id, function(err,res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        }
        else{

            var desc = req.body.client_Des.description +' Open Attachment: '+req.body.clientAttach;
            var email_schema ={
                user_id : req.user._id,
                recipient_id : req.body.freelancer_id,
                to_user :res.email,
                subject:'Hi '+res.name+'! You have received the requirements from order #'+req.body.order_id,
                content:desc,
                from:'contractor'
            };


            var freelancer_db = new FreelancerEmailsSchema(email_schema);
            freelancer_db.save(function(err,resemail){
                if(err){
                    console.log(err);
                    resMain.json({success:false});
                }
                else{
                    resMain.json({success:true ,email_object:resemail});
                    console.log(resemail);
                }
            })
            var mailOptions = {
                to: res.email,
                from: config.emailFrom
            };

            var clientreq = {
                freelancer : res,
                contractor:req.user.name,
                orderId:req.body.order_id,
                clientrequire:desc
            };
            mailOptions = templates.client_Mail(mailOptions,clientreq);
            sendMail(mailOptions);
            resMain.json({success: true});
        }
    })
};

exports.putProductOrder = function(req,resMain){
    OrderSchema.find({freelancer_id : req.user._id, paymentStatus:'Success'}, function(err,res){
        if (err) {
            console.log(err);
            resMain.json({success: false});
        }
        else{
            var product_id_array = [];
            var customer_id_array = [];
            for (var i =0; i<res.length; i=i+1){
                product_id_array.push(res[i].product_id);
                customer_id_array.push(res[i].customer_id);
            }
            ProductSchema.find({'_id': { $in: product_id_array}}, function(err, products){
                if(err){
                    resMain.json({success: false});
                } else{
                    UserSchema.find({
                        '_id': { $in: customer_id_array}
                    }, function(err, customers){
                        if(err){
                            resMain.json({success: false});
                        } else{

                            resMain.json({success: true,purchased_products : products, my_orders: res, my_customers: customers});
                        }
                    })
                }
            });
        }

    })
};

exports.submitWork = function(req,resMain) {
    var d = new Date();
    var date_string = d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear();
    var deliverable = {date : date_string, url : req.body.work_url};
    OrderSchema.findOneAndUpdate({_id: req.body.order_id},
        {$push: {deliverables: deliverable}},
        {safe: true},function(err, res){
            if(err){
                console.log(err);
                resMain.json({success: false});
            }else{
                resMain.json({success: true,deliverable : deliverable});
                UserSchema.findById(res.customer_id, function(err,customer){
                    if(err){
                        console.log(err);
                    }else{

                        var mailOptions = {
                            to: customer.email,
                            bcc: req.user.email,
                            from: config.emailFrom
                        };
                        var email_content ={
                            order: res,
                            deliverable : deliverable,
                            freelancer : req.user,
                            customer : customer
                        }

                        mailOptions = templates.deliverable_notify(mailOptions,email_content);
                        sendMail(mailOptions);
                    }
                });
            }
        });
};
exports.updateWorkApprovalStatus = function(req, resMain){
    OrderSchema.findByIdAndUpdate(req.body.order_id, {approval_status: true}, function(err, res){
        if(err){
            console.log(err);
            resMain.json({success: false});
        }else{
            resMain.json({success: true});
            UserSchema.findById(res.freelancer_id, function(err, freelancer){

                if(err){

                }else{
                    var mailOptions = {
                        to: freelancer.email,
                        from: config.admin_email
                    };
                    var email_content ={
                        order: res,
                        freelancer : freelancer,
                        customer : req.user
                    }

                    mailOptions = templates.work_approval(mailOptions,email_content);
                    sendMail(mailOptions);
                }

            });
        }

    });
};
exports.getClientWork = function(req, resMain){
    OrderSchema.find({customer_id : req.user._id , paymentStatus:'Success'}, function(err, orders){
        if(err){
            console.log(err);
            resMain.json({success: false});
        }else{
            var product_id_array = [];
            var freelancer_id_array = [];
            for (var i =0; i<orders.length; i=i+1){
                product_id_array.push(orders[i].product_id);
                freelancer_id_array.push(orders[i].freelancer_id);
            }

            ProductSchema.find({'_id': { $in: product_id_array}}, function(err, products) {
                if (err) {
                    resMain.json({success: false});
                } else {
                    UserSchema.find({
                        '_id': { $in: freelancer_id_array}
                    }, function(err, freelancer){
                        if(err){
                            resMain.json({success: false});
                        }
                        else{
                            resMain.json({success: true,purchased_products : products, my_orders: orders, my_freelancer: freelancer});
                        }
                    });
                }
            });

        }
    });
};


function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function(error, success) {
        if (error) console.log(error);
        else console.log(success);
    });
}