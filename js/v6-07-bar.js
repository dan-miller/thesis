var data = [6, 6, 15, 18, 6, 6, 6];

var labels = ["CHE",
              "CE",
              "ECE",
              "ENGR",
              "MSE",
              "MAE",
              "SYS"];

var w = 900,
   h = 230,
   x = d3.scale.linear().domain([0, 20]).range([0, w]),
   y = d3.scale.ordinal().domain(d3.range(data.length)).rangeBands([0, h], .2);

var vis = d3.select("div#v607bar")
 .append("svg:svg")
   .attr("width", w + 40)
   .attr("height", h + 20)
 .append("svg:g")
   .attr("transform", "translate(20,0)");

var bars = vis.selectAll("g.bar")
   .data(data)
 .enter().append("svg:g")
   .attr("class", "bar")
   .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

bars.append("svg:rect")
   .attr("fill", "steelblue")
   .attr("width", x)
   .attr("height", y.rangeBand());

bars.append("svg:text")
   .attr("x", x)
   .attr("y", y.rangeBand() / 2)
   .attr("dx", -6)
   .attr("dy", ".35em")
   .attr("fill", "white")
   .attr("text-anchor", "end")
   .text(x.tickFormat(10));

bars.append("svg:text")
   .attr("x", 0)
   .attr("y", y.rangeBand() / 2)
   .attr("dx", 9)
   .attr("dy", ".35em")
   .attr("fill", "white")
   .text(function(d, i) { return labels[i] });

var rules = vis.selectAll("g.rule")
   .data(x.ticks(10))
 .enter().append("svg:g")
   .attr("class", "rule")
   .attr("transform", function(d) { return "translate(" + x(d) + ", 0)"; });

rules.append("svg:line")
   .attr("y1", h)
   .attr("y2", h - 250)
   .attr("stroke", "gray");

rules.append("svg:text")
   .attr("y", h + 9)
   .attr("dy", ".71em")
   .attr("text-anchor", "middle")
   .text(x.tickFormat(10));

vis.append("svg:line")
   .attr("y1", 0)
   .attr("y2", h)
   .attr("stroke", "black");
