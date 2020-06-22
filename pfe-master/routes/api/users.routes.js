
const express = require("express");
const router = express.Router();
const passport = require("passport");
const usersController = require('../../controllers/user.controller.js');

function isAdmin(req, res, next) {
    if (req.user.role == 'admin')
      next ();
    res.status.json("Unauthorized")
}

router.get('/paginate/', passport.authenticate('jwt', { session: false }), usersController.paginate);
router.post('/', passport.authenticate('jwt', { session: false }),  usersController.create);
router.get('/', passport.authenticate('jwt', { session: false }), usersController.findAll);
router.get('/:id', passport.authenticate('jwt', { session: false }), usersController.findOne);
router.put('/:id', passport.authenticate('jwt', { session: false }), usersController.update);
router.delete('/:id', passport.authenticate('jwt', { session: false }), usersController.delete);

//router.use(isAdmin())

module.exports = router;
