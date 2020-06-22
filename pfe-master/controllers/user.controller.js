const User = require("../models/User")
const isEmpty = require("is-empty");
const mailer = require("../services/mailer")

async function sendUpdatedCredsMail(name, pass, mail){
    const resetEmail = {
        to: this.email,
        from: 'admin@crmpfe.com',
        subject: 'Your credentials have been updated',
        text: `Full name: ${name} password: ${pass}  email: ${mail}`,
      };
    
      await mailer.sendMail(resetEmail);
}
exports.getMe=(req,res)=>{
  return  res.json({user:req.user})
}
exports.create = async (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(401);
    }
    // Validate request
    if(!req.body.email || !req.body.name || !req.body.password) {
        return res.status(400).send({
            message: "User does not satisfy all required fields" 
            //FIXME: once all required columns have been pinpointed 
        });
    }

    User.register(new User({ name: req.body.name, email: req.body.email, role: req.body.role }), req.body.password,
    async function (err) {
        if (err) {
            console.log('error while user register!', err);
            return res.status(200).json({
              "message": err
            });
        }
        console.log("Registred user " + req.body.name);
        await sendUpdatedCredsMail(req.body.name, req.body.password, req.body.email); 
        return res.status(200).json({
            "message": "Registred user"+  req.body.name
          });
    });
};

exports.findAll = (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(401);
    }
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

exports.paginate = (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(401);
    }
    const options = {
        page: req.query.currentPage,
        lean: true,
        limit: req.query.pageSize,
        leanWithId: true,
        sort: req.query.orderBy,
        collation: {
          locale: 'en'
        }
      };
      User.paginate({}, options, function(err, result) {
          return res.status(200).json({
              data: result.docs, 
              totalItem: result.totalDocs, 
              totalPage: result.totalPages
            });
        // result.docs
        // result.totalDocs = 100
        // result.limit = 10
        // result.page = 1
        // result.totalPages = 10
        // result.hasNextPage = true
        // result.nextPage = 2
        // result.hasPrevPage = false
        // result.prevPage = null
        // result.pagingCounter = 1
      });
}; 

exports.findOne = (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(401);
    }
    User.findById(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.id
        });
    });
};

exports.update = async (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(401);
    }

    if(!req.params.id) {
        return res.status(400).send({
            message: "User id content can not be empty"
        });
    } 

    User.findOne({ '_id': req.params.id }, async (err, returneduser) => {
        if (!returneduser) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }

        if(!isEmpty(req.body.email)){
            returneduser.email = req.body.email; 
        }
        
        if(!isEmpty(req.body.name)){
            returneduser.name = req.body.name; 
        }
        
        if(!isEmpty(req.body.role)){
            returneduser.role = req.body.role; 
        }
        if(!isEmpty(req.body.password)){
            returneduser.setPassword(req.params.password, function () { 
                /* */
            }); 
        }

        await sendUpdatedCredsMail(req.body.name || returneduser.name, 
            req.body.password || "unchanged", 
            req.body.email || returneduser.email); 

        
        returneduser.save();
        return res.status(200).send({
            message: "User updated succesfully"
        });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        })
    });
};

exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.userId
            });
        }
        res.send({message: "user deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "user not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};
