!function () {

	var ExerciseTabView;
	var appRouter,
		AppRouter,
		ExerciseFormView,
		AppView,
		ExerciseSidebarView,
		ExerciseView,
		ExercisesListItemView,
		ExercisesListView,
		Exercise,
		Exercises,
		international = i18n(dictionary),
		t8 = international.map,
		auto,
		specified,
		rootExercise,
		ExerciseForm,
		exerciseFormData,
		ReferenceView,
		ReferenceListView,
		subjects = [
			'math',
			'programming',
			'digital electronics',
			'modelling',
			'internet technologies'
		],
		subjectsExtended = {
			'math': {
				proposition: "",
				set: "",
				proof: "",
				relation: "",
				function: ""

			},
			'programming': {

			},
			'digital electronics': {

			},
			'modelling': {

			}
		},
		ExercisesView,
		ReferenceListItemView,
		c = console,
		appView,
		BannerView,
		ExerciseEditView,
		ExercisesTableView,
		ExerciseEditForm, ExerciseHistoryForm, ExerciseHistoryView


	/*
	 offlineScripts = [
	 "components/MathJax/index.js",
	 "components/jquery/jquery.js",
	 "components/underscore/underscore.js",
	 "components/backbone/backbone.js",
	 "components/backbone-forms/distribution/backbone-forms.js",
	 "components/bootstrap-template/index.js",
	 "components/dominate/index.js",
	 "components/highlight/index.js",
	 "components/bootstrap/bootstrap.js"
	 ],
	 onlineScripts = [
	 "//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML",
	 "//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js",
	 "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js",
	 "//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min.js",
	 "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.0/bootstrap.min.js",
	 "//raw.github.com/powmedia/backbone-forms/v0.10.0/distribution/backbone-forms.min.js",
	 "//raw.github.com/powmedia/backbone-forms/v0.10.0/distribution/templates/bootstrap.js",
	 "//cdnjs.cloudflare.com/ajax/libs/highlight.js/7.3/highlight.min.js",
	 "//raw.github.com/adius/DOMinate/master/src/dominate.js"
	 ]


	 onlineScripts.forEach(function(script){
	 var link
	 link = document.createElement("script")
	 link.setAttribute("src", "http:" + script)
	 link.setAttribute("type", "text/javascript")

	 document.body.appendChild(link)
	 })
	 */


	// Add capitalize function to underscore
	_.mixin({
		capitalize: function (string) {
			return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
		}
	})


	/*
	 $('.nav-collapse a').each(function(index, link) {

	 $(link).text(function(index, text) {

	 return t8(text)
	 })
	 })
	 */


	// Models

	Exercise = Backbone.Model.extend({
		url: '/api/exercises',
		parse: function (item) {

			// Add missing fields

			item.task = item.task || ""
			item.approach = item.approach || ""
			item.solution = item.solution || ""
			item.subjects = item.subjects || ""
			item.type = item.type || ""
			item.credits = item.credits || ""
			item.difficulty = item.difficulty || ""
			item.duration = item.duration || ""
			item.tags = item.tags || ""
			item.note = item.note || ""
			item.hints = item.hints || ""
			item.flags = item.flags || ""

			return item
		},
		schema: {
			task: {
				type: 'TextArea',
				validators: ['required'],
				editorClass: 'form-control',
				editorAttrs: {rows: 10},
				help: 'Detailed description of the task which must be solved.' +
					'Try to split up large tasks into its sub-tasks.'
			},
			approach: {
				type: 'TextArea',
				editorClass: 'form-control',
				editorAttrs: {rows: 10},
				help: 'All the necessary steps to get to a solution.'
			},
			solution: {
				type: 'Text',
				editorClass: 'form-control',
				help: 'Try to keep the solution as short as possible to make it machine readable! ' +
					'All further information should be written down in the approach section.'
			},
			subjects: {
				type: 'List',
				validators: ['required'],
				editorClass: 'form-control',
				help: 'Specify the subject of the exercise. (i.e. Math, Biology, …)'
			},
			type: {
				type: 'Select',
				options: ['', 'Calculate', 'Explain', 'Name', 'Describe', 'Proof', 'Assign', 'Draw', 'Choose', 'Transform'],
				validators: ['required'],
				editorClass: 'form-control',
				help: 'What is the main task of the exercise?'
			},
			credits: {
				type: 'Number',
				editorClass: 'form-control',
				editorAttrs: {min: 0},
				help: 'Consider difficulty, necessary steps and importance of the exercise. ' +
					'Each credit-point represents a noteworthy accomplishment while solving the task. ' +
					'Recommended range is 1 - 10 credits.'
			},
			difficulty: {
				type: 'Number',
				editorClass: 'form-control',
				editorAttrs: {min: 0, max: 1, step: 0.1, title: 'Tooltip help'},
				help: 'The difficulty level of the exercise ranges ' +
					'from excluded 0 (So easy that everybody can solve it) ' +
					'to excluded 1 (So difficult that nobody can solve it)'
			},
			duration: {
				type: 'Number',
				editorClass: 'form-control',
				editorAttrs: {min: 0},
				help: 'How long does it take to solve the exercise for an average person?'
			},
			tags: {
				type: 'List',
				editorClass: 'form-control',
				help: 'All the things that should be associated with this exercise'
			},
			note: {
				type: 'TextArea',
				editorClass: 'form-control',
				editorAttrs: {rows: 5},
				help: 'Any additional information'
			},
			hints: {
				type: 'List',
				editorClass: 'form-control',
				help: 'Any information which helps one to solve the exercise when he\'s stuck.'
			}
		}
	})


	// Collections

	Exercises = Backbone.Collection.extend({
		model: Exercise,
		url: '/api/exercises'
	})


	// Views

	ExerciseView = Backbone.View.extend({
		template: _.template($('#exerciseTemplate').html()),
		initialize: function () {

			if (this.model) {

				this.model.on('reset', this.render, this)

				this.model.set('displayedHints', 0)
				//TODO: Remove from model before saving
			}
		},

		renderExercise: function () {

			this
				.$el
				.html(this.template({data: null}))

			var snippets

			if (snippets = this.$('pre code')[0])
				hljs.highlightBlock(snippets)

			return this
		},

		renderExerciseTab: function () {

			this
				.$('#tab1')
				.html(new ExerciseTabView({model: this.model}).render().el)

			return this

		},

		renderEdit: function () {

			if (this.model) {
				this
					.$('#tab2')
					.html(new ExerciseEditView({model: this.model}).render().el)
			} else {
				this
					.$('#tab2')
					.html(new ExerciseEditView().render().el)
			}

			return this
		},

		renderHistory: function () {

			//new ExerciseHistoryView({model: this.model}).render()

			this
				.$('#tab3')
				.html(new ExerciseHistoryView({model: this.model}).render().el)

			return this
		},

		renderSidebar: function () {

			this
				.$('#exerciseSidebar')
				.html(new ExerciseSidebarView({model: this.model}).render().el)

			return this
		},

		render: function () {

			this.renderExercise()
			this.renderEdit()
			this.renderHistory()

			if (this.model) {
				this
					.renderExerciseTab()
					.renderSidebar()
			} else {
				this.$el
					.addClass("well")
					.addClass("col-lg-12")

				this.$('#tabHandlers li:nth-of-type(1)')
					.removeClass("active")

				this.$('#tabHandlers li:nth-of-type(2)')
					.addClass("active")

				this.$("#tab2").css("display", "block")
			}

			MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el])

			return this
		}
	})

	ExerciseTabView = Backbone.View.extend({
		tagName: "div",
		template: _.template($('#exerciseTabTemplate').html()),
		render: function () {

			this.$el.html(this.template({data: this.model.toJSON()}))

			return this
		}
	})

	ExerciseEditView = Backbone.View.extend({
		tagName: "div",
		id: "exerciseEdit",
		events: {
			"click #exerciseEditSubmit": "submit"
		},
		//template: _.template($('#exerciseEditTemplate').html()),

		initialize: function () {

			ExerciseEditForm = new Backbone.Form({
				model: this.model ? this.model : new Exercise(),
				idPrefix: 'exerciseEdit-',
				fieldsets: [
					{
						fields: [
							'task',
							'approach',
							'solution'
						]
					},
					{
						legend: 'Details',
						fields: [
							'subjects',
							'type',
							'credits',
							'difficulty',
							'duration',
							'hints',
							'tags',
							'note'
						]
					}
				]
			})
		},

		submit: function () {

			// TODO: Timestamp and user of modification

			// TODO: Display Error messages next to input-fields (should work automagical)

			var errors = ExerciseEditForm.commit({validate: true})

			if (!errors) {
				ExerciseEditForm.model.save("", "", {
					success: function () {
						alert("works")
					},
					error: function () {
						alert("Something went wrong!")
					}
				})
			}
			else {
				console.log(errors)
			}
		},

		render: function () {

			this.$el.html(ExerciseEditForm.render().el)

			this.$el.append('<button id=exerciseEditSubmit type="submit" class="btn btn-default">Submit</button>')

			/*
			 this.$('#exerciseForm-subjects').typeahead({
			 source: _.map(subjects, _.capitalize)
			 })
			 */

			//Fixes backbone-form bug of not being able to set stepsize
			this.$('#exerciseEdit-difficulty').attr('step', 0.1)

			this
				.$('.glyphicon-question-sign')
				.tooltip()

			return this
		}
	})

	ExerciseSidebarView = Backbone.View.extend({
		tagName: 'ul',
		className: 'list-group',
		template: _.template($('#exerciseSideBarTemplate').html()),
		events: {
			"click #showHint": "showHint"
		},
		showHint: function () {

			var counter = this.model.get('displayedHints')

			if (counter < this.model.get('hints').length) {

				var hints = $('#hints')

				if (counter == 0)
					$('<hr>')
						.hide()
						.appendTo(hints)
						.slideDown('fast')


				var el = $('<div class="alert alert-info">' + this.model.get('hints')[counter] + '</div>')
					.hide()
					.appendTo(hints)
					.slideDown('fast')

				MathJax.Hub.Queue(["Typeset", MathJax.Hub, el[0]])

				counter++
				this.model.set('displayedHints', counter)
			}

			this.renderBar()
		},
		render: function () {
			this.$el.html(this.template({data: this.model.toJSON()}))

			this.$("[rel=tooltip]").tooltip()

			return this
		}
	})


	ExercisesView = Backbone.View.extend({
		template: _.template($('#taskListTemplate').html()),
		render: function () {
			this.$el.html(this.template())

			return this
		}
	})

	ExercisesListView = Backbone.View.extend({
		tagName: 'ul',
		className: 'nav nav-list',
		render: function () {

			_.each(this.collection, function (exercise, i) {

				i = i + 1

				this.$el.append(
					new ExercisesListItemView({
							model: exercise,
							id: (i <= 9) ? '0' + i : i
						}
					).render().el)

			}, this)


			return this
		}
	})

	ExercisesListItemView = Backbone.View.extend({
		tagName: "li",
		events: {
			"click .exerciseLink": function () {

				var id = this.model.get('id'),
					task = appRouter.tasksList.get(id),
					taskView = new ExerciseView({model: task})

				$('#content')
					.html(taskView.render().el)
					.fadeIn()
			}
		},
		initialize: function () {

			this.muted = (!(this.model.get('solution') || this.model.get('solutions'))) ? 'muted' : ''

		},
		render: function () {

			DOMinate(
				[this.el,
					['small.exerciseLink',
						['a', String(this.id) + '. Aufgabe',
							{class: this.muted}
						]
					]
				]
			)

			return this
		}
	})

	ExercisesTableView = Backbone.View.extend({
		id: 'exercises',
		template: _.template($('#exercisesTemplate').html()),
		render: function () {

			var exercises = []

			_.each(this.collection.models, function (exercise, i) {

				var enhancedExercise = exercise.attributes,
					timestamp = enhancedExercise.id.substring(0, 8),
					datetime = new Date(parseInt(timestamp, 16) * 1000).toISOString().substr(0, 19).split('T')

				enhancedExercise.url = '#exercises/' + enhancedExercise.id
				enhancedExercise.date = datetime[0]
				enhancedExercise.time = datetime[1]

				exercises.push(enhancedExercise)


			}, this)

			this.$el.html(this.template({exercises: exercises}))

			return this
		}
	})

	ExerciseFormView = Backbone.View.extend({
		id: "exerciseModal",
		className: "modal hide fade",
		events: {
			"click #exerciseFormSubmit": "showModal"
		},
		attributes: {
			role: "dialog"
		},

		template: _.template($('#exerciseFormTemplate').html()),

		initialize: function () {

			ExerciseForm = new Backbone.Form({
				model: new Exercise(),
				idPrefix: 'exerciseForm-',
				fieldsets: [
					{
						legend: 'Exercise',
						fields: [
							'task',
							'approach',
							'solution'
						]
					},
					{
						legend: 'Details',
						fields: [
							'subjects',
							'type',
							'credits',
							'difficulty',
							'duration',
							'hints',
							'tags',
							'note'
						]
					}
				]
			})
		},

		showModal: function () {


			if (!ExerciseForm.validate()) {

				ExerciseForm.commit()

				ExerciseForm.model.save("", "", {
					success: function () {
						$('#exerciseModal').modal('hide')
					},
					error: function () {
						alert("Something went wrong!")
					}
				})
			}
		},

		render: function () {
			this.$el.html(this.template())

			this.$('.modal-body').append(ExerciseForm.render().el)

			/*this.$('#exerciseForm-subjects').typeahead({
			 source: _.map(subjects, _.capitalize)
			 })*/

			//Fixes backbone-form bug of not being able to set stepsize
			this.$('#exerciseForm-difficulty').attr('step', 0.1)


			this
				.$('.glyphicon-question-sign')
				.tooltip()


			//this.$('.icon-question-sign')

			return this
		}
	})

	ExerciseHistoryView = Backbone.View.extend({
		template: _.template($('#exerciseHistoryTemplate').html()),
		render: function () {

			var exercises = [],
				url = '/api/exercises/history/' + this.model.id,
				_this = this

			$.getJSON(
				url,
				function (data) {

					_this.$el.html(_this.template({exercises: data}))

					/*data.forEach(function (exercise, i) {


						_this
							.$("tbody")
							.append('\
								 <tr>\
									 <td>' + (i + 1) + '</td>\
									 <td>Time</td>\
									 <td>User</td>\
								 </tr>\
							')

					}, this)*/
				}
			)



			return this
		}
	})


	ReferenceView = Backbone.View.extend({

		id: 'reference',

		template: _.template($('#referenceTemplate').html()),

		render: function () {

			this.$el.html(this.template())

			this
				.$('#referenceSidebar')
				.html(new ReferenceListView({collection: this.options.data}).render().el)

			return this
		}
	})

	ReferenceListView = Backbone.View.extend({
		tagName: 'ul',
		className: 'list-group',
		//attributes: {'data-spy': "affix"},
		render: function () {

			_.each(this.collection.references.math, function (value, key, list) {

				this.$el.append(new ReferenceListItemView({model: value, id: key}).render().el)

			}, this)

			return this
		}
	})

	ReferenceListItemView = Backbone.View.extend({
		tagName: "li",
		className: "list-group-item",
		events: {
			"click a": function () {

				var ref,
					cont

				ref = $('#referenceContent').html('')

				cont = DOMinate(
					[ref[0],
						['div.panel-heading', this.id],
						['ul.list-group$list']
					])

				_.each(this.model, function (item, index) {

					$(cont.list).append($('<li class=list-group-item>' + item + '</li>'))
				})

				MathJax.Hub.Queue(["Typeset", MathJax.Hub, cont.list])
			}
		},
		render: function () {

			DOMinate(
				[this.el,
					['a', String(this.id)]
				]
			)

			return this
		}
	})


	AppView = Backbone.View.extend({

		events: {
		},
		initialize: function () {

			$('#newExercise').click(function () {

				$('#contentWrapper')
					.html(new ExerciseView().render().el)
					.fadeIn('fast')
			})
		},

		render: function () {
		}
	})

	BannerView = Backbone.View.extend({
		render: function () {

			this.$el.html(_.template($('#bannerTemplate').html()))

			return this
		}
	})


	// Router

	AppRouter = Backbone.Router.extend({
		routes: {
			"": "home",
			"exercises": "table",
			"exercises/:subject": "list",
			"reference/:subject": "reference"
		},
		initialize: function () {
			this.tasksList = new Exercises()
			this.exercisesList = new Exercises()

			this.route(/^exercises\/(\d+)$/, "taskDetails")

			//$('body').append(new ExerciseFormView().render().el)
		},

		list: function (subject) {

			this.tasksList.fetch({
					dataType: 'json',
					success: function (collection) {

						var tasksListView = new ExercisesListView({

								collection: collection.filter(function (task) {
									return _.contains(task.get("subjects"), subject)
								})
							}
						)


						$('#contentWrapper')
							.html(new ExercisesView().render().el)

						$('#sidebar')
							.html(tasksListView.render().el)
							.fadeIn('fast')
					}
				}
			)

			$('#tasks').fadeIn()
		},

		table: function () {

			this.exercisesList.fetch({
					dataType: 'json',
					success: function (collection) {

						var exercisesTableView = new ExercisesTableView({collection: collection})

						$('#contentWrapper')
							.html(exercisesTableView.render().el)
							.fadeIn('fast')
					}
				}
			)

			$('#tasks').fadeIn()
		},

		reference: function (subject) {

			$.ajax({
				url: "js/references.json",
				dataType: "json",
				context: this,
				success: function (data) {

					$('#contentWrapper')
						.empty()
						.append(new ReferenceView({data: data}).render().el)
				}
			}, this)

		},

		taskDetails: function (id) {


			if (this.tasksList.length == 0) {

				var self = this

				this.tasksList.fetch({
					success: function () {
						self.taskDetails(id)
					}
				})

			} else {


				$('#contentWrapper')
					.html(new ExercisesView().render().el)

				this.task = this.tasksList.get(id)

				this.taskView = new ExerciseView({model: this.task})

				$('#content')
					.html(this.taskView.render().el)
					.fadeIn('fast')
			}
		},

		home: function () {

			$('#contentWrapper')
				.html(new BannerView().render().el)
		}
	})

	appRouter = new AppRouter()
	appView = new AppView({el: document.body})

	Backbone.history.start()

	//console.log(international.getUntranslated())
}()
