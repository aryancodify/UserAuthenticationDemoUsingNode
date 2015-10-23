var User = require('../models/user');
var config = require('../../config');
var secretKey = config.secretKey;

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

	return api;
}