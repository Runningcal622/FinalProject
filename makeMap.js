var stateP = d3.json("stateData.json");
var stateHCP = d3.csv("StateHateCrime2005.csv");
var countyDataP = d3.json("countiesData.json");
var countyHCP = d3.csv("byCityCounty.csv");
var citiesP = d3.csv("USCitites.csv");

Promise.all([stateP,stateHCP,countyDataP,countyHCP,citiesP]).then(function(data)
{
  stateData = data[0];
  stateHC = data[1];
  countyData = data[2];
  countyHC = data[3];
  cities = data[4];
  numbersToStates = getNumberToStates(stateData);
  console.log(numbersToStates);
  drawCountyMap(countyData,countyHC,cities,numbersToStates);
//  drawStateMap(stata,stateHC);
})

// creates object with the number of the state corresponding to the state name
var  getNumberToStates= function(countyData)
{
  nStates = {};
  countyData.features.forEach(function(d){
    nStates[parseInt(d.properties.STATE)] = d.properties.NAME;
  });
  return nStates;
}



var drawCountyMap = function(outline,dataInMap,cities,numbersToStates)
{
  var width = 1500;
  var height = 800;
  var body = d3.select("body");
  var svg = body.append("svg")
      .attr("width",width)
      .attr("height",height);
  //console.log(dataInMap);

  //makeStateCountyTo(outline,)
  giveCountiesData(outline,dataInMap,cities,numbersToStates);

  var projection = d3.geoAlbersUsa()
                    .scale([width])
                    .translate([750,400]);

  var countyGenerator = d3.geoPath().projection(projection);
  //var colors = d3.interpolateReds();
  counties = svg.append("g").selectAll("g")
      .data(outline.features)
      .enter()
      .append("path")
      .attr("d",countyGenerator)
      .attr("stroke","gray")
      .attr("fill",function(d)
    {
        if (d.properties.race>0){
      return d3.interpolateReds(d.properties.race/100);
    }
    // else {
    //   return  d3.interpolateReds(0);
    // }
    })
      .on("mouseover",function(d){
      });
}




var giveCountiesData = function(outline,dataInMap,cities,numbersToStates)
{
  counties = {};
  for (var i=0;i<outline.features.length;i++)
  {
      curCounty = outline.features[i];
      curCounty.properties["StateName"] = numbersToStates[parseInt(curCounty.properties.STATE)];
  }
  //make cityState map to countyState
  citiesStatesToCountyStates={};
  cities.forEach(function(d)
  {
    citiesStatesToCountyStates[d.city+d.state_name] = d.county_name+d.state_name;
  })
  var pNames = Object.keys(citiesStatesToCountyStates);
  console.log(pNames);
  pnames.forEach(function(d){
    if (d.includes("Juneau"))
    {
      console.log(d);
    }
  })
 //make countyState map to the actual drawn county
 var countyStatesToCounty={};
 outline.features.forEach(function(d)
{
  countyStatesToCounty[d.properties.NAME+d.properties.StateName] = d;
})
  var curState="";
  var curSpecifier="";
  dataInMap.forEach(function(d)
  {
    if (d.State!="")
    {
      curState=d.State;
    }
    if (d.specifier=="Cities")
    {
      curSpecifier="Cities";
    }
    else if (d.specifier=="Metropolitan Counties" || d.specifier=="NonMetropolitan Counties")
    {
      curSpecifier="Counties";
    }
    else if(d.specifier!="")
    {
      curSpecifier="notCities";
    }

    if (d.specifier!="Cities" && curSpecifier=="Cities")
    {
      //get the county
      var curCounty = countyStatesToCounty[citiesStatesToCountyStates[d.agency+curState]];
    //  console.log(d);
      if (curCounty!=undefined)
      {
        if (curCounty.properties["race"]==undefined)
        {
          curCounty.properties["race"]=0;
        }
        curCounty.properties["race"] = curCounty.properties["race"]+parseInt(d.race);
      ///  console.log("curCounty",curCounty);
      }
    }
    if (d.specifier!="Counties" && curSpecifier=="Counties")
    {
      var curCounty = countyStatesToCounty[citiesStatesToCountyStates[d.agency+curState]];
    //  console.log(d);
      if (curCounty!=undefined)
      {
        if (curCounty.properties["race"]==undefined)
        {
          curCounty.properties["race"]=0;
        }
        curCounty.properties["race"] = curCounty.properties["race"]+parseInt(d.race);
    }

  }
})
}


var drawStateMap = function(outline,dataInMap)
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

  //console.log(outline);
  var countyGenerator = d3.geoPath().projection(projection);
  //var colors = d3.interpolateReds();
  counties = svg.append("g").selectAll("g")
      .data(outline.features)
      .enter()
      .append("path")
      .attr("d",countyGenerator)
      .attr("stroke","gray")
      .attr("fill",function(d){
        //console.log(d.properties.Incidents/100)
        return d3.interpolateReds(d.properties.IncidentsPer1000);
      })
      .on("mouseover",function(d){
        //console.log(d.properties.IncidentsNom);
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
//  console.log(dataInMap);
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
////  console.log(state);
  for (var i=0;i<outline.features.length;i++)
  {
     curStateFeature = outline.features[i];
     if (stateList.indexOf(curStateFeature.properties.NAME)>=0)
     {
      // console.log(curStateFeature);
       curStateFeature.properties["IncidentsPer1000"] = state[curStateFeature.properties.NAME][0];
       curStateFeature.properties["IncidentsNom"] = state[curStateFeature.properties.NAME][1];
     }
  }
}
