'use strict';

// The Package is past automatically as first parameter
module.exports = function(Contractor, app, auth, database) {

  app.get('/contractor/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/contractor/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/contractor/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/contractor/example/render', function(req, res, next) {
    Contractor.render('index', {
      package: 'contractor'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
