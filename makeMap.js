var stateP = d3.json("stateData.json");
var stateHCP = d3.csv("StateHateCrime2005.csv");
var countyDataP = d3.json("countiesData.json");
var countyHCP = d3.csv("2007CityCounty.csv");
var countyHCP2 = d3.csv("2008CityCounty.csv");
var countyHCP3 = d3.csv("2009CityCounty.csv");
var countyHCP4 = d3.csv("2010CityCounty.csv");
var countyHCP5 = d3.csv("2011CityCounty.csv");
var countyHCP6 = d3.csv("2012CityCounty.csv");
var countyHCP7 = d3.csv("2013CityCounty.csv");
var countyHCP8 = d3.csv("2014CityCounty.csv");
var countyHCP9 = d3.csv("2015CityCounty.csv");

var citiesP = d3.csv("USCitites.csv");
var otherCitiesP = d3.csv("csvData.csv");

Promise.all([stateP,stateHCP,countyDataP,countyHCP,citiesP,otherCitiesP,countyHCP2,countyHCP3
  ,countyHCP4,countyHCP5,countyHCP6,countyHCP6,countyHCP7,countyHCP8,countyHCP9]).then(function(data)
{
//  d3.select("body").append("text").attr("id","mode").text("1").style("opacity",0);
  stateData = data[0];
  stateHC = data[1];
  countyData = data[2];
  countyHC = data[3];
  cities = data[4];
  otherCities = data[5];
  countyHC2 = data[6];
  countyHC3 = data[7];
  countyHC4 = data[8];
  countyHC5 = data[9];
  countyHC6 = data[10];
  countyHC7 = data[11];
  countyHC8 = data[12];
  countyHC9 = data[13];
  countyHC = countyHC.concat(countyHC2);
  countyHC = countyHC.concat(countyHC3);
  countyHC = countyHC.concat(countyHC4);
  countyHC = countyHC.concat(countyHC5);
  countyHC = countyHC.concat(countyHC6);
  countyHC = countyHC.concat(countyHC7);
  countyHC = countyHC.concat(countyHC8);
  countyHC = countyHC.concat(countyHC9);
  //console.log(otherCities);
  numbersToStates = getNumberToStates(stateData);
  //console.log(numbersToStates);
  drawCountyMap(countyData,countyHC,cities,numbersToStates,otherCities,stateData);
//  drawStateMap(stateData,stateHC);
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

var updateMap = function(direction)
{
  // get the year that is being showed currently
  var myYear = d3.select("#theYear").node().innerText;
  //console.log(myYear);
  var newYear = myYear;
  var isAll = false;
  if (myYear=="All the years")
  {
      isAll = true;
  }
  //determine which direction to change the year // its cirular
  if (direction=="forward")
  {
    if (isAll)
    {
      newYear = 2007;
      d3.select("#theYear").node().innerText = 2007;
    }
    else if (myYear!=2015){
        newYear = parseInt(myYear)+1;
      d3.select("#theYear").node().innerText =newYear ;

    }
    else {
      d3.select("#theYear").node().innerText = "All the years";
      newYear = "All the years";
    }
  }
  else if (direction=="back")
  {
    if (isAll)
    {
      newYear = 2015;
      d3.select("#theYear").node().innerText = 2015;
    }
    else if (myYear!=2007) {
      newYear = parseInt(myYear)-1;
      d3.select("#theYear").node().innerText = newYear;
    }
    else {
      d3.select("#theYear").node().innerText = "All the years";
      newYear = "All the years";
    }
  }

  reDraw(newYear);

}

var reDraw = function(newYear)
{
  var states = d3.selectAll("#state");
  var counties = d3.selectAll("#county");

  var width = 1500;

  var projection = d3.geoAlbersUsa()
                    .scale([width])
                    .translate([750,400]);

  var countyGenerator = d3.geoPath().projection(projection);

  if (newYear=="All the years")
  {
    counties
    .attr("fill",function(d)
  {
      if (d.properties.race>0){
    return "blue";
  }
  else if (d.properties.race==0){
    return  "yellow";
  }
  else{
    return "darkgray";
  }
  })
    .on("mouseover",function(d){
      theState = sToS[d.properties.StateName]
      d3.select("svg").append("text")
      .attr("x",(countyGenerator.centroid(theState)[0]-.05*countyGenerator.measure(theState)))
      .attr("y",countyGenerator.centroid(theState)[1])
        //.attr("transform","translate("+(countyGenerator.centroid(theState)[0]-.05*countyGenerator.measure(theState))+","+countyGenerator.centroid(theState)[1]+")")
        .text(theState.properties.race)
        .style("font-size",40)
        .attr("id","numText");

    })
    .on("mouseout",function(d){
      d3.select("svg").select("text")
        .remove();
    });

    states
    .attr("stroke",function(d){
      return d3.interpolateReds(d.properties.race/1000);
    })

  }
  else {
    counties
    .attr("fill",function(d)
  {
      if (d.properties["race"+newYear]>0){
    return "blue";
  }
  else if (d.properties["race"+newYear]==0){
    return  "yellow";
  }
  else{
    return "darkgray";
  }
  })
    .on("mouseover",function(d){
      theState = sToS[d.properties.StateName]
      d3.select("svg").append("text")
      .attr("x",(countyGenerator.centroid(theState)[0]-.05*countyGenerator.measure(theState)))
      .attr("y",countyGenerator.centroid(theState)[1])
        //.attr("transform","translate("+(countyGenerator.centroid(theState)[0]-.05*countyGenerator.measure(theState))+","+countyGenerator.centroid(theState)[1]+")")
        .text(theState.properties["race"+newYear])
        .style("font-size",40)
        .attr("id","numText");

    })
    .on("mouseout",function(d){
      d3.select("svg").select("text")
        .remove();
    });

    states
    .attr("stroke",function(d){
      if (d.properties["race"+newYear]==undefined)
      {
        return "lightblack";
      }
      return d3.interpolateReds(d.properties["race"+newYear]/100);
    })
  }




}

// uses the mode to tell whether it should draw states or counties
// var noCounties = function()
// {
//   var mode = d3.select("#mode").node().innerText;
//   console.log(mode);
//   if (mode==1)
//   {
//     d3.selectAll("#state")
//     .attr("fill",function(d){
//       d3.select("#mode").node().innerText=2;
//       return d3.interpolateReds(d.properties.race/1000);
//     })
//   }
//   else {
//     d3.select("#mode").node().innerText=1;
//     d3.selectAll("#state")
//     .attr("fill",function(d){
//       return "none";});
//     d3.selectAll("#county")
//     .attr("fill",function(d){
//     if (d.properties.race>0)
//     {
//       return "blue";
//     }
//     else if (d.properties.race==0){
//       return  "yellow";
//     }
//     else{
//       return "darkgray";
//     }
//       })
//     }
//
// }


var drawCountyMap = function(outline,dataInMap,cities,numbersToStates,otherCitites,stateData)
{
  var width = 1500;
  var height = 800;
  var body = d3.select("body");
  var yearSelector = body.append("g").classed("yearS",true);
  body.append("text").attr("id","title").text("Counties by Reporting Status");


  var back = yearSelector.append("button")
  .text("Back a year")
  .on("click",function(){updateMap("back");});

  yearSelector.append("text")
  .text("All the years")
  .attr("id","theYear");


  yearSelector.append("button")
  .text("forward a year")
  .on("click",function(){updateMap("forward");});

  // body.append("button")
  // .text("Click to change")
  // .on("click",function(){
  //   noCounties();
  // })


  var svg = body.append("svg")
      .attr("width",width)
      .attr("height",height);
  //console.log(dataInMap);

  var sToS = statesNamesToStates(stateData);


  //makeStateCountyTo(outline,)
  giveCountiesData(outline,dataInMap,cities,numbersToStates,otherCities,sToS,stateData);

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
      .attr("id","county")
      .attr("stroke","none")
      .attr("fill",function(d)
    {
        if (d.properties.race>0){
      return "blue";
    }
    else if (d.properties.race==0){
      return  "yellow";
    }
    else{
      return "darkgray";
    }
    })
      .on("mouseover",function(d){
        theState = sToS[d.properties.StateName]
        svg.append("text")
        .attr("x",(countyGenerator.centroid(theState)[0]-.05*countyGenerator.measure(theState)))
        .attr("y",countyGenerator.centroid(theState)[1])
          //.attr("transform","translate("+(countyGenerator.centroid(theState)[0]-.05*countyGenerator.measure(theState))+","+countyGenerator.centroid(theState)[1]+")")
          .text(theState.properties.race)
          .style("font-size",40)
          .attr("id","numText");

      })
      .on("mouseout",function(d){
        svg.select("text")
          .remove();
      });

      states = svg.append("g").selectAll("g")
          .data(stateData.features)
          .enter()
          .append("path")
          .attr("d",countyGenerator)
          .attr("stroke",function(d){
            return d3.interpolateReds(d.properties.race/1000);
          })
          .attr("id","state")
          .attr("stroke-width",2)
          .attr("fill","none")
          .on("mouseover",function(d){
            //console.log(d.properties.IncidentsNom);
            svg.append("text")
              .attr("transform","translate("+countyGenerator.centroid(d)[0]+","+countyGenerator.centroid(d)[1]+")")
              .text(d.properties.race)
              .attr("id","numText");
          })
          .on("mouseout",function(d){
            svg.select("text")
              .remove();
          });
}


/// make dictionary of statenames to state objects
var statesNamesToStates = function(stateData)
{
  console.log("stateData",stateData);
  sToS={};
  stateData.features.forEach(function(d)
{
  sToS[d.properties.NAME] = d;
})
console.log(sToS);
return sToS;
}



var giveCountiesData = function(outline,dataInMap,cities,numbersToStates,otherCities,sToS,stateData)
{
  counties = {};
  for (var i=0;i<outline.features.length;i++)
  {
      curCounty = outline.features[i];
      curCounty.properties["StateName"] = numbersToStates[parseInt(curCounty.properties.STATE)];
  }
  citiesStatesToCountyStates={};

  //make cityState map to countyState
  cities.forEach(function(d)
  {
  //  console.log(d.City,d.County,d["State full"]);
    citiesStatesToCountyStates[d.city+d.state_name] = d.county_name.toLowerCase()+d.state_name;

  })

  //form list of cities found on github
  otherCities.forEach(function(d)
  {
  //  console.log(d.City,d.County,d["State full"]);
    citiesStatesToCountyStates[d.City+d["State full"]] = d.County.toLowerCase().replace(" city","").trim()+d["State full"];
    citiesStatesToCountyStates[d["City alias"]+d["State full"]] = d.County.toLowerCase().replace(" city","").trim()+d["State full"];

    if (d.City=="Virginia Beach")
    {
      console.log(d.City+d["State full"]);//County.toLowerCase().replace(" city","").trim()+d["State full"]);
    }
  })

 var countyStatesToCounty={};
 outline.features.forEach(function(d)
{
  //console.log(d.properties.NAME+d.properties.StateName)
  countyStatesToCounty[d.properties.NAME.toLowerCase()+d.properties.StateName] = d;
  //console.log("it looks like ",d.properties.NAME.toLowerCase()+d.properties.StateName)

})
console.log(citiesStatesToCountyStates["Virginia BeachVirginia"])
  var numTimesSeenAlabama = 0;
  var curState="";
  var curSpecifier="";
  var curYear;
  dataInMap.forEach(function(d)
  {
    if (d.State!="")
    {
      curState=d.State.toLowerCase();
      curState = curState.charAt(0).toUpperCase()+ curState.slice(1);
      if (curState.includes(" "))
      {
        var ind = curState.indexOf(" ")+1;
        curState = curState.slice(0,ind)+curState.charAt(ind).toUpperCase()+curState.slice(ind+1);
      }
      if (d.State.toLowerCase()=="alabama")
      {
        numTimesSeenAlabama++;
         curYear = numTimesSeenAlabama+2006;

      }
      curSpecifier="notCoes";
    }
    if (d.specifier=="Cities")
    {
      curSpecifier="Cities";
    }
    else if (d.specifier=="Metropolitan Counties" || d.specifier=="Non Metropolitan Counties")
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
      var curCounty = countyStatesToCounty[citiesStatesToCountyStates[d.agency.replace("Township","TWP").replace("Town","TWP").trim().replace("2","").replace("3","")+curState]];
    //  console.log(d);
  //  console.log(curCounty)
      if (curCounty!=undefined)
      {
        //console.log(curState);
        stateObj = sToS[curState];
        //console.log(sToS);
        if (curCounty.properties["race"+curYear]==undefined)
        {
          curCounty.properties["race"+curYear]=0;
        }
        if (stateObj.properties["race"+curYear]==undefined)
        {
          stateObj.properties["race"+curYear]=0;
        }
        curCounty.properties["race"+curYear] = curCounty.properties["race"+curYear]+parseInt(d.race);
        stateObj.properties["race"+curYear] = stateObj.properties["race"+curYear]+parseInt(d.race);
      ///  console.log("curCounty",curCounty);
      }
      else {
        var curCounty = countyStatesToCounty[citiesStatesToCountyStates[d.agency.replace("Township","TWP").trim().replace("2","").replace("3","").toLowerCase()+curState]];
        if (curCounty!=undefined)
        {
          if (curCounty.properties["race"+curYear]==undefined)
          {
            curCounty.properties["race"+curYear]=0;
          }
          curCounty.properties["race"+curYear] = curCounty.properties["race"+curYear]+parseInt(d.race);
        ///  console.log("curCounty",curCounty);
        }
        else {
          if (!d.agency.includes("Township"))
          {
        //  console.log("no",d.agency+curState);
        }
        }
}
    }
    if (d.specifier!="Nonmetropolitan Counties" && d.specifier!="metropolitan Counties" && curSpecifier=="Counties" && d.State=="")
    {
      var curCounty = countyStatesToCounty[d.agency.toLowerCase().replace(" county police department")+curState];


      if (curCounty!=undefined)
      {
      //  console.log("county found");
        if (curCounty.properties["race"+curYear]==undefined)
        {
          curCounty.properties["race"+curYear]=0;
        }
        curCounty.properties["race"+curYear] = curCounty.properties["race"+curYear]+parseInt(d.race);
    }
    else {
      //console.log(countyStatesToCounty["county not found",d.agency.toLowerCase().replace("county police department","").trim()+curState]);
      var curCounty = countyStatesToCounty[d.agency.toLowerCase().replace(" county police department")+curState];

      if (curCounty!=undefined)
      {
      //  console.log("county found");
        if (curCounty.properties["race"+curYear]==undefined)
        {
          curCounty.properties["race"+curYear]=0;
        }
        curCounty.properties["race"+curYear] = curCounty.properties["race"+curYear]+parseInt(d.race);
    }
    else {
    //  console.log("give up");
    }
    }


  }
})
outline.features.forEach(function(d){

  var tot=undefined;
  for (var num=2007;num<2016;num++)
  {
    var curYearNum = d.properties["race"+num];
    if (!isNaN(curYearNum) && tot!=undefined)
    {
      tot+=curYearNum;
    }
    if (!isNaN(curYearNum) && tot==undefined)
    {
      tot=curYearNum;
    }

  }
  d.properties.race = tot;
  // isNan(d.properties.race2006) + d.properties.race2007 + d.properties.race2008 + d.properties.race2009
  // + d.properties.race2010 + d.properties.race2011 + d.properties.race2012 + d.properties.race2013 +d.properties.race2014
  // + d.properties.race2015;
//  console.log(d);
})

stateData.features.forEach(function(d){

  var tot=undefined;
  for (var num=2007;num<2016;num++)
  {
    var curYearNum = d.properties["race"+num];
    if (!isNaN(curYearNum) && tot!=undefined)
    {
      tot+=curYearNum;
    }
    if (!isNaN(curYearNum) && tot==undefined)
    {
      tot=curYearNum;
    }

  }
  d.properties.race = tot;
  // isNan(d.properties.race2006) + d.properties.race2007 + d.properties.race2008 + d.properties.race2009
  // + d.properties.race2010 + d.properties.race2011 + d.properties.race2012 + d.properties.race2013 +d.properties.race2014
  // + d.properties.race2015;
  //console.log(d);
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
