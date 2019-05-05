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
  ,countyHCP4,countyHCP5,countyHCP6,countyHCP7,countyHCP8,countyHCP9]).then(function(data)
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

  numbersToStates = getNumberToStates(stateData);
  //console.log(numbersToStates);
  drawCountyMap(countyData,countyHC,cities,numbersToStates,otherCities,stateData,stateHC);
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
  var newYear = myYear;
  var isAll = false;
  if (myYear=="All years")
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
      d3.select("#theYear").node().innerText = "All years";
      newYear = "All years";
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
      d3.select("#theYear").node().innerText = "All years";
      newYear = "All years";
    }
  }
  reDraw();
}


var reDraw = function()
{
  var newYear =  d3.select(".yearS").select("select").node().value;
  var states = d3.selectAll("#state");
  var counties = d3.selectAll("#county");
  var curOption = d3.select(".hateType").select("select").node().value;//.selectedOptions.innerText;
  //console.log("current",curOption);
  var width = 1500;

  var projection = d3.geoAlbersUsa()
                    .scale([width])
                    .translate([750,400]);

  var countyGenerator = d3.geoPath().projection(projection);

  if (newYear=="All years")
  {
    counties.transition()
    .attr("fill",function(d)
  {
      if (d.properties[curOption]>0){
    return "blue";
  }
  else if (d.properties[curOption]==0){
    return  "yellow";
  }
  else{
    return "darkgray";
  }
});
counties
    .on("mouseover",function(d){
      theState = sToS[d.properties.StateName]
      d3.select("svg").append("text")
      .attr("x",(countyGenerator.centroid(theState)[0]-.05*countyGenerator.measure(theState)))
      .attr("y",countyGenerator.centroid(theState)[1])
        .text(theState.properties[curOption])
        .style("font-size",40)
        .attr("id","numText");

    })
    .on("mouseout",function(d){
      d3.select("svg").select("#numText")
        .remove();
    });

    states.transition()
    .attr("stroke",function(d){
      return d3.interpolateReds((d.properties[curOption]/d.properties.pop)*4000);
    })

  }
  else {
    counties.transition()
    .attr("fill",function(d)
  {
      if (d.properties[curOption+newYear]>0){
    return "blue";
  }
  else if (d.properties[curOption+newYear]==0){
    return  "yellow";
  }
  else{
    return "darkgray";
  }
});
counties
    .on("mouseover",function(d){
      theState = sToS[d.properties.StateName]
      d3.select("svg").append("text")
      .attr("x",(countyGenerator.centroid(theState)[0]-.05*countyGenerator.measure(theState)))
      .attr("y",countyGenerator.centroid(theState)[1])
        //.attr("transform","translate("+(countyGenerator.centroid(theState)[0]-.05*countyGenerator.measure(theState))+","+countyGenerator.centroid(theState)[1]+")")
        .text(theState.properties[curOption+newYear])
        .style("font-size",40)
        .attr("id","numText");

    })
    .on("mouseout",function(d){
      d3.select("svg").select("#numText")
        .remove();
    });

    states.transition()
    .attr("stroke",function(d){
      if (d.properties[curOption+newYear]==undefined)
      {
        return "lightblack";
      }
      return d3.interpolateReds((d.properties[curOption+newYear]/d.properties.pop)*4000);
    })
  }

}









var drawCountyMap = function(outline,dataInMap,cities,numbersToStates,otherCitites,stateData,stateHC)
{
  var width = 1500;
  var height = 800;
  var body = d3.select("body");
  var selectionArea = body.append("g").classed("selectArea",true);
  var yearSelector = selectionArea.append("g").classed("yearS",true);
  var typeOfHate = selectionArea.append("g").classed("hateType",true);
  body.append("text").attr("id","title").text("Counties by Reporting Status");


  var hates = ["race","religion","sexualOrientation","disability","gender"];
  var posYears = ["All years",2007,2008,2009,2010,2011,2012,2013,2014,2015];
  typeOfHate.append("text").text("Hate Category: ");
  typeOfHate.append("select")
          .on("change",function(){reDraw();});

  typeOfHate.select("select")
  .selectAll("option")
  .data(hates)
  .enter()
  .append("option")
  .text(function(d){
    return d;})
    .attr("value",function(d){
      return d;});

  yearSelector.append("text").text("Year: ");

  yearSelector.append("select")
          .on("change",function(){reDraw();});

  yearSelector.select("select")
  .selectAll("option")
  .data(posYears)
  .enter()
  .append("option")
  .text(function(d){
  //console.log(d);
    return d;})
    .attr("value",function(d){
    //  console.log(d);
      return d;});

  var svg = body.append("svg")
      .attr("width",width+100)
      .attr("height",height);

//make a legend

  var legendRectWidth = 25;

  var report = svg.append("g")
          .classed("reporting",true);
  var rate = svg.append("g")
          .classed("rate",true);

  report.append("rect")
  .attr("x",1300)
        .attr("y",301)
        .attr("width",legendRectWidth)
        .attr("height",legendRectWidth)
        .attr("fill","blue");
  report.append("text")
  .attr("x",1335)
        .attr("y",318)
        .text("Reported 1 or More").attr("z-index",1);

  report.append("rect")
  .attr("y",331)
  .attr("x",1300)
        .attr("width",legendRectWidth)
        .attr("height",legendRectWidth)
        .attr("fill","yellow");

  report.append("text")
  .attr("x",1335)
        .attr("y",350)
        .text("Reported 0").attr("z-index",1);

  report.append("rect")
  .attr("y",361)
  .attr("x",1300)
        .attr("width",legendRectWidth)
        .attr("height",legendRectWidth)
        .attr("fill","darkgray");

  report.append("text")
  .attr("x",1335)
        .attr("y",380)
        .text("Never reported in year(s)").attr("z-index",1);

    var grad = [];
    for (var color=0;color<100;color++)
    {
      grad.push({theColor:d3.interpolateReds(color*.01),theVal:color*.01});
    }
    console.log(grad);

    var linearGradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "linear-gradient")
            .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");;

    linearGradient.selectAll("stop")
      .data(grad)
      .enter()
      .append("stop")
      .attr("offset",function(d){
        return (d.theVal*100)+"%";
      })
      .attr("stop-color",function(d){return d.theColor;});

    svg.append("rect")
            .attr("x", 1300)
            .attr("y", 500)
            .attr("stroke","black")
            .attr("width", 200)
            .attr("height", 50)
            .style("fill", "url(#linear-gradient)");
    svg.append("text")
            .attr("x", 1300)
            .attr("y", 570)
            .text("0");

    svg.append("text")
            .attr("x", 1495)
            .attr("y", 570)
            .text("1");

    svg.append("text")
            .attr("x", 1295)
            .attr("y", 590)
            .text("Total Hate crimes per 4000 people");



  svg.append("text")

  var sToS = statesNamesToStates(stateData);

  stateHC.forEach(function(d){
    var curState = sToS[d.State];
    if (curState!=undefined)
    {
      console.log("yes");
      var pop = d.Population;
      while (pop.includes(","))
      {
        pop= pop.replace(",","");
      }
    curState.properties.pop = parseInt(pop);
  }
  })


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
        svg.select("#numText")
          .remove();
      });

      states = svg.append("g").selectAll("g")
          .data(stateData.features)
          .enter()
          .append("path")
          .attr("d",countyGenerator)
          .attr("stroke",function(d){
            return d3.interpolateReds((d.properties.race/d.properties.pop)*4000);
          })
          .attr("id","state")
          .attr("stroke-width",3)
          .attr("fill","none");
}

/// make dictionary of statenames to state objects
var statesNamesToStates = function(stateData)
{
  //console.log("stateData",stateData);
  sToS={};
  stateData.features.forEach(function(d)
{
  sToS[d.properties.NAME] = d;
})
//console.log(sToS);
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
  var citiesStatesToCountyStates={};

  //make cityState map to countyState
  cities.forEach(function(d)
  {
    citiesStatesToCountyStates[d.city+d.state_name] = d.county_name.toLowerCase()+d.state_name;

  })

  //form list of cities found on github
  otherCities.forEach(function(d)
  {
    citiesStatesToCountyStates[d.City+d["State full"]] = d.County.toLowerCase().replace(" city","").trim()+d["State full"];
    citiesStatesToCountyStates[d["City alias"]+d["State full"]] = d.County.toLowerCase().replace(" city","").trim()+d["State full"];
  })

 var countyStatesToCounty={};

 outline.features.forEach(function(d)
{
  //make dictionary of county state combos to the state feature drawn
  countyStatesToCounty[d.properties.NAME.toLowerCase()+d.properties.StateName] = d;

})
  var numTimesSeenAlabama = 0;// this helps to determine which year is being displayed
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
         //console.log(curYear);
         //console.log(d);

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

      if (curCounty!=undefined)
      {
        stateObj = sToS[curState];
        addIfPossible(curState,curYear,d,curCounty,stateObj);
      }
    }
    if (d.specifier!="Nonmetropolitan Counties" && d.specifier!="metropolitan Counties" && curSpecifier=="Counties" && d.State=="")
    {
      var curCounty = countyStatesToCounty[d.agency.toLowerCase().replace(" county police department")+curState];
      if (curCounty!=undefined)
      {
      stateObj = sToS[curState];
      addIfPossible(curState,curYear,d,curCounty,stateObj);
    }
  }
})
var selectors = ["race","religion","sexualOrientation","disability","gender"];
// make properties of each year-hate category combination
outline.features.forEach(function(d){
  selectors.forEach(function(selector){
  var tot=undefined;
    for (var num=2007;num<2016;num++)
    {
      var curYearNum = d.properties[selector+num];
      if (!isNaN(curYearNum) && tot!=undefined)
      {
        tot+=curYearNum;
      }
      if (!isNaN(curYearNum) && tot==undefined)
      {
        tot=curYearNum;
      }
    }
    d.properties[selector] = tot;
  })
})
// make properites for each state, with totals of each selector
stateData.features.forEach(function(d){
  selectors.forEach(function(selector){
  var tot=undefined;
  for (var num=2007;num<2016;num++)
  {
    var curYearNum = d.properties[selector+num];
    if (!isNaN(curYearNum) && tot!=undefined)
    {
      tot+=curYearNum;
    }
    if (!isNaN(curYearNum) && tot==undefined)
    {
      tot=curYearNum;
    }

  }
  d.properties[selector] = tot;
})

})

}


var addIfPossible = function(curState,curYear,d,curCounty,stateObj)
{
  var selectors = ["race","religion","sexualOrientation","disability","gender"];
  selectors.forEach(function(selectName){
    if (curCounty.properties[selectName+curYear]==undefined)
    {
      curCounty.properties[selectName+curYear]=0;
    }
    if (stateObj.properties[selectName+curYear]==undefined)
    {
      stateObj.properties[selectName+curYear]=0;
    }
    //console.log(stateObj);
    curCounty.properties[selectName+curYear] = curCounty.properties[selectName+curYear]+parseInt(d[selectName]);
    stateObj.properties[selectName+curYear] = stateObj.properties[selectName+curYear]+parseInt(d[selectName]);

  })

}
