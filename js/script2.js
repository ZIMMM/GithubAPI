
var username, password;
var repoCache = {};
	var username = "";

   	var simulation;

function NoPass (){
	username = $('#username').val();


	followers(username);  // prints graph of user and followers


}



function simulate(graph) {                                   //d3js function for interactive node graph
   		svg.selectAll(".links").remove();
   		svg.selectAll(".nodes").remove();
   		svg.selectAll(".texts").remove();
   		if (simulation) simulation.stop();

	   	var color = d3.scaleOrdinal(d3.schemeCategory20);

		simulation = d3.forceSimulation()
		    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(100))
		    .force("charge", d3.forceManyBody())
		    .force("center", d3.forceCenter(500, 150));

		var link = svg.append("g").attr("class", "links").selectAll("line").data(graph.links)
			.enter().append("line")
	    	.attr("stroke", "pink")
	    	.attr("stroke-width", function(d) { return Math.sqrt(d.value); })
		var node = svg.append("g").attr("class", "nodes").selectAll("circle").data(graph.nodes)
			.enter().append("circle")
	    	.attr("r", function(d) { return d.size })
	    	.attr("fill", function(d) { return "red"; })
	    	.attr("stroke", function(d) {return color("red"); })
	    	.attr("stroke-width", 8)
	    	.call(d3.drag()
	        	.on("start", dragstarted)
	        	.on("drag", dragged)
	        	.on("end", dragended))

		var text = svg.append("g").attr("class", "texts").selectAll("text").data(graph.nodes).enter().append("text")
			.text(node => node.id)
		    .attr("font-size", 10)
		    .attr("dx", 15)
		    .attr("dy", 4);

		function ticked() {
		    link
		        .attr("x1", function(d) { return d.source.x; })
		        .attr("y1", function(d) { return d.source.y; })
		        .attr("x2", function(d) { return d.target.x; })
		        .attr("y2", function(d) { return d.target.y; });
		    node
		        .attr("cx", function(d) { return d.x; })
		        .attr("cy", function(d) { return d.y; });
			text
				.attr("x", node => node.x)
				.attr("y", node => node.y)
		}

		function dragstarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}

		function dragended(d) {
			if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}


		simulation.nodes(graph.nodes).on("tick", ticked);
		simulation.force("link")
			.links(graph.links);
	}

	function followers(name) {
		username = name;
		if (username.length == 0) return;

   		var hash = {}, index = {};
   		var nodes = [], links = [];

   		hash[username] = {"id": username, "group": 0, "size": 15};
   		nodes.push(hash[username]);

   		$.ajax({
   			url: "https://api.github.com/users/"+username,

   		}).done(function(user) {

   			$.ajax({
				url: "https://api.github.com/users/"+username+"/followers",

   			}).done(function(followers) {
   				$.each(followers, function(_, follower) {
   					hash[follower.login] = {"id": follower.login, "group": 1, "size": 7};
			   		nodes.push(hash[follower.login]);
			   		links.push({"source": username, "target": follower.login});
			   		links.push({"target": username, "source": follower.login});
   				});

   				$.each(followers, function(_, follower) {
   					$.ajax({
						url: "https://api.github.com/users/"+follower.login+"/followers",

		   			}).done(function(f2) {
		   				$.each(f2, function(_, f2er) {
		   					if (!hash[f2er.login]) {
			   					hash[f2er.login] = {"id": f2er.login, "group": 2, "size": 5};
						   		nodes.push(hash[f2er.login]);
						   	}
						   	links.push({"source": follower.login, "target": f2er.login});
						   	links.push({"target": follower.login, "source": f2er.login});
		   				});
						simulate(JSON.parse(JSON.stringify({"nodes": nodes, "links": links})));
						console.log(JSON.stringify({"nodes": nodes, "links": links}))
		   			});
   				});
   			});

   		});
	}