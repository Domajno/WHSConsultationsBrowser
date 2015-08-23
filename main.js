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
		//TODO dislay UN from blue tiles

		// Add twitter cell
		d3.select(d3.select(d3.selectAll('#tiles tr')[0][18]).selectAll('td')[0][37]).attr('id', 'tw');
	};

	var queryDocuments = function(query, documents) {

		var output = [], counter, r = new RegExp(query, 'gim'), matches;
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
		var r = new RegExp(query, 'gim');
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

	// Displaying words TODO remove that
	var data = [{"l":["humanitarian","systems"],"i":[2]},{"l":["aid","workers"],"i":[2]},{"l":["affected","populations"],"i":[2]},{"l":["humanitarian","law"],"i":[2]},{"l":["national","governments"],"i":[2]},{"l":["development","initiatives"],"i":[2]},{"l":["emergency","responses"],"i":[2]},{"l":["term","development"],"i":[2]},{"l":["humanitarian","efforts"],"i":[2]},{"l":["disasters","report"],"i":[2]},{"l":["humanitarian","organizations"],"i":[2]},{"l":["local","organizations"],"i":[2]},{"l":["humanitarian","responses"],"i":[2]},{"l":["humanitarian","standard"],"i":[2]},{"l":["working","s"],"i":[2]},{"l":["national","ngos"],"i":[2]},{"l":["community","groups"],"i":[2]},{"l":["conflict","situations"],"i":[2]},{"l":["affected","community"],"i":[2]},{"l":["many","humanitarian"],"i":[2]},{"l":["church","business"],"i":[2]},{"l":["social","media"],"i":[2]},{"l":["world","food"],"i":[2]},{"l":["innovation","ecosystem"],"i":[2]},{"l":["sector","engagement"],"i":[2]},{"l":["open","source"],"i":[2]},{"l":["innovation","management"],"i":[2]},{"l":["donor","countries"],"i":[2]},{"l":["responses","efforts"],"i":[2]},{"l":["climate","change"],"i":[2]},{"l":["middle","income"],"i":[2]},{"l":["humanitarian","work"],"i":[2]},{"l":["learning","partnership"],"i":[2]},{"l":["child","protection"],"i":[2]},{"l":["disasters","responses"],"i":[2]},{"l":["affected","countries"],"i":[2]},{"l":["humanitarian","emergencies"],"i":[2]},{"l":["refugees","children"],"i":[2]},{"l":["all","levels"],"i":[2]},{"l":["society","actors"],"i":[2]},{"l":["society","groups"],"i":[2]},{"l":["vulnerable","groups"],"i":[2]},{"l":["humanitarian","team"],"i":[2]},{"l":["decision","making"],"i":[2]},{"l":["natural","disasters"],"i":[2]},{"l":["needs","assessments"],"i":[2]},{"l":["service","providers"],"i":[2]},{"l":["local","authorities"],"i":[2]},{"l":["new","actors"],"i":[2]},{"l":["case","studies"],"i":[2]},{"l":["local","community"],"i":[2]},{"l":["contingency","funds"],"i":[2]},{"l":["post","disasters"],"i":[2]},{"l":["disasters","preparedness"],"i":[2]},{"l":["early","warning"],"i":[2]},{"l":["sustainable","development"],"i":[2]},{"l":["headed","households"],"i":[2]},{"l":["humanitarian","crises"],"i":[2]},{"l":["management","authorities"],"i":[2]},{"l":["coping","mechanisms"],"i":[2]},{"l":["innovative","solutions"],"i":[2]},{"l":["remote","management"],"i":[2]},{"l":["world","vision"],"i":[2]},{"l":["traditional","humanitarian"],"i":[2]},{"l":["international","ngos"],"i":[2]},{"l":["internally","displaced"],"i":[2]},{"l":["including","women"],"i":[2]},{"l":["online","charts"],"i":[2]},{"l":["information","sharing"],"i":[2]},{"l":["humanitarian","space"],"i":[2]},{"l":["human","rights"],"i":[2]},{"l":["disasters","affected"],"i":[2]},{"l":["cost","effective"],"i":[2]},{"l":["basic","needs"],"i":[2]},{"l":["innovation","processes"],"i":[2]},{"l":["humanitarian","workers"],"i":[2]},{"l":["disasters","risks"],"i":[2]},{"l":["making","processes"],"i":[2]},{"l":["contingency","planning"],"i":[2]},{"l":["effective","humanitarian"],"i":[2]},{"l":["humanitarian","aid"],"i":[2]},{"l":["police","army"],"i":[2]},{"l":["long","term"],"i":[2]},{"l":["new","ideas"],"i":[2]},{"l":["new","technologies"],"i":[2]},{"l":["non","traditional"],"i":[2]},{"l":["small","scale"],"i":[2]},{"l":["service","delivery"],"i":[2]},{"l":["local","capacities"],"i":[2]},{"l":["humanitarian","community"],"i":[2]},{"l":["national","actors"],"i":[2]},{"l":["international","law"],"i":[2]},{"l":["humanitarian","sector"],"i":[2]},{"l":["safety","nets"],"i":[2]},{"l":["public","health"],"i":[2]},{"l":["humanitarian","effectiveness"],"i":[2]},{"l":["mobile","money"],"i":[2]},{"l":["syrian","children"],"i":[2]},{"l":["family","local"],"i":[2]},{"l":["governments","church"],"i":[2]},{"l":["all","humanitarian"],"i":[2]},{"l":["international","humanitarian"],"i":[2]},{"l":["disasters","management"],"i":[2]},{"l":["red","cross"],"i":[2]},{"l":["data","collection"],"i":[2]},{"l":["other","actors"],"i":[2]},{"l":["un","agencies"],"i":[2]},{"l":["international","community"],"i":[2]},{"l":["information","management"],"i":[2]},{"l":["humanitarian","assistance"],"i":[2]},{"l":["aid","agencies"],"i":[2]},{"l":["local","ngos"],"i":[2]},{"l":["affected","populations"],"i":[2]},{"l":["most","effectively"],"i":[2]},{"l":["village","council"],"i":[2]},{"l":["key","stakeholders"],"i":[2]},{"l":["army","village"],"i":[2]},{"l":["prone","areas"],"i":[2]},{"l":["world","humanitarian"],"i":[2]},{"l":["humanitarian","challenges"],"i":[2]},{"l":["un","agencies"],"i":[2]},{"l":["armed","actors"],"i":[2]},{"l":["responses","funds"],"i":[2]},{"l":["innovation","funds"],"i":[2]},{"l":["sexual","violence"],"i":[2]},{"l":["states","armed"],"i":[2]},{"l":["big","data"],"i":[2]},{"l":["community","leaders"],"i":[2]},{"l":["young","people"],"i":[2]},{"l":["displaced","populations"],"i":[2]},{"l":["responses","plans"],"i":[2]},{"l":["accountability","mechanisms"],"i":[2]},{"l":["new","solutions"],"i":[2]},{"l":["humanitarian","innovation"],"i":[2]},{"l":["case","studies"],"i":[2]},{"l":["private","sector"],"i":[2]},{"l":["displaced","people"],"i":[2]},{"l":["coordination","mechanisms"],"i":[2]},{"l":["humanitarian","access"],"i":[2]},{"l":["non","states"],"i":[2]},{"l":["one","size"],"i":[2]},{"l":["people","affected"],"i":[2]},{"l":["local","capacities"],"i":[2]},{"l":["crisis","affected"],"i":[2]},{"l":["decision","makers"],"i":[2]},{"l":["national","disasters"],"i":[2]},{"l":["financial","resources"],"i":[2]},{"l":["new","approaches"],"i":[2]},{"l":["based","humanitarian"],"i":[2]},{"l":["affected","people"],"i":[2]},{"l":["million","people"],"i":[2]},{"l":["responses","capacities"],"i":[2]},{"l":["humanitarian","action"],"i":[2]},{"l":["emergency","preparedness"],"i":[2]},{"l":["international","assistance"],"i":[2]},{"l":["humanitarian","actors"],"i":[2]},{"l":["term","impact"],"i":[2]},{"l":["capacities","building"],"i":[2]},{"l":["donor","governments"],"i":[2]},{"l":["all","actors"],"i":[2]},{"l":["mobile","phones"],"i":[2]},{"l":["standing","committee"],"i":[2]},{"l":["organizations","donors"],"i":[2]},{"l":["humanitarian","responses"],"i":[2]},{"l":["natural","disasters"],"i":[2]},{"l":["financial","support"],"i":[2]},{"l":["society","organizations"],"i":[2]},{"l":["community","levels"],"i":[2]},{"l":["remaining","results"],"i":[2]},{"l":["armed","conflict"],"i":[2]},{"l":["legal","frameworks"],"i":[2]},{"l":["donors","governments"],"i":[2]},{"l":["humanitarian","funding"],"i":[2]},{"l":["based","violence"],"i":[2]},{"l":["evacuation","centres"],"i":[2]},{"l":["security","council"],"i":[2]},{"l":["community","members"],"i":[2]},{"l":["real","time"],"i":[2]},{"l":["health","services"],"i":[2]},{"l":["conflict","affected"],"i":[2]},{"l":["humanitarian","relief"],"i":[2]},{"l":["military","coordination"],"i":[2]},{"l":["member","states"],"i":[2]},{"l":["large","scale"],"i":[2]},{"l":["local","csos"],"i":[2]},{"l":["main","humanitarian"],"i":[2]},{"l":["international","organizations"],"i":[2]},{"l":["international","agencies"],"i":[2]},{"l":["income","countries"],"i":[2]},{"l":["during","disasters"],"i":[2]},{"l":["all","stakeholders"],"i":[2]},{"l":["local","people"],"i":[2]},{"l":["development","actors"],"i":[2]},{"l":["humanitarian","coordination"],"i":[2]},{"l":["people","police"],"i":[2]},{"l":["rapid","responses"],"i":[2]},{"l":["urban","areas"],"i":[2]},{"l":["humanitarian","financing"],"i":[2]},{"l":["states","actors"],"i":[2]},{"l":["disease","responses"],"i":[2]},{"l":["health","care"],"i":[2]},{"l":["protracted","crises"],"i":[2]},{"l":["country","levels"],"i":[2]},{"l":["longer","term"],"i":[2]},{"l":["host","governments"],"i":[2]},{"l":["christian","aid"],"i":[2]},{"l":["scale","disasters"],"i":[2]},{"l":["humanitarian","needs"],"i":[2]},{"l":["social","networks"],"i":[2]},{"l":["risks","management"],"i":[2]},{"l":["disaggregated","data"],"i":[2]},{"l":["lessons","learned"],"i":[2]},{"l":["united","nations"],"i":[2]},{"l":["humanitarian","issues"],"i":[2]},{"l":["humanitarian","agencies"],"i":[2]},{"l":["short","term"],"i":[2]},{"l":["local","actors"],"i":[2]},{"l":["risks","reduction"],"i":[2]},{"l":["coordination","structures"],"i":[2]},{"l":["local","community"],"i":[2]},{"l":["civil","military"],"i":[2]},{"l":["national","levels"],"i":[2]},{"l":["agencies","standing"],"i":[2]},{"l":["private","companies"],"i":[2]},{"l":["warning","systems"],"i":[2]},{"l":["national","governments"],"i":[2]},{"l":["life","saving"],"i":[2]},{"l":["corruption","risks"],"i":[2]},{"l":["contingency","plans"],"i":[2]},{"l":["working","together"],"i":[2]},{"l":["affected","states"],"i":[2]},{"l":["humanitarian","operations"],"i":[2]},{"l":["syrian","refugees"],"i":[2]},{"l":["rights","law"],"i":[2]},{"l":["counter","terrorism"],"i":[2]},{"l":["national","society"],"i":[2]},{"l":["other","humanitarian"],"i":[2]},{"l":["local","markets"],"i":[2]},{"l":["private","sector"],"i":[2]},{"l":["community","resilience"],"i":[2]},{"l":["regional","organizations"],"i":[2]},{"l":["civil","society"],"i":[2]},{"l":["good","practices"],"i":[2]},{"l":["innovation","processes"],"i":[2]},{"l":["non","governmental"],"i":[2]},{"l":["humanitarian","donors"],"i":[2]},{"l":["family","planning"],"i":[2]},{"l":["populations","growth"],"i":[2]},{"l":["humanitarian","organizations"],"i":[2]},{"l":["humanitarian","summit"],"i":[2]},{"l":["syrian","refugees"],"i":[2]},{"l":["sea","levels"],"i":[2]},{"l":["armed","groups"],"i":[2]},{"l":["key","messages"],"i":[2]},{"l":["host","community"],"i":[2]},{"l":["displaced","people"],"i":[2]},{"l":["overseas","development"],"i":[2]},{"l":["affected","areas"],"i":[2]},{"l":["sector","organizations"],"i":[2]},{"l":["funding","mechanisms"],"i":[2]},{"l":["world","bank"],"i":[2]},{"l":["humanitarian","principles"],"i":[2]},{"l":["best","practices"],"i":[2]},{"l":["cash","transfers"],"i":[2]},{"l":["effective","responses"],"i":[2]},{"l":["east","asia"],"i":[2]},{"l":["mobile","phones"],"i":[2]},{"l":["food","security"],"i":[2]},{"l":["post","conflict"],"i":[2]},{"l":["local","governments"],"i":[2]},{"l":["world","disasters"],"i":[2]},{"l":["local","levels"],"i":[2]},{"l":["international","actors"],"i":[2]},{"l":["international","federation"],"i":[2]},{"l":["cash","learning"],"i":[2]},{"l":["disasters","risks"],"i":[2]}];

	// Load data
	d3.json("data.json", function(json) {

		var triggerSearch = function(query) {

			clearActiveTiles();			
			var queryResults = queryDocuments(query.join(' '), json['docs']),
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
				//TODO scroll #results to the top

				var doc = json['docs'][queryResult['doc']], replacement;
console.log(queryResult['doc']);
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

					replacement = highlightQuery(query.join(' '), doc[1][section]);

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
			}).style('background-color', function(queryResult) { 
				return 'rgba(0, 173, 239, ' + scale(queryResult['count']) + ')';
			});
		};

		var divs = d3.select('#labels').selectAll('span').data(
				d3.set(data.map(function(d){return d['l'][0];})).values().sort()
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
			
			var corresponding = data.reduce(function(a,b) {
					if(b['l'][0] === text)
						a.push(b['l'][1]);
						return a;
				}, []);

			d3.select(this.parentElement).select('ul').selectAll('li').data(corresponding).enter().append('li')
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
		rows.selectAll('td').data(dummy(40)).enter().append('td').classed('a', function(d,i){return i>25 && i < 39});


		// Intro display
		displayIntroImage();

	});
}
