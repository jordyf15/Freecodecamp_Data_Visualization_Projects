# Heat Map
In this README-Heat-Map file there will be description and also explanation for the project and the code.

## Description
In the Third project of the Data Visualization curriculum in FreeCodeCamp, we have to make a Heat Map for Monthly Global Land-Surface Temperature

### Test/User Story
1. My heat map should have a title with a corresponding id="title".
2. My heat map should have a description with a corresponding id="description".
3. My heat map should have an x-axis with a corresponding id="x-axis".
4. My heat map should have a y-axis with a corresponding id="y-axis".
5. My heat map should have rect elements with a class="cell" that represent the data.
6. There should be at least 4 different fill colors used for the cells.
7. Each cell will have the properties data-month, data-year, data-temp containing their corresponding month, year, and temperature values.
8. The data-month, data-year of each cell should be within the range of the data.
9. My heat map should have cells that align with the corresponding month on the y-axis.
10. My heat map should have cells that align with the corresponding year on the x-axis.
11. My heat map should have multiple tick labels on the y-axis with the full month name.
12. My heat map should have multiple tick labels on the x-axis with the years between 1754 and 2015.
13. My heat map should have a legend with a corresponding id="legend".
14. My legend should contain rect elements.
15. The rect elements in the legend should use at least 4 different fill colors.
16. I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
17. My tooltip should have a data-year property that corresponds to the data-year of the active area.
  
### Dataset
The dataset that we will need to complete this project are  
https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json

The data we receive is an object with two properties. Which is the base temperature and monthly variance.
The base temperature is used to count the temperature of each month and the data that will be used to create the heat map is in monthvariance. It is an array that each index hold an object that contain properties of each month. For example:
```
Object{
    baseTemperature: 8.66
    monthlyVariance: [
        0: Object{
            year:1753,
            month: 1,
            variance: -1.366
        }
        .
        .
        .
        3152: Object{
            year: 2015,
            month: 8,
            variance: 0.87
        }
    ]
}
```

## Structure of the Heat-Map
```
<body>
    <div id="header">
        <text id="title">
        <text id="description">
    </div>
    <div id="container">
        <div id="tooltip">
        <svg>
        <g>
            <g id="x-axis">
            <g id="y-axis">
            // all rect elements of heatmap
        </g>
        <g id="legend">
            <g id="legend-axis">
            //all rect elements of legend
        </g>
        <text id="monthDesc">
        <text id="yearDesc">
        </svg>
    </div>
</body>
```
## Step-by-step making and code explanation
1. Retrieving the data from the given URL using the fetch method
```
var dataSet=[];
var xAxisDataSet=[];
var yAxisDataSet=[];
var legendDataSet=[1.7,2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8]
document.addEventListener('DOMContentLoaded',function(){
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response=>response.json())
    .then(data=>{
        data.monthlyVariance.forEach(addToDataSets);
        function addToDataSets(currValue,index,arr){
        xAxisDataSet.push(arr[index].year);
        yAxisDataSet.push(arr[index].month);
    }
    dataSet=data.monthlyVariance;
    })
    .then(()=>loadEverything())
})
```
Just like the previous project we need to retrieve the data first and stored in some variables.  
  
2. Create the loadEverything function
```
function loadEverything(){
// all your code goes here
}
```
Just like in all the previous projects this function will run and load your heat map when the data has already been received and stored in your variable and are ready to be used.  
  
3. Create the width,height, and base variable to be used later.
```
  var width=((dataSet.length*5)/12)+300;
    var height=550;
    var base=8.66;
```
This variables will be used later in the elements that we're going to create.  
  
4. Create a div header
```
 var header=d3.select('body')
    .append('div')
    .attr('id','header');
```
Create a div header for your title and description.

5. Create the title and description
```
var title=d3.select('#header')
    .append('text')
    .attr('id','title')
    .text('Monthly Global Land-Surface Temperature')
    .style('font-size',25+'px')
    .style('padding-bottom',25+'px')
    .style('padding-top',20+'px');

var description=d3.select('#header')
    .append('text')
    .attr('id','description')
    .text('1753 - 2015: base temperature 8.66℃')
    .style('font-size',20+'px')
    .style('padding-bottom',20+'px');
```
Append title and description to your header and also give the required attributes, style and also the text for it.  
   
6. Create a div container
```
  var container=d3.select('body')
    .append('div')
    .attr('id','container')
    .style('width',width);
``` 
The div container will hold your svg and also your tool tip.  
  
7. Create your tooltip in the container
```
var tooltip=d3.select('#container')
    .append('div')
    .attr('id','tooltip');
```
Create your tooltip and append it to the div container.  
  
8. Create the svg
```
   var svg=d3.select('#container')
    .append('svg')
    .attr('width',width)
    .attr('height',height);
```
Create the svg using the variables we created earlier for the width and height element.  
  
9. Create the xScale, yScale of the heatmap
```
    var xScale=d3.scaleTime()
    .domain([new Date(d3.min(xAxisDataSet),1,1), 
    new Date(d3.max(xAxisDataSet)+1,1,1)])
    .range([0,1330]);

    var yScale=d3.scaleTime()
    .domain([new Date(2014,11,15),new Date(2015,11,15)])
    .range([0,height-150]);
```
since the x axis and y axis are time we use the scaleTime. And also the domain for the yScale the date need to be set on 15 and the month need to be the same and have 1 year apart. So that we can have a whole year on the yaxis that also begin and end on the middle of december just like in the example project. Please note that in the new date object the month start from 0 so december is 11.  
  
10. Create the legend Axis Scale
```
var legendScale=d3.scaleLinear()
    .domain([1.7,13.9])
    .range([0,400]);
```
For the legend scale just used scaleLinear is enough.

11. Create the Color scale
```
 var colorScale = d3.scaleThreshold()
    .domain([2.9, 4, 5.1, 6.2, 7.3, 8.4, 9.6, 10.7, 11.8, 12.8])
    .range(['rgb(49, 54, 149)','rgb(69, 117, 180)','rgb(116, 173, 209)','rgb(171, 217, 233)','rgb(224, 243, 248)',
    'rgb(255, 255, 191)','rgb(254, 224, 144)','rgb(253, 174, 97)','rgb(244, 109, 67)','rgb(215, 48, 39)','rgb(165, 0, 38)']);
```
Since in this project the coloring for each rect depends on the temperature and it has lots of condition. it would be more practical if we make a color scale using scaleThreshold. that way we dont have to make long if else conditions in the fill style later on.  
As for how to read this scaleThreshold are:
- 2.8 and under are 'rgb(49, 54, 149)
- 3.9 - 5.0 are rgb(69, 117, 180)
- 5.0 - 6.1 are rgb(116, 173, 209)
- and so on until 12.8 and higher are rgb(165, 0, 38)  
  
12. Create the xAxis and yAxis
```
  var xAxis=d3.axisBottom()
    .tickFormat(d3.timeFormat('%Y'))
    .ticks(26)
    .tickSizeOuter(0)
    .scale(xScale);

    var yAxis=d3.axisLeft()
    .tickFormat(d3.timeFormat('%B'))
    .tickSizeOuter(0)
    .scale(yScale);
```
just like the previous project except the tickSizeOuter(0) is for dissapearing all the outer ticks. This is just to make it look the same as in the example and are not required to pass the test.  
  
13. Create the legend Axis
```
var legendAxis=d3.axisBottom()
    .tickValues([2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8])
    .tickFormat(d3.format('.1f'))
    .tickSizeOuter(0)
    .tickSizeInner(12)
    .scale(legendScale);
``` 
The ticksizeinner is used to set the inner tick size and other than that you can also set the tick values manually by using the tickValues() and inserting it an array of ticks that you want to used. The rest of it is just the same as the previous axis creation.  
  
14. Create a group for the axis and svg.
```
var heatMap=svg.append('g');
```
this heatmap group will contain both the svg and also the heatmap.  
  
15. Create a group for each axis and append it to the heatmap group
```
 heatMap.append('g')
    .attr('id','x-axis')
    .attr('transform','translate(140,420)')
    .call(xAxis);

    heatMap.append('g')
    .attr('id','y-axis')
    .attr('transform','translate(139,20)')
    .call(yAxis);
```
  
16. Creating the rect elements of the heat map
```
    heatMap.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('class','cell')
    .attr('data-month',(d)=>{
        return d.month-1;
    })
    .attr('data-year',(d)=>{
        return d.year;
    })
    .attr('data-temp',(d)=>{
        return base+d.variance
    })
    .attr('y',(d)=>{
        return yScale(new Date(2015,d.month-1,2))
    })
    .attr('x',(d)=>{
        return xScale(new Date(d.year,1,1))+140;
    })
    .attr('width',6)
    .attr('height',34)
    .style('fill',(d)=>{
        var temp=base+d.variance;
        temp=Math.round(temp*10)/10;
        return colorScale(temp);
    })
```
Just like the previous project, here we append the rects of the heatmap for all the data and also set it attributes and style. Also the temperature in the rect are the base + the variance, so here we use the base variable we created earlier which is 8.66.
  
17. Creating the on mouseover and mouseout function for each rects
```
 .on('mouseover',function(d){
        d3.select(this).style('stroke','black');
        var month;
        var temp=base+d.variance;
        temp=Math.round(temp*10)/10;
        if(d.month==1){
            month='January'
        }else if(d.month==2){
            month='February'
        }else if(d.month==3){
            month='March'
        }else if(d.month==4){
            month='April'
        }else if(d.month==5){
            month='May'
        }else if(d.month==6){
            month='June'
        }else if(d.month==7){
            month='July'
        }else if(d.month==8){
            month='August'
        }else if(d.month==9){
            month='September'
        }else if(d.month==10){
            month='October'
        }else if(d.month==11){
            month='November'
        }else{
            month='December'
        }
        tooltip.append('text')
        .html(()=>{
            return d.year+' - '+month+'<br>'+temp+'&degC'+'<br>'+(Math.round(d.variance*10)/10)+'&degC';
        });
        var tooltipWidth=document.getElementById('tooltip').clientWidth;
        var tooltipHeight=document.getElementById('tooltip').clientHeight;
        tooltip.style('opacity',0.9)
        .attr('data-year',d.year)
        .style('left',()=>{
            return xScale(new Date(d.year,1,1))+150-(tooltipWidth/2)+'px';
        })
        .style('top',()=>{
            var balancer=0;
            if(tooltipHeight>80){
                balancer=tooltipHeight-80;
            }
            return yScale(new Date(2015,d.month-1,1))+30-balancer+'px';
        });
    })
    .on('mouseout',function(d){
        tooltip.select('text')
        .remove();
        tooltip.style('opacity',0);
        d3.select(this).style('stroke','none')
    });
```
It is still similar like the previous projects but there is some slight alteration, for example the the tooltipwidth and and tooltipheight is to get the current height and width of the tooltip when a rect is hovered. This will be used to balanced the tooltip location so that it will appear in the center of the the hovered rect with a little bit top. This way no matter the width and height of the tooltip it will still be visible and neat. Other than that there is the long if else condition which i used to change the month data which is number to its string version. This is not required to pass the test.  
  
18. Create a group for the legend axis and rects
```
  var legend=svg.append('g')
    .attr('transform','translate(140,520)')
    .attr('id','legend');
```
This group will contain both the legend axis and also the rects.  
  
19. Create the legend axis and its rects
```
legend.append('g')
    .call(legendAxis);

    legend.selectAll('rect')
    .data(legendDataSet)
    .enter()
    .append('rect')
    .attr('width',39)
    .attr('height',27)
    .attr('x',(d)=>{
        return legendScale(d);
    })
    .attr('y',-26)
    .attr('value',(d)=>{
        return d;
    })
    .style('stroke','black')
    .style('fill',(d)=>{
        return colorScale(d);
    });
```
Here we append the axis and rects for the legends.  
  
20. Create month and year text description for the axis.
```
var monthDesc=svg.append('text')
    .attr('id','monthDesc')
    .attr('transform','translate(30,250) rotate(-90)')
    .text('Months');

var yearDesc=svg.append('text')
    .attr('id','yearDesc')
    .attr('transform','translate(780,465)')
    .text('Years');
```
this is to add a little bit text description for the x and y axis.

As for the css file it is just to make it look similar to the example project and no new concept that needs to be written in this documentary.