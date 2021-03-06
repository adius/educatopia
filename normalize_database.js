var conn = new Mongo(),
	exercises,
	db = conn.getDB("educatopiadev"),
	counter = 0

db.dropDatabase()

db.copyDatabase("educatopia", "educatopiadev")

//db = db.getSiblingDB('educatopiadev')


exercises = db.exercises.find()

exercises.forEach(exercise => {

	// Delete all empty fields
	for (var key in exercise) {
		if (exercise.hasOwnProperty(key))
			if (exercise[key] === "" ||
				exercise[key] === 0 ||
				exercise[key] === null ||
				exercise[key].length === 0 ||
				exercise[key][0] === "" ||
				exercise[key] === undefined) {

				delete exercise[key]
				counter++
			}
	}


	if (exercise.id) {
		delete exercise.id
	}

	if (exercise["given"]) {
		exercise["task"] = exercise["task"] + " " + exercise["given"].join(" ")

		delete exercise.given
	}


	if (exercise.solution) {
		exercise.solutions = []

		exercise.solutions[0] = exercise.solution

		delete exercise.solution
	}

	if (exercise["solutions"]) {
		exercise["solutions"] = [exercise["solutions"].join(" ")]
	}


	if (exercise.solutions2) {
		exercise["solutions"][0] = exercise.solutions[0] + " " +
		                           exercise["solutions2"].join(" ")

		delete exercise["solutions2"]
	}

	db.exercises.update({_id: exercise._id}, exercise)
})

print("Deleted " + counter + " empty fields.")


// Correct math exercises

exercises = db.exercises.find({"subjects": "math"})

exercises.forEach(exercise => {
	var fields = ['task', 'approach']

	fields.forEach(field => {

		if (exercise[field]) {
			exercise[field] = exercise[field].replace(/`/gm, '´')
		}
	})

	if (exercise["solutions"]) {
		exercise["solutions"][0] = exercise["solutions"][0].replace(/`/gm, '´')
	}

	if (exercise.hints) {
		for (var i = 0; i < exercise.hints.length; i++) {
			exercise.hints[i] = exercise.hints[i].replace(/`/gm, '´')
		}
	}

	db.exercises.update({_id: exercise._id}, exercise)
})


// Create History related fields

exercises = db.exercises.find()

exercises.forEach(exercise => {
	var placeholder = {}

	for (key in exercise) {

		if (exercise.hasOwnProperty(key) && key != "_id") {
			placeholder[key] = exercise[key]

			delete exercise[key]
		}
	}

	exercise.current = placeholder

	db.exercises.update({_id: exercise._id}, exercise)
})


// Add createdAt,  updatedAt and createdBy

exercises = db.exercises.find()

exercises.forEach(exercise => {
	exercise.current.createdAt = exercise._id.getTimestamp()
	exercise.updatedAt = exercise._id.getTimestamp()

	exercise.current.createdBy = 'adius'

	db.exercises.update({_id: exercise._id}, exercise)
})
