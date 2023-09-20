const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = (req, res) =>{
  const { username, password } = req.body;
  req.session.message = [];
  req.flash('data', req.body);
  User.findOne({ username: username })
    .then((user) => {
      if(user) {
        bcrypt.compare(password, user.password, (error, same) => {
          if(same) {
            req.session.userId = user._id
            res.redirect('/')
          }
          else {
            if(password === "") {
              req.session.message[1] = "Provide Password"
	    }
            else { req.session.message[1] = "Password is incorrect" }
            console.log(req.flash('data')[0]);
            req.flash('message', req.session.message);
            res.redirect('/auth/login')
          }
        })
      }
      else {
        if(username === "" && password === "") {
	    req.session.message = ["Provide Username", "Provide Password"];
	}
	else if(username === "") {
	  req.session.message[0] = ["Provide Username"]
	}
	else {
	  req.session.message[0] = "Username is incorrect"
	}
        req.flash('message', req.session.message);
        res.redirect('/auth/login')
      }
    })
}

