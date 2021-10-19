const mongoose = require('mongoose');
const Equipment = require('../models/equipment');

module.exports = {

    getAll: (req, res, next) => {
        const id = req.params.productI
        res.status(200).json({
            message: 'Get All Equipments'
        });
    },

    createOne: (req, res, next) => {
        res.status(200).json({
            message: 'Handling Create One Equipment Entry'
        }).cat
    },

    // getAll: function (req, res, next) {
    //     Equipment.find(function (err, equipments){
    //         if (err) {
    //             return res.status(404).json(err);
    //         } else {
    //             res.json(equipments);
    //         }
    //     });
    // },

    createOne: function (req, res, next) {
        Equipment.create(req.body, function(err, equipment){
            if (err) return res.status(400).json({
                message: 'Sorry Something went wrong',
                error: err
            });

            res.status(201).json({
                message: 'Created ',
                equipment: equipment});
        });
    },

    getOne: function (req, res, next) {
        Equipment.findOne({ _id: req.params.id },
            function (err, equipment) {
                if (err) return res.status(400).json(err);
                if(!equipment) return res.status(404).json();
                res.json(equipment);                
            });
    },

    updateOne: function (req, res, next) {
        Equipment.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, equipment){
            if (err) return res.status(400).json(err);
            if (!equipment) return res.status(404).json();
            res.json(equipment);
        });
    },

    
};