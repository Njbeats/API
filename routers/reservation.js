const mongoose = require('mongoose');
const Reservation = require('../models/reservation');

module.exports = {
   
     getAll: (req, res, next) => {
        Reservation.find()
        .select()
        .exec()
        .then(docs => {
            if (!docs || docs.length == 0) return res.status(200).json({ count: docs.length, reservation: docs, message: `No reservations found in database!`});
            const response = {
                count: docs.length,
                reservations: docs.map(doc => {
                    return {                        
                        _id: doc._id,                
                        madeBy: doc.madeBy,
                        date: doc.date,
                        dateTimeStart: doc.dateTimeStart,
                        dateTimeEnd: doc.dateTimeEnd,
                        location: doc.location,
                        address: doc.address,
                        description: doc.description,
                        special_requiment: doc.special_requiment,
                        package: doc.package,
                        additional_services: doc.additional_services,
                        request: {
                            type: "Get, Put, Delete",
                            url: "http://localhost:8080/reservations/" + doc._id
                        }
                    };
                })
            }; 
            if (docs.length >= 0) 
                res.status(200).json(response);
            else res.status(404).json({
                message: 'No entries found',
                request: {
                    name: 'Create a pacake',
                    request: {
                        type: 'POST',
                        url: "http://localhost:8080/reservations"
                    }
                }
            });
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                errorString: `${err}` 
            });
        });
    }, 

    getOne: (req, res, next) => {
        const id = req.params.reservationId;
        Reservation.findById(id)
        .select()
        .exec()
        .then(
            doc => {
                if(doc) {
                    console.log(doc);
                    res.status(200).json({
                        reservation: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8080/reservations/' + doc._id
                        }
                    });
                } else {
                    res.status(404).json({
                        message: "No reservation with provided reservation ID",
                    });
                }
            }
        )
        .catch(
            err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    errorString: `${err}`,
                })
            }
        );
    },

    createOne: (req, res, next) => {

        console.log(req.body);
        const reservation  = new Reservation({
            _id: new mongoose.Types.ObjectId(),                
            madeBy: {
                user: req.body['madeBy.user'],
            }, 
            date: Date(req.body.date),
            dateTimeStart: Date(req.body.dateTimeStart),
            dateTimeEnd: Date(req.body.dateTimeEnd),
            location: {
                name: req.body['location.name'],
                type: req.body['location.locationType'],
                description: req.body['location.description'],
            },
            address: {                
                address1: req.body['address.address1'],
                address2: req.body['address.address2'],
                city: req.body['address.city'],
                province: req.body['address.province'],
                country: req.body['address.country'],
                postal_code: req.body['address.postal_code']
            },
            description: req.body.description,
            special_requiment: req.body.special_requiment,
            package: req.body.package,
            additional_services: req.body.additional_services,
            
        });

        reservation.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Reservation Created successfully",
                createdReservation: {
                    _id: result._id,                
                    madeBy: {
                        user: result.madeBy.user
                    }, 
                    date: result.date,
                    dateTimeStart: result.dateTimeStart,
                    dateTimeEnd: result.dateTimeEnd,
                    location: {
                        name: result.location.name,
                        locationType: result.location.locationType,
                        description: result.location.description,
                        address: {                
                            address1: result.address.address1,
                            address2: result.address.address2,
                            city: result.address.city,
                            province: result.address.province,
                            country: result.address.country,
                            postal_code: result.address.postal_code
                        }
                    },
                    description: result.description,
                    special_requiment: result.special_requiment,
                    package: result.package,
                    additional_services: result.additional_services,                   
                    request: {
                        type: 'GET',
                        url: "http://localhost:8080/reservations/" + result._id
                    }
                },
            });
        }).catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err,
                errorString: `${err}`,
            })
        })
         
    },   

    deleteOne: (req, res, next) => { 
        const id = req.params.reservationId;
        Reservation.findOneAndDelete({_id: id})
        .exec()
        .then( result => {
            if (!result) return res.status(404).json({ message: `No reservation with id: ${id} found!` });
            res.status(200).json({
                message: `${result._id} reservation was delete Successfully`
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err,
                errorString: `${err}`,
            });
        })
    },

    updateOne: function (req, res, next) {
        if (JSON.stringify(req.body) == "{}") return res.status(404).json({message: 'Empty update Parameters'});  
        const id = req.params.reservationId;

        Reservation.findByIdAndUpdate({_id: id}, { $set: req.body}, {new: true})
        .exec()
        .then(
            result => { 
                if(!result || result.length === 0) return res.status(404).json({ message: `No reservation with id: ${id} exits`});
                
                let reservationUpdate = JSON.parse(JSON.stringify(result));
                ['equipment', 'createdAt', 'updatedAt', '__v'].forEach(e => delete reservationUpdate[e]);
                
                res.status(200).json(reservationUpdate);
            }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                errorString: `${err}`
            })
        });

       

        // Reservation.findOne({ title: req.params.title}, 
        //     function (err, reservation) {
        //         if (err) return res.status(400).json(err);
        //         if(!reservation) return res.status(404).json({ message: ` Sorry, no Record titled: ${req.params.title} found!`});
        //         let reservation_a = JSON.parse(JSON.stringify(reservation._doc));
        //         let reservation_b = JSON.parse(JSON.stringify(reservation._doc));

        //         // console.log("********************  Start Reservation A****************");
        //         // console.log(reservation_a);
        //         // console.log("********************  END Reservation A****************");

        //         // console.log("********************  Start Reservation B****************");
        //         // console.log(reservation_b);
        //         // console.log("********************  END Reservation B****************");

        //         if(req.body.title) reservation_b.title = req.body.title;
        //         if(req.body.wired_desktop_mics) reservation_b.details.wired_desktop_mics = parseInt(req.body.wired_desktop_mics);
        //         if(req.body.cordless_mics) reservation_b.details.cordless_mics = parseInt(req.body.cordless_mics);
        //         if(req.body.wired_desktop_mics_min) reservation_b.details.wired_desktop_mics_min = parseInt(req.body.wired_desktop_mics_min);
        //         if(req.body.wired_desktop_mics_max) reservation_b.details.wired_desktop_mics_max = parseInt(req.body.wired_desktop_mics_max);
        //         if(req.body.cordless_mics) reservation_b.details.cordless_mics = parseInt(req.body.cordless_mics);
        //         if(req.body.speakers_min) reservation_b.details.speakers_min = parseInt(req.body.speakers_min);
        //         if(req.body.speakers_max) reservation_b.details.speakers_max = parseInt(req.body.speakers_max);
        //         if(req.body.price) reservation_b.price = parseInt(req.body.price);
        //         if(req.body.description) reservation_b.description = req.body.description;
        //         console.log(JSON.stringify(reservation_b));

        //         // console.log("********************  AA Start Reservation A****************");
        //         // console.log(JSON.parse(JSON.stringify(reservation_a)));
        //         // console.log("********************  END Reservation A****************");
        //         // console.log("********************  BB Start Reservation B****************");
        //         // console.log(JSON.parse(JSON.stringify(reservation_b)));
        //         // console.log("********************  END Reservation B****************");
        //         // console.log("*** Reservation a === Reservation b*************");
        //         // console.log(JSON.parse(JSON.stringify(reservation_b)) == JSON.parse(JSON.stringify(reservation_b)));

        //         Object.keys(reservation_b).forEach((key, value) => {
        //             // console.log('Key: ' + key);
        //             //console.log(key );
                    
        //             if(key == 'details') {
        //                 Object.keys(reservation_b.details).forEach((k, v) => {
        //                     console.log(reservation_b.details[k] == reservation_a.details[k], reservation_b.details[k], reservation_a.details[k]);
        //                    if ( reservation_b.details[k] == reservation_a.details[k]) delete reservation_b.details[k]
        //                 });
        //             }
        //             if ( reservation_b[key] == reservation_a[key]) delete reservation_b[key];                        
        //             //console.log(reservation_a[key] == reservation_b[key] );

        //         });            
        //         //console.log(reservation_b);

        //         Reservation.updateOne({ title: req.params.title }, {$set: JSON.stringify(reservation_b)}, {new: true}, function (err, reservation){
        //             if (err) console.log(err);
        //             if (err) return res.status(400).json(err);
        //             if (!reservation) return res.status(404).json({ message: ` Sorry, no Record titled: ${req.params.title} found!`});
        //             res.json(reservation);
        //         });
        //     });
    
    }, 

};