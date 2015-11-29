'use strict';

// The Package is past automatically as first parameter
module.exports = function(Freelancer, app, auth, database) {

  app.get('/freelancer/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/freelancer/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/freelancer/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/freelancer/example/render', function(req, res, next) {
    Freelancer.render('index', {
      package: 'freelancer'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
