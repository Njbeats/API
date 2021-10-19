const mongoose = require('mongoose');
const Profile = require('../models/profile');

module.exports = {
   
     getAll: (req, res, next) => {
        Profile.find()
        .select("_id title firstName lastName email gender department position user organisation")
        .exec()
        .then(docs => {
            if (!docs || docs.length == 0) return res.status(200).json({ count: docs.length, profile: docs, message: `No profiles found in database!`});
            const response = {
                count: docs.length,
                profiles: docs.map(doc => {
                    return {
                        _id: doc._id, 
                        title: doc.title,
                        firstName: doc.firstName,
                        lastName: doc.lastName,
                        email: doc.email,
                        phoneNumber: doc.phoneNumber,
                        gender: doc.gender,
                        department: doc.department,
                        position: doc.position,
                        organisation: doc.organisation,
                        user: doc.user,
                        request: {
                            type: "Get, Put, Delete",
                            url: "http://localhost:8080/profiles/" + doc._id
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
                        url: "http://localhost:8080/profiles"
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
        const id = req.params.profileId;
        Profile.findById(id)
        .select("_id title firstName lastName email gender department position user organisation")
        .exec()
        .then(
            doc => {
                if(doc) {
                    console.log(doc);
                    res.status(200).json({
                        profile: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8080/profiles/' + doc._id
                        }
                    });
                } else {
                    res.status(404).json({
                        message: "No profile with provided profile ID",
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
        const profile  = new Profile({
            
            title: req.body.title,        
            firstName: req.body.firstName,        
            lastName: req.body.lastName,        
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            department: req.body.department,
            position: req.body.position,        
            organisation: {
                title: req.body["organisation.title"],
            }           
        });

        profile.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Profile Created successfully",
                createdProfile: {
                    _id: new mongoose.Types.ObjectId(),
                    title: result.title,
                    firstName: result.firstName,        
                    lastName: result.lastName,        
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                    gender: result.gender,
                    department: result.department,
                    position: result.position,        
                    organisation: {
                        title: result.organisation.title,
                    }, 
                    request: {
                        type: 'GET',
                        url: "http://localhost:8080/profiles/" + result._id
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
        const id = req.params.profileId;
        Profile.findOneAndDelete({_id: id})
        .exec()
        .then( result => {
            if (!result) return res.status(404).json({ message: `No profile with id: ${id} found!` });
            res.status(200).json({
                message: `${result.title} ${result.firstName} ${result.lastName}'s profile was delete Successfully`
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
        const id = req.params.profileId;

        Profile.findByIdAndUpdate({_id: id}, { $set: req.body}, {new: true})
        .exec()
        .then(
            result => { 
                if(!result || result.length === 0) return res.status(404).json({ message: `No profile with id: ${id} exits`});
                
                let profileUpdate = JSON.parse(JSON.stringify(result));
                ['equipment', 'createdAt', 'updatedAt', '__v'].forEach(e => delete profileUpdate[e]);
                
                res.status(200).json(profileUpdate);
            }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                errorString: `${err}`
            })
        });

       

        // Profile.findOne({ title: req.params.title}, 
        //     function (err, profile) {
        //         if (err) return res.status(400).json(err);
        //         if(!profile) return res.status(404).json({ message: ` Sorry, no Record titled: ${req.params.title} found!`});
        //         let profile_a = JSON.parse(JSON.stringify(profile._doc));
        //         let profile_b = JSON.parse(JSON.stringify(profile._doc));

        //         // console.log("********************  Start Profile A****************");
        //         // console.log(profile_a);
        //         // console.log("********************  END Profile A****************");

        //         // console.log("********************  Start Profile B****************");
        //         // console.log(profile_b);
        //         // console.log("********************  END Profile B****************");

        //         if(req.body.title) profile_b.title = req.body.title;
        //         if(req.body.wired_desktop_mics) profile_b.details.wired_desktop_mics = parseInt(req.body.wired_desktop_mics);
        //         if(req.body.cordless_mics) profile_b.details.cordless_mics = parseInt(req.body.cordless_mics);
        //         if(req.body.wired_desktop_mics_min) profile_b.details.wired_desktop_mics_min = parseInt(req.body.wired_desktop_mics_min);
        //         if(req.body.wired_desktop_mics_max) profile_b.details.wired_desktop_mics_max = parseInt(req.body.wired_desktop_mics_max);
        //         if(req.body.cordless_mics) profile_b.details.cordless_mics = parseInt(req.body.cordless_mics);
        //         if(req.body.speakers_min) profile_b.details.speakers_min = parseInt(req.body.speakers_min);
        //         if(req.body.speakers_max) profile_b.details.speakers_max = parseInt(req.body.speakers_max);
        //         if(req.body.price) profile_b.price = parseInt(req.body.price);
        //         if(req.body.description) profile_b.description = req.body.description;
        //         console.log(JSON.stringify(profile_b));

        //         // console.log("********************  AA Start Profile A****************");
        //         // console.log(JSON.parse(JSON.stringify(profile_a)));
        //         // console.log("********************  END Profile A****************");
        //         // console.log("********************  BB Start Profile B****************");
        //         // console.log(JSON.parse(JSON.stringify(profile_b)));
        //         // console.log("********************  END Profile B****************");
        //         // console.log("*** Profile a === Profile b*************");
        //         // console.log(JSON.parse(JSON.stringify(profile_b)) == JSON.parse(JSON.stringify(profile_b)));

        //         Object.keys(profile_b).forEach((key, value) => {
        //             // console.log('Key: ' + key);
        //             //console.log(key );
                    
        //             if(key == 'details') {
        //                 Object.keys(profile_b.details).forEach((k, v) => {
        //                     console.log(profile_b.details[k] == profile_a.details[k], profile_b.details[k], profile_a.details[k]);
        //                    if ( profile_b.details[k] == profile_a.details[k]) delete profile_b.details[k]
        //                 });
        //             }
        //             if ( profile_b[key] == profile_a[key]) delete profile_b[key];                        
        //             //console.log(profile_a[key] == profile_b[key] );

        //         });            
        //         //console.log(profile_b);

        //         Profile.updateOne({ title: req.params.title }, {$set: JSON.stringify(profile_b)}, {new: true}, function (err, profile){
        //             if (err) console.log(err);
        //             if (err) return res.status(400).json(err);
        //             if (!profile) return res.status(404).json({ message: ` Sorry, no Record titled: ${req.params.title} found!`});
        //             res.json(profile);
        //         });
        //     });
    
    }, 

};