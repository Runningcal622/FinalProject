var stateP = d3.json("stateData.json");
var stateHCP = d3.csv("StateHateCrime2005.csv");
var countyDataP = d3.json("countiesData.json");
var countyHCP = d3.csv("byCityCounty.csv");
var citiesP = d3.csv("USCitites.csv");
var otherCitiesP = d3.csv("csvData.csv");

Promise.all([stateP,stateHCP,countyDataP,countyHCP,citiesP,otherCitiesP]).then(function(data)
{
  stateData = data[0];
  stateHC = data[1];
  countyData = data[2];
  countyHC = data[3];
  cities = data[4];
  otherCities = data[5];
  console.log(otherCities);
  numbersToStates = getNumberToStates(stateData);
  console.log(numbersToStates);
  drawCountyMap(countyData,countyHC,cities,numbersToStates,otherCities);
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



var drawCountyMap = function(outline,dataInMap,cities,numbersToStates,otherCitites)
{
  var width = 1500;
  var height = 800;
  var body = d3.select("body");
  var svg = body.append("svg")
      .attr("width",width)
      .attr("height",height);
  //console.log(dataInMap);

  //makeStateCountyTo(outline,)
  giveCountiesData(outline,dataInMap,cities,numbersToStates,otherCities);

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
    else {
      return  "gray";
    }
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
  otherCities.forEach(function(d)
  {
  //  console.log(d.City,d.County,d["State full"]);
    citiesStatesToCountyStates[d.City+d["State full"]] = d.County.toLowerCase()+d["State full"];
    citiesStatesToCountyStates[d["City alias"]+d["State full"]] = d.County.toLowerCase()+d["State full"];

  })
  console.log(cities);
  cities.forEach(function(d)
  {
  //  console.log(d.City,d.County,d["State full"]);
    citiesStatesToCountyStates[d.city+d.state_name] = d.county_name.toLowerCase()+d.state_name;

  })


 var countyStatesToCounty={};
 outline.features.forEach(function(d)
{
  if (d.properties.NAME=="Pendleton")
  {
  //  console.log(d);
  }
  //console.log(d.properties.NAME+d.properties.StateName)
  countyStatesToCounty[d.properties.NAME.toLowerCase()+d.properties.StateName] = d;
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
      var curCounty = countyStatesToCounty[citiesStatesToCountyStates[d.agency.replace("Township","").trim().replace("2","").replace("3","")+curState]];
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
      else {
        console.log(d.agency,curState);
      }
      // if (d.agency=="Juneau")
      // {
      //   console.log(d);
      //   console.log(countyStatesToCounty[citiesStatesToCountyStates[d.agency+curState]]
      //   .properties["race"] = 1000);
      // }
    }
    if (d.specifier!="Counties" && curSpecifier=="Counties")
    {
      var curCounty = countyStatesToCounty[citiesStatesToCountyStates[d.agency+curState]];
    //  console.log(d);
    // if (d.agency=="Maricopa")
    // {
    //   console.log(d);
    //   console.log(countyStatesToCounty[citiesStatesToCountyStates[d.agency+curState]]
    //   .properties["race"] = 1000);
    // }

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
