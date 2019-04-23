var countiesP = d3.json("countiesData.json");
countiesP.then(function(countyData)
{
  drawMap(countyData);
})


var drawMap = function(countyData)
{
  var width = 800;
  var height = 800;
  var body = d3.select("body");
  var svg = body.append("svg")
      .attr("width",width)
      .attr("height",height);

  var projection = d3.geoAlbersUsa()
                    .translate(width/2,height/2);

  console.log(countyData.features);
  var countyGenerator = d3.geoPath().projection(projection);

  counties = svg.selectAll("g")
      .data(countyData.features)
      .enter()
      .append("g")

  counties.append("path")
      .attr("d",countyGenerator);


}
