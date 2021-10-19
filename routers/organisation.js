const mongoose = require('mongoose');
const Organisation = require('../models/organisation');
const multer = require('multer');
const upload = multer({dest: '/uploads/'});

module.exports = {
   
     getAll: (req, res, next) => {
        Organisation.find()
        .select("_id title name_abrv contact classification description openhours address")
        .exec()
        .then(docs => {
            if (!docs || docs.length == 0) return res.status(200).json({ count: docs.length, organisation: docs, message: `No organisations found in database!`});
            const response = {
                count: docs.length,
                organisations: docs.map(doc => {
                    return {
                        _id: doc._id, 
                        title: doc.title,
                        contact: {
                            url: doc.contact.url,
                            tel: doc.contact.tel,
                            email: doc.contact.email
                        },
                        classification: doc.classification,
                        openHours: doc.openHours,
                        description: doc.description,
                        address: {
                            address1: doc.address.address1,
                            address2: doc.address.address2,
                            city: doc.address.city,
                            province: doc.address.province,
                            country: doc.address.country,
                            postal: doc.address.postal_code
                        },
                        request: {
                            type: "Get, Put, Delete",
                            url: "http://localhost:8080/organisations/" + doc._id
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
                        url: "http://localhost:8080/organisations"
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

    getOne:  (req, res, next) => {
        const id = req.params.organisationId;
        Organisation.findById(id)
        .select("_id title name_abrv contact classification description openhours address")
        .exec()
        .then(
            doc => {
                if(doc) {
                    console.log(doc);
                    res.status(200).json({
                        organisation: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8080/organisations/' + doc._id
                        }
                    });
                } else {
                    res.status(404).json({
                        message: "No organisation with provided organisation ID",
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
        const organisation  = new Organisation({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            contact: {
                url: req.body.url,
                tel: req.body.tel,
                fax: req.body.fax,
                email: req.body.email
            },
            classification: req.body.classification,
            openHours: req.body.openHours,
            description: req.body.description,
            address: {
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                postal: req.body.postal_code
            },
            description: req.body.description,
        });

        organisation.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Organisation Created successfully",
                createdOrganisation: {
                    _id: result._id,
                    title: result.title,
                    contact: {
                        url: result.contact.url,
                        tel: result.contact.tel,
                        fax: result.contact.fax,
                        email: result.contact.email
                    },
                    classification: result.classification,
                    openHours: result.openHours,
                    description: result.description,
                    address: {
                        address1: result.address.address1,
                        address2: result.address.address2,
                        city: result.address.city,
                        province: result.address.province,
                        country: result.address.country,
                        postal_code: result.address.postal_code,
                    },
                    p_O_Box: result.p_O_Box,
                    description: result.description,
                    request: {
                        type: 'GET',
                        url: "http://localhost:8080/organisations/" + result._id
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
        const id = req.params.organisationId;
        Organisation.findOneAndDelete({_id: id})
        .exec()
        .then( result => {
            if (!result) return res.status(404).json({ message: `No organisation with id: ${id} found!` });
            res.status(200).json({
                message: `${result.title} was delete Successfully`
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
        const id = req.params.organisationId;

        Organisation.findByIdAndUpdate({_id: id}, { $set: req.body}, {new: true})
        .exec()
        .then(
            result => { 
                if(!result || result.length === 0) return res.status(404).json({ message: `No organisation with id: ${id} exits`});
                
                let organisationUpdate = JSON.parse(JSON.stringify(result));
                ['equipment', 'createdAt', 'updatedAt', '__v'].forEach(e => delete organisationUpdate[e]);
                
                res.status(200).json(organisationUpdate);
            }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                errorString: `${err}`
            })
        });

       

        // Organisation.findOne({ title: req.params.title}, 
        //     function (err, organisation) {
        //         if (err) return res.status(400).json(err);
        //         if(!organisation) return res.status(404).json({ message: ` Sorry, no Record titled: ${req.params.title} found!`});
        //         let organisation_a = JSON.parse(JSON.stringify(organisation._doc));
        //         let organisation_b = JSON.parse(JSON.stringify(organisation._doc));

        //         // console.log("********************  Start Organisation A****************");
        //         // console.log(organisation_a);
        //         // console.log("********************  END Organisation A****************");

        //         // console.log("********************  Start Organisation B****************");
        //         // console.log(organisation_b);
        //         // console.log("********************  END Organisation B****************");

        //         if(req.body.title) organisation_b.title = req.body.title;
        //         if(req.body.wired_desktop_mics) organisation_b.details.wired_desktop_mics = parseInt(req.body.wired_desktop_mics);
        //         if(req.body.cordless_mics) organisation_b.details.cordless_mics = parseInt(req.body.cordless_mics);
        //         if(req.body.wired_desktop_mics_min) organisation_b.details.wired_desktop_mics_min = parseInt(req.body.wired_desktop_mics_min);
        //         if(req.body.wired_desktop_mics_max) organisation_b.details.wired_desktop_mics_max = parseInt(req.body.wired_desktop_mics_max);
        //         if(req.body.cordless_mics) organisation_b.details.cordless_mics = parseInt(req.body.cordless_mics);
        //         if(req.body.speakers_min) organisation_b.details.speakers_min = parseInt(req.body.speakers_min);
        //         if(req.body.speakers_max) organisation_b.details.speakers_max = parseInt(req.body.speakers_max);
        //         if(req.body.price) organisation_b.price = parseInt(req.body.price);
        //         if(req.body.description) organisation_b.description = req.body.description;
        //         console.log(JSON.stringify(organisation_b));

        //         // console.log("********************  AA Start Organisation A****************");
        //         // console.log(JSON.parse(JSON.stringify(organisation_a)));
        //         // console.log("********************  END Organisation A****************");
        //         // console.log("********************  BB Start Organisation B****************");
        //         // console.log(JSON.parse(JSON.stringify(organisation_b)));
        //         // console.log("********************  END Organisation B****************");
        //         // console.log("*** Organisation a === Organisation b*************");
        //         // console.log(JSON.parse(JSON.stringify(organisation_b)) == JSON.parse(JSON.stringify(organisation_b)));

        //         Object.keys(organisation_b).forEach((key, value) => {
        //             // console.log('Key: ' + key);
        //             //console.log(key );
                    
        //             if(key == 'details') {
        //                 Object.keys(organisation_b.details).forEach((k, v) => {
        //                     console.log(organisation_b.details[k] == organisation_a.details[k], organisation_b.details[k], organisation_a.details[k]);
        //                    if ( organisation_b.details[k] == organisation_a.details[k]) delete organisation_b.details[k]
        //                 });
        //             }
        //             if ( organisation_b[key] == organisation_a[key]) delete organisation_b[key];                        
        //             //console.log(organisation_a[key] == organisation_b[key] );

        //         });            
        //         //console.log(organisation_b);

        //         Organisation.updateOne({ title: req.params.title }, {$set: JSON.stringify(organisation_b)}, {new: true}, function (err, organisation){
        //             if (err) console.log(err);
        //             if (err) return res.status(400).json(err);
        //             if (!organisation) return res.status(404).json({ message: ` Sorry, no Record titled: ${req.params.title} found!`});
        //             res.json(organisation);
        //         });
        //     });
    
    }, 

};