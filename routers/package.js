const mongoose = require('mongoose');
const Package = require('../models/package');

module.exports = {
   
     getAll: (req, res, next) => {
        Package.find()
        .select("_id title details price description equipment")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                packages: docs.map(doc => {
                    return {
                        _id: doc._id, 
                        title: doc.title,
                        details: doc.details,
                        price: doc.price,
                        description: doc.description,
                        request: {
                            type: "Get",
                            url: "http://localhost:8080/packages/" + doc._id
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
                        url: "http://localhost:8080/packages"
                    }
                }
            });
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }, 

    getOne: (req, res, next) => {
        const id = req.params.packageId;
        Package.findById(id)
        .select("_id title details price description equipment")
        .exec()
        .then(
            doc => {
                if(doc) {
                    res.status(200).json({
                        product: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8080/packages/' + doc._id
                        }
                    });
                } else {
                    res.status(404).json({
                        message: "No package with provided package ID",
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

        const package  = new Package({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            details: {
                wired_desktop_mics_min: parseInt(req.body.wired_desktop_mics_min),
                wired_desktop_mics_max: parseInt(req.body.wired_desktop_mics_max),
                cordless_mics: parseInt(req.body.cordless_mics),
                speakers_min: parseInt(req.body.speakers_min),
                speakers_max: parseInt(req.body.speakers_max)
            },
            price: {
                amount: parseInt(req.body.amount),
            },
            description: req.body.description,
        });

        package.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Package Created successfully",
                createdPackage: {
                    _id: result._id,
                    title: result.title,
                    details: result.details,
                    price: result.price,
                    description: result.description,
                    request: {
                        type: 'GET',
                        url: "http://localhost:8080/packages/" + result._id
                    }
                }
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
        const id = req.params.packageId;
        Package.findOneAndDelete({_id: id})
        .exec()
        .then( result => {
            if (!result) return res.status(404).json({ message: `No package with id: ${id} found!` });
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
        const id = req.params.packageId;

        Package.findByIdAndUpdate({_id: id}, { $set: req.body}, {new: true})
        .exec()
        .then(
            result => { 
                if(!result || result.length === 0) return res.status(404).json({ message: `No package with id: ${id} exits`});
                
                let packageUpdate = JSON.parse(JSON.stringify(result));
                ['equipment', 'createdAt', 'updatedAt', '__v'].forEach(e => delete packageUpdate[e]);
                
                res.status(200).json(packageUpdate);
            }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                errorString: `${err}`
            })
        });     

        // Package.findOne({ title: req.params.title}, 
        //     function (err, package) {
        //         if (err) return res.status(400).json(err);
        //         if(!package) return res.status(404).json({ message: ` Sorry, no Record titled: ${req.params.title} found!`});
        //         let package_a = JSON.parse(JSON.stringify(package._doc));
        //         let package_b = JSON.parse(JSON.stringify(package._doc));

        //         // console.log("********************  Start Package A****************");
        //         // console.log(package_a);
        //         // console.log("********************  END Package A****************");

        //         // console.log("********************  Start Package B****************");
        //         // console.log(package_b);
        //         // console.log("********************  END Package B****************");

        //         if(req.body.title) package_b.title = req.body.title;
        //         if(req.body.wired_desktop_mics) package_b.details.wired_desktop_mics = parseInt(req.body.wired_desktop_mics);
        //         if(req.body.cordless_mics) package_b.details.cordless_mics = parseInt(req.body.cordless_mics);
        //         if(req.body.wired_desktop_mics_min) package_b.details.wired_desktop_mics_min = parseInt(req.body.wired_desktop_mics_min);
        //         if(req.body.wired_desktop_mics_max) package_b.details.wired_desktop_mics_max = parseInt(req.body.wired_desktop_mics_max);
        //         if(req.body.cordless_mics) package_b.details.cordless_mics = parseInt(req.body.cordless_mics);
        //         if(req.body.speakers_min) package_b.details.speakers_min = parseInt(req.body.speakers_min);
        //         if(req.body.speakers_max) package_b.details.speakers_max = parseInt(req.body.speakers_max);
        //         if(req.body.price) package_b.price = parseInt(req.body.price);
        //         if(req.body.description) package_b.description = req.body.description;
        //         console.log(JSON.stringify(package_b));

        //         // console.log("********************  AA Start Package A****************");
        //         // console.log(JSON.parse(JSON.stringify(package_a)));
        //         // console.log("********************  END Package A****************");
        //         // console.log("********************  BB Start Package B****************");
        //         // console.log(JSON.parse(JSON.stringify(package_b)));
        //         // console.log("********************  END Package B****************");
        //         // console.log("*** Package a === Package b*************");
        //         // console.log(JSON.parse(JSON.stringify(package_b)) == JSON.parse(JSON.stringify(package_b)));

        //         Object.keys(package_b).forEach((key, value) => {
        //             // console.log('Key: ' + key);
        //             //console.log(key );
                    
        //             if(key == 'details') {
        //                 Object.keys(package_b.details).forEach((k, v) => {
        //                     console.log(package_b.details[k] == package_a.details[k], package_b.details[k], package_a.details[k]);
        //                    if ( package_b.details[k] == package_a.details[k]) delete package_b.details[k]
        //                 });
        //             }
        //             if ( package_b[key] == package_a[key]) delete package_b[key];                        
        //             //console.log(package_a[key] == package_b[key] );

        //         });            
        //         //console.log(package_b);

        //         Package.updateOne({ title: req.params.title }, {$set: JSON.stringify(package_b)}, {new: true}, function (err, package){
        //             if (err) console.log(err);
        //             if (err) return res.status(400).json(err);
        //             if (!package) return res.status(404).json({ message: ` Sorry, no Record titled: ${req.params.title} found!`});
        //             res.json(package);
        //         });
        //     });
    
    }, 

    

};