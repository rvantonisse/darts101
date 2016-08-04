var compiler = require('../utilities/html-compiler');
var helpers = require('../utilities/helpers');

module.exports = function (grunt) {
	'use strict';
	grunt.registerTask(
		'compile-html',
		'Compile all views & components',
		/**
		 * @param; mode
		 */
		function (mode) {
			mode = mode || 'development';

			var file = grunt.file;
			var pkg = grunt.config('pkg');
			var project = {
				title: pkg.name,
				version: pkg.version
			};
			function getProjectAssets (ext) {
				var assetsDir = '/assets/';
				ext = ext || '.asset';
				return assetsDir + project.title + ext;
			}

			function getMenu () {
				var menu = [];
				function byMenuOrder (a, b) {
					// grunt.log.writeln('Sorting:');
					// grunt.log.writeln('a: ' + a.viewName + '(' + a['menu-order'] + ')');
					// grunt.log.writeln('b: ' + b.viewName + '(' + b['menu-order'] + ')');
					if (parseInt(a['menu-order'], 10) < parseInt(b['menu-order'], 10)) {
						return -1;
					}
					if (parseInt(a['menu-order'], 10) > parseInt(b['menu-order'], 10)) {
						return 1;
					}
					return 0;
				}
				function getMenuOrder (view) {
					// grunt.log.writeln('Getting menu order for: ' + view);
					/*
						Need to read data.json file of each view
						and read the "menu-order" property
					*/
					var viewDir = grunt.config('viewsSourceDir') + view + '/';
					var dataFile = view + '.json';
					var defaultValue = 10;
					// Check if the data file exists, if not assign defaultValue
					if (!file.isFile(viewDir + dataFile)) {
						// grunt.log.writeln('"' + viewDir + dataFile + '" is not a file.');
						// grunt.log.writeln('Assigning default value: ' + defaultValue);
						return defaultValue;
					}
					// Read the data
					var viewData = file.readJSON(viewDir + dataFile);
					// grunt.log.writeln('viewdata: ' + viewData);

					// If menu-order is not present or misset assign a defaultValue
					if (!viewData['menu-order'] || viewData['menu-order'] === null || typeof viewData['menu-order'] !== 'number') {
						// grunt.log.error('"menu-order" is not set or not set correctly');
						// grunt.log.ok('Assigning default value: ' + defaultValue);
						return defaultValue;
					}
					// grunt.log.ok(view + '["menu-order"]: ' + viewData['menu-order']);
					return viewData['menu-order'];
				}

				function getMenuLink (view) {
					if (view === 'home') {
						return '/index.html';
					}
					return '/' + view + '/';
				}

				compiler.getViews().forEach(function(view){
					menu.push({
						viewName: view,
						link: getMenuLink(view),
						title: createMenuTitle(view),
						"menu-order": getMenuOrder(view)
					});
				});
				menu = menu.sort(byMenuOrder);
				// grunt.log.writeln('Sorted menu:');
				// menu.forEach(function(item) {
				// 	grunt.log.writeln(item.viewName + '(' + item['menu-order'] + ')');
				// });
				return menu;
			}
			function createMenuTitle (string) {
				// grunt.log.writeln('Creating menu title with: ' + string);
				var replaceChar = helpers.replaceChar;
				var capitalize = helpers.capitalize;
				return capitalize(replaceChar(string, '-', ' '));
			}

			// compile-html functions
			function compileView (name, data, target) {
				// grunt.log.writeln('Compiling view: ' + name + ' into: ' + target);

				// Inject data
				data = data || {};
				data.name = name;
				data.mode = mode;
				data.title = data.name + ' | ' + project.title;
				data.menu = getMenu();
				data.viewData = compiler.getViewData(name)['view-data'];
				data.subviews = [];
				compiler.getSubviewsFor(name).forEach(function (subview) {
					var subviewData = compiler.getSubviewData(name, subview);
					data.subviews.push(subviewData);
				});
				data.subviews.forEach(function (subview) {
					for (var thing in subview) {
						grunt.log.writeln(thing + ': ' + subview[thing]);
					}
				});

				var filename = name + '/' + name + '.html';
				var viewsDir = 'views/';
				var template = compiler.getTemplate(viewsDir + filename);
				var html = template.render(data);

				if (name === 'home') {
					grunt.file.write(target + '/index.html', html);
				} else {
					grunt.file.write(target + '/' + name + '/index.html', html);
				}
				grunt.log.ok(name + ' into: ' + target);
				return html;
			}

			// Compile subView
			function compileSubView (view, subview, data, target) {
				// grunt.log.writeln('Compiling: ' + view + '/' + subview + ' into: ' + target + '/' + view);
				var subviewData = compiler.getSubviewData(view, subview);

				// finish the data object
				data = data;
				data.parent = view;
				data.name = subview;
				data.mode = mode;
				data.viewData = subviewData['view-data'] || {};
				data.title = data.parent + ': ' + data.viewData.meta.title + ' | ' + project.title;
				// grunt.log.writeln('with data: ');
				// for (var thing in data) {
				// 	grunt.log.writeln(thing);
				// }

				target = target + '/index.html';

				var filename = view + '/' + subview + '/' + subview + '.html';
				var viewsDir = 'views/';
				var template = compiler.getTemplate(viewsDir + filename);
				var html = template.render(data);

				// Write the target
				grunt.file.write(target, html);
				grunt.log.ok('Subview: ' + view + '/' + subview + ' into: ' + target);
				return html;
			}

			// Execute compile-html:mode
			switch (mode) {
			case 'development':
				var targetPath = mode;
				var addData = {
					'cssPath': getProjectAssets('.css'),
					'jsPath': getProjectAssets('.js')
				};

				// Compile views/ html to development/view folder
				grunt.log.writeln('Compiling views:');
				compiler.getViews().forEach(function(view){
					compileView(view, addData, targetPath);
					// Compile subviews if any
					if (compiler.getSubviewsFor(view).length !== 0) {
						compiler.getSubviewsFor(view).forEach(function (subview) {
							var target = targetPath + '/' + view + '/' + subview;
							compileSubView(view, subview, addData, target);
						});
					}
				});

				grunt.log.ok('All html compiled!');
				grunt.log.writeln('');
				break;

			case 'distribution':
				// compile html to distribution folder
				var targetPath = mode;
				var addData = {
					'cssPath': getProjectAssets('.min.css'),
					'jsPath': getProjectAssets('.min.js')
				};
				grunt.log.writeln('Compiling views:');
				compiler.getViews().forEach(function(view){
					compileView(view, addData, targetPath);
					// Compile subviews if any
					if (compiler.getSubviewsFor(view).length !== 0) {
						compiler.getSubviewsFor(view).forEach(function (subview) {
							var target = targetPath + '/' + view + '/' + subview;
							compileSubView(view, subview, addData, target);
						});
					}
				});
				grunt.log.ok('All html compiled!');
				grunt.log.writeln('');
				break;
			}
		}
	);
};
