window.onload = function () {

	// Will fade out and remove all content of results div
	var clearResults = function(deactivate) {
		d3.selectAll('#results h2, #results h3, #results p, #results div')
		.transition()
		.duration(150)
		.style('opacity',0)
		.each('end', function() {
			d3.select(this).remove();
			if (deactivate === true) {
				d3.selectAll('#results').classed('active', false);
			}
		});
	};

	var clearActiveTiles = function() {
		d3.selectAll('#tiles td.active')
		.classed('active', false)
		.classed('in', false)
		.classed('out', false)
		.style('background-color', null)
		.on('click', null);
	};

	var displayIntroImage = function() {
		var rows = d3.selectAll('#tiles tr')[0],
			row_whs = d3.select(rows[4]).selectAll('td')[0],
			row_consultations = d3.select(rows[6]).selectAll('td')[0],
			row_browser = d3.select(rows[8]).selectAll('td')[0],
			whs = 'WHS',
			consultations = 'Consultations',
			browser = 'Browser';

		d3.selectAll(row_whs.slice(10,10 + whs.length))
		.data(whs.split(''))
		.classed('intro', true)
		.text(function(l) {
			return l;
		});

		d3.selectAll(row_consultations.slice(12,12	+consultations.length))
		.data(consultations.split(''))
		.classed('intro', true)
		.text(function(l) {
			return l;
		});

		d3.selectAll(row_browser.slice(22,22+browser.length))
		.data(browser.split(''))
		.classed('intro', true)
		.text(function(l) {
			return l;
		});
	};

	var clearIntro = function() {
		d3.selectAll('#tiles td.intro').classed('intro', false).text('');
	};

	var queryDocuments = function(query, documents) {

		var output = [], 
			counter, 
			q = query[0] + '(ing|er)?(\\s|,|-){1,2}' + query[1] + '(s|es)?',
			r = new RegExp(q, 'gim'), 
			matches;
		for(var doc in documents) {
			counter = 0;
		    for(var section in documents[doc][1]) {
		    	matches = (documents[doc][1][section].match(r) || []).length;
		        if(matches >= 0) {
		        	counter += matches;
		        }
		    }
		    if(counter > 0) {
		    	output.push({doc:doc, count:counter});
		    }
		}
		return output;
	};

	var highlightQuery = function(query, text) {
		var r = new RegExp(query[0] + '(ing|er)?(\\s|,|-){1,2}' + query[1] + '(s|es)?', 'gim');
		return {text: text.replace(r, '<span class="s">&nbsp;$&&nbsp;</span>'), modified: r.test(text)}
	};

	var formatTitle = function(title) {
		return title.replace(/(-|_)/g, ' ').replace(/\.(docx|pdf|doc|txt)/gi, '<span class="pdf">&nbsp;$&</span>');
	}

	var formatSearch = function(title) {
		return 'https://www.worldhumanitariansummit.org/search/apachesolr_search/' 
				+ encodeURIComponent(title.replace(/(-|_)/g, ' ').replace(/\.(docx|pdf|doc|txt)/gi, ''));
	}

	var getClass = function(i) {
		return i < 5 ? 'in' : ( i < 11 ? 'out' : ( i < 28 ? 'group' : ( i < 37 ? 'doc' : 'regio' ) ) ) ;
	}

	// Load data
	d3.json("data.json", function(json) {

		var triggerSearch = function(query) {

			clearActiveTiles();			
			var queryResults = queryDocuments(query, json['docs']),
				selectedCells = [],
				availableCells = d3.selectAll('td.a')[0],
				scale = d3.scale.linear().domain([1, 6]).range([0.3, 0.95]).clamp(true);

			while(selectedCells.length < queryResults.length) {
				// Max 140 cells available with current settings!
				selectedCells.push(availableCells.splice(Math.floor(Math.random() * (availableCells.length - 26)) + 13, 1)[0]);
			}
			d3.selectAll(selectedCells)
			.data(queryResults)
			.classed('active', true)
			.on('click', function(queryResult){
				
				clearResults();
				d3.select('#results').classed('active', true);

				var doc = json['docs'][queryResult['doc']], replacement;

				// Add title
				d3.select('#results')
				.append('h2')
				.append('a')
				.attr('href', formatSearch(doc[0]))
				.attr('target', '_blank')
				.html(formatTitle(doc[0]))
				.style('opacity', 0)
				.transition()
				.duration(150)
				.delay(200)
				.style('opacity', 1);

				// Add icons
				d3.select('#results')
				.append('div')
				.selectAll('span')
				.data(doc[2])
				.enter()
				.append('span')
				.attr('title', function(d) {
					return json['profiles'][d];
					//TODO whats up with national context Thailand?
				})
				.classed('icon', true)
				.style('opacity', 0)
				.transition()
				.duration(150)
				.delay(200)
				.style('opacity', 1)
				.each(function(d) {
					d3.select(this).classed(getClass(d), true);
				});

				// Add sections and subtitles
				for (var section in doc[1]) {

					replacement = highlightQuery(query, doc[1][section]);

					d3.select('#results')
					.append('h3')
					.classed('hidden', !replacement['modified'])
					.on('click', function() {
						d3.select(this).classed('hidden', !d3.select(this).classed('hidden'));
					})
					.text(json['header'][section])
					.style('opacity', 0)
					.transition()
					.duration(150)
					.delay(200)
					.style('opacity', 1);

					d3.select('#results')
					.append('p')
					.html(replacement['text'])
					.style('opacity', 0)
					.transition()
					.duration(150)
					.delay(200)
					.style('opacity', 1);

				}

				// Scroll to the top
				setTimeout(function(){ d3.select('#results').node().scrollTop = 0; }, 160);

			}).style('background-color', function(queryResult) { 
				return 'rgba(0, 173, 239, ' + scale(queryResult['count']) + ')';
			});
		};

		var divs = d3.select('#labels').selectAll('span').data(
				d3.set(json['bigrams'].map(function(d){return d[0];})).values().sort()
		).enter().append('div');
		divs.append('span').on('click', function() {

			// Add active class to selected text
			var active = d3.select(this.parentElement).classed('active');

			d3.selectAll('#labels div').classed('active', false);
			d3.select(this.parentElement).classed('active', !active);
			d3.select('#labels').classed('active', !active);

			if(!active) {

				d3.select('#labels').selectAll('ul').classed('active', false);
				d3.select(this.parentElement).select('ul').classed('active', true);

			} else {
				d3.select('#labels').selectAll('ul').classed('active', false);
				d3.select(this.parentElement.parentElement).classed('right', false);
				d3.select('#labels').classed('hyperactive', false);
				d3.select('#labels').selectAll('ul').classed('hyperactive', false);
				d3.select('#labels').selectAll('li').classed('hyperactive', false);
				clearResults(true);
				clearActiveTiles();
			}


		}).text(function(d){return d;});
		divs.append('ul').each(function(text) {
			
			var corresponding = json['bigrams'].reduce(function(a,b) {
					if(b[0] === text)
						a.push(b[1]);
						return a;
				}, []);

			d3.select(this.parentElement).select('ul').selectAll('li').data(corresponding.sort()).enter().append('li')
			.on('click', function() {
				// Add active class to selected text
				var active = d3.select(this).classed('hyperactive');

				d3.select(this.parentElement).classed('hyperactive', !active).selectAll('li').classed('hyperactive', false);
				d3.select(this).classed('hyperactive', !active);
				d3.select('#labels').classed('hyperactive', !active);

				if(!active) {
					triggerSearch([
						d3.select(this.parentElement.parentElement).select('span').text(),
						d3.select(this).text()
					]);
				} else {
					clearResults(true);
					clearActiveTiles();
				}

			})
			.text(function(d){return d;});
		});




		// Tiles
		var dummy = function(n) {
			var out = [], i = 0;
			while (i < n) {out.push(i); i++;}
			return out;
		};
		var rows = d3.select('#tiles').select('table').selectAll('tr').data(dummy(20)).enter().append('tr');
		rows.selectAll('td').data(dummy(38)).enter().append('td').classed('a', function(d,i){return i>23 && i < 37});


		// Intro display
		displayIntroImage();

	});
}
