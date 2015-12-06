/**
 * Created by Gaurav on 12/6/2015.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    config = require('meanio').loadConfig(),
    Schema = mongoose.Schema;


var connection = mongoose.createConnection(config.db);

autoIncrement.initialize(connection);

var ProductSchema = new Schema({
    user_id:{
        type: Number,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    price :{
        type: Number,
        required: true,
        default: 0
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },created: {
        type: Date,
        default: Date.now
    }
});

ProductSchema.plugin(autoIncrement.plugin, 'freelancer_products');
mongoose.model('freelancer_products', ProductSchema);
