var User = require('../models/user');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonWebToken = require('jsonwebtoken');
function createToken(user){
	var accessToken=jsonWebToken.sign({

		_id:user._id,
		name:user.name,
		username:user.username
	},secretKey,{
		expiresInMinute:1440
	});
	return accessToken;
}
module.exports = function(app, express) {

	var api = express.Router();
	api.post('/signup', function(req, res) {

		var user = new User({

			name: req.body.name,
			username: req.body.username,
			password: req.body.password

		});

		user.save(function(err) {

			if (err) {
				res.status(500).send(err);
				return;
			}

			res.json(user);
		});
	});

	api.get('/users',function(req,res){
		User.find({},function(err,users){
			if(err)
				res.status(500).send(err);
			else
				res.send(users);
		});

	});

	api.post('/login',function(req,res){

		User.findOne({
			username:req.body.username
		}).select('password').exec(function(err,user){
			if(err)
				throw err;
			if(!user){
				res.send({message:"User does not exist"});
			}else if(user){
				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
					res.send({message:"Invalid Password"});
				}else{
					///token
					var accessToken = createToken(user);
					res.json({
						success:true,
						message:"Successfully logged in",
						 accessToken:accessToken 
					});
				}
			}
		});
	});
	return api;
}