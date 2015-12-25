/**
 * Created by akhil on 10-12-2015.
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

var OrderSchema = new Schema({
    freelancer_id:{
        type: Number,
        required: true
    },
    customer_id:{
        type: Number,
        required: false,
        default: 11
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    product_id :{
        type: Number,
        required: true
    },
    date_delivery :{
        type: Date,
        default: Date.now
    },
    approval_status :{
        type: Boolean,
        required: true,
        default: false
    },
    deliverables :{
        type: Array,
        default: [],
        required: false
    },
    paymentStatus : {
        type: String,
        required: false,
        trim: true
    },
    paybackStatus : {
        type: Boolean,
        required: true,
        default: false
    }
});

OrderSchema.plugin(autoIncrement.plugin, 'freelancer_order');
mongoose.model('freelancer_order', OrderSchema);
