// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var graph = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = graph.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(data) {
  // Find data how it is given  
  console.log(data);
  
  data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.smokes = +data.smokes;
    });

    // Create scalelinear functions
    var xlinscale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty), d3.max(data, d => d.poverty)])
      .range([0, width]);

    var ylinscale = d3.scaleLinear()
      .domain([d3.min(data, d => d.smokes), d3.max(data, d => d.smokes)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xlinscale);
    var leftAxis = d3.axisLeft(ylinscale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", pov => xlinscale(pov.poverty))
      .attr("cy", smoke => ylinscale(smoke.smokes))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", "1");

      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return ("anything");
      });

      chartGroup.call(toolTip);
      circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    var text = chartGroup.append("g").selectAll("text")
                  .data(data)
                  .enter()
                  .append("text")
                  .attr("x", d => xlinscale(d.poverty))
                  .attr("y", d => ylinscale(d.smokes))
                  .attr("fill", "white")
                  .style("opacity", "0.8")
                  .attr("text-anchor",  "middle")
                  .text(function(abbrev) {
                      return abbrev.abbr
                    });

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .text("Smokers (%)");
              
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2} , ${height + margin.top + 30})`)
      .text("Poverty Rate (%)")
}).catch(function(error) {
  console.log(error);
});



