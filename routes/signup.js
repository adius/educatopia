var users = require('../api/users')

module.exports = function (request, response) {

	if (request.session.user) {
		delete response.locals.session
		request.session.destroy()
	}

	if (request.method === 'POST')
		users.signup(
			request,
			function (error, data) {

				if (error)
					throw new Error(error)

				response.render('signup', {
					page: 'signup',
					data: data
				})
			}
		)

	else
		response.render('signup', {
			page: 'signup'
		})
}
