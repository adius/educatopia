var exercises = require('../api/exercises'),
    accounting = require('../api/accounting'),
    api = {}

api.exercises = {
	getById: exercises.getById,
	getHistoryById: exercises.getHistoryById,
	getAll: exercises.getAll,
	add: exercises.add,
	update: exercises.update,
	delete: exercises.delete
}

api.accounting = {
	signup: accounting.signup
}

module.exports = api