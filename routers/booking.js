const mongoose = require('mongoose');
const Booking = require('../models/booking');

module.exports = {

    getAll: function (req, res, next) {
        Booking.find(function (err, bookings){
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(bookings);
            }
        });
    },

    createOne: function (req, res, next) {
        Booking.create(req.body, function(err, booking){
            if (err) return res.status(400).json(err);

            res.status(201).json(booking);
        });
    },

    getOne: function (req, res, next) {
        Booking.findOne({ _id: req.params.id },
            function (err, booking) {
                if (err) return res.status(400).json(err);
                if(!booking) return res.status(404).json();
                res.json(booking);                
            });
    },

    updateOne: function (req, res, next) {
        Booking.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, booking){
            if (err) return res.status(400).json(err);
            if (!booking) return res.status(404).json();
            res.json(booking);
        });
    },

    
};