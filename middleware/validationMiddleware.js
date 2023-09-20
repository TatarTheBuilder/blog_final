module.exports = (req,res,next) => {
  if(req.files == null || req.body.title === "" || req.body.body === "") {
    return res.redirect('/posts/new')
	}
	next()
}

