'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Freelancer = new Module('freelancer');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Freelancer.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Freelancer.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Freelancer.menus.add({
    title: 'freelancer example page',
    link: 'freelancer example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Freelancer.aggregateAsset('css', 'freelancer.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Freelancer.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Freelancer.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Freelancer.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Freelancer;
});
