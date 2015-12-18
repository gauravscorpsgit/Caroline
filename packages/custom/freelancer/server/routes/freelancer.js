'use strict';

// The Package is past automatically as first parameter
module.exports = function(Freelancer, app, auth, database) {

    var freelancer_server_controllers = require('../controllers/freelancer');

    app.route('/api/compose/register')
        .post(freelancer_server_controllers.createEmail)
        .get(freelancer_server_controllers.getUserSentEmails);

    app.route('/api/freelancer/addworker')
        .get(freelancer_server_controllers.getUserWorkerEmail);


    app.route('/api/freelancer/freelancerworker')
        .get(freelancer_server_controllers.getFreelancerEmail);

    app.route('/api/freelancer/searchEmail')
        .get(freelancer_server_controllers.getSearchEmail);

    app.route('/api/freelancer/updateWorker')
        .put(freelancer_server_controllers.putWorker)


    app.route('/api/product')
        .post(freelancer_server_controllers.createFreelancerProduct)

    app.get('/freelancer/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/freelancer/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/freelancer/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.route('/api/order')
        .post(freelancer_server_controllers.createOrder)
        .put(freelancer_server_controllers.updateOrderId);

    app.route('/api/freelancer/productOrder')
        .put(freelancer_server_controllers.putProductOrder)
        .post(freelancer_server_controllers.submitWork);

    app.route('/api/getClientWork')
        .get(freelancer_server_controllers.getClientWork);

    app.get('/freelancer/example/render', function(req, res, next) {
        Freelancer.render('index', {
            package: 'freelancer'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
