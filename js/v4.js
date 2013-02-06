var all_data;

$.getJSON('php_json/get_bubble_data.php', function(data) {
  all_data = data
});

var diameter = 1300,
    format = d3.format(",d"),
    color = d3.scale.category10();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#v4").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.json('php_json/v4.php?ts_param=2013-01-22%2022:36:00', function(error, root) {
  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("id", function(d){return d.className})
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .attr("id", function(d){return d.className})
      .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.className.indexOf('-')); });
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");

var ts = ["2012-11-04 22:36:00",
"2012-11-05 12:36:00",
"2012-11-05 19:36:00",
"2012-11-05 22:36:00",
"2012-11-06 12:36:00",
"2012-11-06 19:36:00",
"2012-11-06 22:36:00",
"2012-11-07 12:36:00",
"2012-11-07 19:36:00",
"2012-11-07 22:36:00",
"2012-11-08 12:36:00",
"2012-11-08 19:36:00",
"2012-11-08 22:36:00",
"2012-11-09 12:36:00",
"2012-11-09 19:36:00",
"2012-11-09 22:36:00",
"2012-11-10 12:36:00",
"2012-11-10 19:36:00",
"2012-11-10 22:36:00",
"2012-11-11 12:36:00",
"2012-11-11 19:36:00",
"2012-11-11 22:36:00",
"2012-11-12 12:36:00",
"2012-11-12 19:36:00",
"2012-11-12 22:36:00",
"2012-11-13 12:36:00",
"2012-11-13 19:36:00",
"2012-11-13 22:36:00",
"2012-11-14 12:36:00",
"2012-11-14 19:36:00",
"2012-11-14 22:36:00",
"2012-11-15 12:36:00",
"2012-11-15 19:36:00",
"2012-11-15 22:36:00",
"2012-11-16 12:36:00",
"2012-11-16 19:36:00",
"2012-11-16 22:36:00",
"2012-11-17 12:36:00",
"2012-11-17 19:36:00",
"2012-11-17 22:36:00",
"2012-11-18 12:36:00",
"2012-11-18 19:36:00",
"2012-11-18 22:36:00",
"2012-11-19 12:36:00",
"2012-11-19 19:36:00",
"2012-11-19 22:36:00",
"2012-11-20 12:36:00",
"2012-11-20 19:36:00",
"2012-11-20 22:36:00",
"2012-11-21 12:36:00",
"2012-11-21 19:36:00",
"2012-11-21 22:36:00",
"2012-11-22 12:36:00",
"2012-11-22 19:36:00",
"2012-11-22 22:36:00",
"2012-11-23 12:36:00",
"2012-11-23 19:36:00",
"2012-11-23 22:36:00",
"2012-11-24 12:36:00",
"2012-11-24 19:36:00",
"2012-11-24 22:36:00",
"2012-11-25 12:36:00",
"2012-11-25 19:36:00",
"2012-11-25 22:36:00",
"2012-11-26 12:36:00",
"2012-11-26 19:36:00",
"2012-11-26 22:36:00",
"2012-11-27 12:36:00",
"2012-11-27 19:36:00",
"2012-11-27 22:36:00",
"2012-11-28 12:36:00",
"2012-11-28 19:36:00",
"2012-11-28 22:36:00",
"2012-11-29 12:36:00",
"2012-11-29 19:36:00",
"2012-11-29 22:36:00",
"2012-11-30 12:36:00",
"2012-11-30 19:36:00",
"2012-11-30 22:36:00",
"2012-12-01 12:36:00",
"2012-12-01 19:36:00",
"2012-12-01 22:36:00",
"2012-12-02 12:36:00",
"2012-12-02 19:36:00",
"2012-12-02 22:36:00",
"2012-12-03 12:36:00",
"2012-12-03 19:36:00",
"2012-12-03 22:36:00",
"2012-12-04 12:36:00",
"2012-12-04 19:36:00",
"2012-12-04 22:36:00",
"2012-12-05 12:36:00",
"2012-12-05 19:36:00",
"2012-12-05 22:36:00",
"2012-12-06 12:36:00",
"2012-12-06 19:36:00",
"2012-12-06 22:36:00",
"2012-12-07 12:36:00",
"2012-12-07 19:36:00",
"2012-12-07 22:36:00",
"2012-12-08 12:36:00",
"2012-12-08 19:36:00",
"2012-12-08 22:36:00",
"2012-12-09 12:36:00",
"2012-12-09 19:36:00",
"2012-12-09 22:36:00",
"2012-12-10 12:36:00",
"2012-12-10 19:36:00",
"2012-12-10 22:36:00",
"2012-12-11 12:36:00",
"2012-12-11 19:36:00",
"2012-12-11 22:36:00",
"2012-12-12 12:36:00",
"2012-12-12 19:36:00",
"2012-12-12 22:36:00",
"2012-12-13 12:36:00",
"2012-12-13 19:36:00",
"2012-12-13 22:36:00",
"2012-12-14 12:36:00",
"2012-12-14 19:36:00",
"2012-12-14 22:36:00",
"2012-12-15 12:36:00",
"2012-12-15 19:36:00",
"2012-12-15 22:36:00",
"2012-12-16 12:36:00",
"2012-12-16 19:36:00",
"2012-12-16 22:36:00",
"2012-12-17 12:36:00",
"2012-12-17 19:36:00",
"2012-12-17 22:36:00",
"2012-12-18 12:36:00",
"2012-12-18 19:36:00",
"2012-12-18 22:36:00",
"2012-12-19 12:36:00",
"2012-12-19 19:36:00",
"2012-12-19 22:36:00",
"2012-12-20 12:36:00",
"2012-12-20 19:36:00",
"2012-12-20 22:36:00",
"2012-12-21 12:36:00",
"2012-12-21 19:36:00",
"2012-12-21 22:36:00",
"2012-12-22 12:36:00",
"2012-12-22 19:36:00",
"2012-12-22 22:36:00",
"2012-12-23 12:36:00",
"2012-12-23 19:36:00",
"2012-12-23 22:36:00",
"2012-12-24 12:36:00",
"2012-12-24 19:36:00",
"2012-12-24 22:36:00",
"2012-12-25 12:36:00",
"2012-12-25 19:36:00",
"2012-12-25 22:36:00",
"2012-12-26 12:36:00",
"2012-12-26 19:36:00",
"2012-12-26 22:36:00",
"2012-12-27 12:36:00",
"2012-12-27 19:36:00",
"2012-12-27 22:36:00",
"2012-12-28 12:36:00",
"2012-12-28 19:36:00",
"2012-12-28 22:36:00",
"2012-12-29 12:36:00",
"2012-12-29 19:36:00",
"2012-12-29 22:36:00",
"2012-12-30 12:36:00",
"2012-12-30 19:36:00",
"2012-12-30 22:36:00",
"2012-12-31 12:36:00",
"2012-12-31 19:36:00",
"2012-12-31 22:36:00",
"2013-01-01 12:36:00",
"2013-01-01 19:36:00",
"2013-01-01 22:36:00",
"2013-01-02 12:36:00",
"2013-01-02 19:36:00",
"2013-01-02 22:36:00",
"2013-01-03 12:36:00",
"2013-01-03 19:36:00",
"2013-01-03 22:36:00",
"2013-01-04 12:36:00",
"2013-01-04 19:36:00",
"2013-01-04 22:36:00",
"2013-01-05 12:36:00",
"2013-01-05 19:36:00",
"2013-01-05 22:36:00",
"2013-01-06 12:36:00",
"2013-01-06 19:36:00",
"2013-01-06 22:36:00",
"2013-01-07 12:36:00",
"2013-01-07 19:36:00",
"2013-01-07 22:36:00",
"2013-01-08 12:36:00",
"2013-01-08 19:36:00",
"2013-01-08 22:36:00",
"2013-01-09 12:36:00",
"2013-01-09 19:36:00",
"2013-01-09 22:36:00",
"2013-01-10 12:36:00",
"2013-01-10 19:36:00",
"2013-01-10 22:36:00",
"2013-01-11 12:36:00",
"2013-01-11 19:36:00",
"2013-01-11 22:36:00",
"2013-01-12 12:36:00",
"2013-01-12 19:36:00",
"2013-01-12 22:36:00",
"2013-01-13 12:36:00",
"2013-01-13 19:36:00",
"2013-01-13 22:36:00",
"2013-01-14 12:36:00",
"2013-01-14 19:36:00",
"2013-01-14 22:36:00",
"2013-01-15 12:36:00",
"2013-01-15 19:36:00",
"2013-01-15 22:36:00",
"2013-01-16 12:36:00",
"2013-01-16 19:36:00",
"2013-01-16 22:36:00",
"2013-01-17 12:36:00",
"2013-01-17 19:36:00",
"2013-01-17 22:36:00",
"2013-01-18 12:36:00",
"2013-01-18 19:36:00",
"2013-01-18 22:36:00",
"2013-01-19 12:36:00",
"2013-01-19 19:36:00",
"2013-01-19 22:36:00",
"2013-01-20 12:36:00",
"2013-01-20 19:36:00",
"2013-01-20 22:36:00",
"2013-01-21 12:36:00",
"2013-01-21 19:36:00",
"2013-01-21 22:36:00",
"2013-01-22 12:36:00",
"2013-01-22 19:36:00",
"2013-01-22 22:36:00"];

$('#info').text("lollerskates");

$( '#slider' ).slider({
  min: 0,
  max: ts.length - 1,
  step: 1,
  slide: function(event, ui) {
    $( '#info' ).text("Showing timestamp: " + ts[ui.value]);
    $( '#v4 svg.bubble g circle' ).each(function(d) {
      var param = $(this).attr("id") + "-" + ts[ui.value];
      $(this).attr("r", (parseFloat(all_data[param])));
    })
  }
});