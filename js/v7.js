var all_sections_data;

$.getJSON('php_json/acceldata.php', function(data) {
  all_sections_data = data
});

var all_courses_data;

$.getJSON('php_json/acceldatagrouped.php', function(data) {
  all_courses_data = data;
})

var margin = {top: 20, right: 0, bottom: 0, left: 0},
    width = 1200,
    height = 900,
    color = d3.scale.ordinal().range(["#848484"]),
    formatNumber = d3.format(",d"),
    transitioning;

var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

var treemap = d3.layout.treemap()
    .children(function(d, depth) { return depth ? null : d.children; })
    .sort(function(a, b) { return a.value - b.value; })
    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
    .round(false);

var svg = d3.select("div#v7").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .style("margin-left", -margin.left + "px")
    .style("margin.right", -margin.right + "px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("shape-rendering", "crispEdges");

var grandparent = svg.append("g")
    .attr("class", "grandparent");

grandparent.append("rect")
    .attr("y", -margin.top)
    .attr("width", width)
    .attr("height", margin.top);

grandparent.append("text")
    .attr("x", 6)
    .attr("y", 6 - margin.top)
    .attr("dy", ".75em");

d3.json("php_json/v3.php", function(root) {

  initialize(root);
  accumulate(root);
  layout(root);
  display(root);

  function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
  }

  // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  function accumulate(d) {
    return d.children
        ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
        : d.value;
  }

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  function layout(d) {
    if (d.children) {
      treemap.nodes({children: d.children});
      d.children.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        layout(c);
      });
    }
  }

  function display(d) {
    grandparent
        .datum(d.parent)
        .on("click", transition)
      .select("text")
        .text(name(d));

    var g1 = svg.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

    var g = g1.selectAll("g")
        .data(d.children)
      .enter().append("g");

    g.filter(function(d) { return d.children; })
        .classed("children", true)
        .on("click", transition);

    g.selectAll(".child")
        .data(function(d) { return d.children || [d]; })
      .enter().append("rect")
        .attr("class", "child").style("fill", function(d) { return color(d.parent.name); })
        .attr("id", function(d){if(d.name.length == 4) {return d.parent.name + "-" + d.name} else return d.name})
        .call(rect);

    g.append("rect")
        .attr("class", "parent")
        .call(rect)
      .append("title")
        .text(function(d) { return formatNumber(d.value); });

    g.append("text")
        .attr("dy", ".75em")
        .text(function(d) { return d.name; })
        .call(text);

    function transition(d) {
      if (transitioning || !d) return;
      transitioning = true;

      var g2 = display(d),
          t1 = g1.transition().duration(750),
          t2 = g2.transition().duration(750);

      // Update the domain only after entering new elements.
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      // Enable anti-aliasing during the transition.
      svg.style("shape-rendering", null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

      // Fade-in entering text.
      g2.selectAll("text").style("fill-opacity", 0);

      // Transition to the new view.
      t1.selectAll("text").call(text).style("fill-opacity", 0);
      t2.selectAll("text").call(text).style("fill-opacity", 1);
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().each("end", function() {
        svg.style("shape-rendering", "crispEdges");
        transitioning = false;
      });
    }

    return g;
  }

  function text(text) {
    text.attr("x", function(d) { return x(d.x) + 6; })
        .attr("y", function(d) { return y(d.y) + 6; });
  }

  function rect(rect) {
    rect.attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
        .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
  }

  function name(d) {
    return d.parent
        ? name(d.parent) + "." + d.name
        : d.name;
  }
});

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

$('#info').text("Drag slider to select time");

$( '#slider' ).slider({
  min: 0,
  max: ts.length - 1,
  step: 1,
  slide: function(event, ui) {
    $( '#info' ).text("Showing timestamp: " + ts[ui.value]);
    $( '#v7 rect.child').each(function(d){
      if($(this).attr("id").length < 10) {
        var param = $(this).attr("id") + "-" + ts[ui.value];
        var newValue = all_courses_data[param];
        if (isNaN(newValue)) {newValue = "0"};
        if(newValue == 0) { $(this).attr("style" , "fill: #848484;") }
        else if(newValue < 0) { $(this).attr("style" , "fill: #0AF5E9;") }
        else if((newValue > 0) && (newValue <= 2)) { $(this).attr("style" , "fill: #0AF560;") }
        else if((newValue > 2) && (newValue <= 10)) { $(this).attr("style" , "fill: #0CB349;") }
        else if((newValue > 10) && (newValue <= 18)) { $(this).attr("style" , "fill: #FA8723;") }
        else if((newValue > 18)) { $(this).attr("style" , "fill: #FF0000;") }
        else {$(this).attr("style" , "fill: #848484;")};
      } else {
        var param = $(this).attr("id") + "-" + ts[ui.value];
        var newValue = all_sections_data[param];
        if (isNaN(newValue)) {newValue = "0"};
        if(newValue == 0) { $(this).attr("style" , "fill: #848484;") }
        else if(newValue < 0) { $(this).attr("style" , "fill: #0AF5E9;") }
        else if((newValue > 0) && (newValue <= 2)) { $(this).attr("style" , "fill: #0AF560;") }
        else if((newValue > 2) && (newValue <= 8)) { $(this).attr("style" , "fill: #0CB349;") }
        else if((newValue > 8) && (newValue <= 14)) { $(this).attr("style" , "fill: #FA8723;") }
        else if((newValue > 14)) { $(this).attr("style" , "fill: #FF0000;") }
        else {$(this).attr("style" , "fill: #848484;")}
      };
    })
  }
});
