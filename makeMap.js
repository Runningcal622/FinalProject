var stateP = d3.json("stateData.json");
var cityCountyDataP = d3.csv("StateHateCrime2005.csv");
var countyDataP = d3.json("countiesData.json");
Promise.all([stateP,cityCountyDataP,countyDataP]).then(function(data)
{
  stateData = data[0];
  cityCountyData = data[1];
  countyData = data[2];
  drawMap(stateData,cityCountyData);
})


var drawMap = function(outline,dataInMap)
{
  // make the svg
  var width = 1500;
  var height = 800;
  var body = d3.select("body");
  var svg = body.append("svg")
      .attr("width",width)
      .attr("height",height);

  makeMapHaveData(outline,dataInMap);
//projection of US
  var projection = d3.geoAlbersUsa()
                    .scale([width])
                    .translate([750,400]);

  console.log(outline);
  var countyGenerator = d3.geoPath().projection(projection);
  //var colors = d3.interpolateReds();
  counties = svg.append("g").selectAll("g")
      .data(outline.features)
      .enter()
      .append("path")
      .attr("d",countyGenerator)
      .attr("stroke","gray")
      .attr("fill",function(d){
        console.log(d.properties.Incidents/100)
        return d3.interpolateReds(d.properties.IncidentsPer1000);
      })
      .on("mouseover",function(d){
        console.log(d.properties.IncidentsNom);
        svg.append("text")
          .attr("transform","translate("+countyGenerator.centroid(d)[0]+","+countyGenerator.centroid(d)[1]+")")
          .text(d.properties.IncidentsNom);
      })
      .on("mouseout",function(d){
        svg.select("text")
          .remove();
      });
}

var makeMapHaveData = function(outline,dataInMap)
{
  console.log(dataInMap);
  var curStateFeature;
  // state is dictionary of state name to number of incidents nominally and per 1000 people
  var state = {};
  var stateList=[];
  dataInMap.forEach(function(d){
    if (d.State!="")
    {
      state[d.State] = [parseInt(d.Incidents.replace(",",""))/parseInt(d.Population.replace(",",""))*10];//parseInt(d.race)+parseInt(d.religion)+parseInt(d.sexualOrientation)+parseInt(d.disability)+parseInt(d.gender);
      state[d.State].push(d.Incidents);
      stateList.push(d.State);
    }
  })
  console.log(state);
  for (var i=0;i<outline.features.length;i++)
  {
     curStateFeature = outline.features[i];
     if (stateList.indexOf(curStateFeature.properties.NAME)>=0)
     {
       console.log(curStateFeature);
       curStateFeature.properties["IncidentsPer1000"] = state[curStateFeature.properties.NAME][0];
       curStateFeature.properties["IncidentsNom"] = state[curStateFeature.properties.NAME][1];
     }
  }
}
