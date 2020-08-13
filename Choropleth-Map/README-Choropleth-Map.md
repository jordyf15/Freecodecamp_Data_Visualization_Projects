# Choropleth Map
In this README-Choropleth-Map, there will be description of the project and also the explanation of the code.
  
## Description
In the fourth project of the Data Visualization Curriculum, we have to make Choropleth Map for the United States Educational Attainment.

### Test/User Stories
1. My choropleth should have a title with a corresponding id="title".
2. My choropleth should have a description element with a corresponding id="description".
3. My choropleth should have counties with a corresponding class="county" that represent the data.
4. There should be at least 4 different fill colors used for the counties.
5. My counties should each have data-fips and data-education properties containing their corresponding fips and education values.
6. My choropleth should have a county for each provided data point.
7. The counties should have data-fips and data-education values that match the sample data.
8. My choropleth should have a legend with a corresponding id="legend".
9. There should be at least 4 different fill colors used for the legend.
10. I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
11. My tooltip should have a data-education property that corresponds to the data-education of the active area.

### Datasets
There are two datasets that are needed for this project.
1. US Education Data: https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json
2. US County Data: https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json
  
The first data is an array that each index hold an object that contain properties of each county. For example:
```
array: [
    0: Object{
        area_name: "Autauga County"
        bachelorsOrHigher: 21.9
        fips: 1001
        state: "AL"
    }
    .
    .
    .
    3142: Object{
        area_name: "Weston County"
        bachelorsOrHigher: 16.8
        fips: 56045
        state: "WY"
    }
]
```
The second data contain topology type object and coordination to draw the map.

## Additional library 
To do this project we need an additonal library to draw the map from the data which provide objects of topology type. So we need to include it in our html file.
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js"></script>
```

## Structure of the Choropleth-map
```
<body>
    <text id="title">
    <text id="description">
    <div id="container">
        <div id="tooltip">
        <svg>
            <g id="legend">
            <g>
                <g id="mapCounty">
                // all the path to draw the counties are here
                </g>
                //path that draw the state is here
            </g>
        </svg>
        <div id="source">
    </div>
</body>
```
## Step-by-step making and Code Explanation
1. Retrieve the datasets from the url given.
```
var legendDataSet=[];
var dataSet;
document.addEventListener('DOMContentLoaded',function(){
Promise.all([
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'),
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
])
.then(function (responses){
        return Promise.all(responses.map(function (response){
            return response.json();
        }))
})
.then(data=>{
    data[0].forEach(addToLegendDataSet);
    function addToLegendDataSet(currValue,index,arr){
        legendDataSet.push(data[0][index].bachelorsOrHigher);
    }
    dataSet=data;
})
.then(()=>loadEverything());
})
```
Since there are two different dataset in different url the fetch method will be different than the previous projects. To avoid having to use lots of callback for fetch each of the dataset it will be better to use Promise.all method. After that we store the datas to a variable so we can use it later.  
  
2. Create the loadEverything function
```
function loadEverything(){
// all your code goes here
}
```
Just like in all the previous projects this function will run and load your choropleth map when the data has already been received and stored in your variable and are ready to be used.  

3.  Create variables for width, height and legendBarDataSet
```
var legendBarDataSet=[3,12,21,30,39,48,57,66];
var width=960;
var height=600;
```
the width and height here is for the svg. While the legendBarDataSet array will be used to create the rects for the legend.  
  
4. Append title and description to the body
    ```
    d3.select('body')
    .append('text')
    .attr('id','title')
    .text('United States Educational Attainment');

    d3.select('body')
    .append("text")
    .attr('id','description')
    .text('Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)');
    ```
5. Create a div container to hold the tooltip and svg.
    ```
    var container = d3.select('body')
    .append('div')
    .attr("id",'container');
    ```
  
6. Append tooltip and the svg to div container
    ```
    var tooltip = container.append('div')
    .attr('id','tooltip');

    var svg = container.append('svg')
    .attr('width',width)
    .attr('height',height);
    ```
    The width and height attribute of the svg are taken from the width and height variable we created earlier.  
  
7. Creating the legendScale
    ```
    var legendScale = d3.scaleLinear()
    .domain([d3.min(legendDataSet),d3.max(legendDataSet)])
    .range([0,260]);
    ```
  
8. Creating the colorScale
    ```
    var colorScale = d3.scaleQuantize()
    .domain([d3.min(legendDataSet),d3.max(legendDataSet)])
    .range(['#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b']);
    ```
    In this project i try using the scaleQuantize instead of the the scaleThreshold used in the heatmap. Both can be used for colorScales.  
  
9. Creating the legendAxis
    ```
    var legendAxis = d3.axisBottom()
    .tickValues([3,12,21,30,39,48,57,66])
    .tickSizeOuter(0)
    .tickSizeInner(15)
    .tickFormat(function(d){
        return d+'%';
    })
    .scale(legendScale);
    ```
    The tickFormat here is just to add the % behind. The rest is still the same in the previous projects.  
  
10. Creating the legend group to hold the legendAxis and rects
    ```
    var legend=svg.append('g')
    .attr('id','legend')
    .attr('transform','translate('+(width-360)+',40)');
    ```
  
11. Creating the legend rects
    ```
    legend.selectAll('rect')
    .data(legendBarDataSet)
    .enter()
    .append('rect')
    .attr('x',(d)=>{
        return legendScale(d);
    })
    .attr('height',8)
    .attr('width',32.5)
    .style('fill',(d,i)=>{
        return colorScale(d);
    });
    ```
  
12. Append the legendAxis to the legend group
    ```
    legend.append("g")
    .call(legendAxis)
    .select('.domain')
    .attr('stroke-width',0)
    ```
  
13. Putting the d3.geopath to a variable so we can use it later.
    ```
    var drawPath=d3.geoPath();
    ```
  
14. Creating a map group to hold the map counties path and the map state path
    ```
    var map=svg.append('g');
    ```
    The map group is appended to the svg  
  
15. Append a mapCounty group to the map group.
    ```
    var mapCounty=map.append('g').attr('id','mapCounty');
    ```
  
16. Creating the map counties
    ```
    mapCounty.selectAll('path')
    .data(topojson.feature(dataSet[1],dataSet[1].objects.counties).features)
    .enter()
    .append('path')
    .attr('d',drawPath)
    .style('fill','#74c476')
    .attr('data-name',(d)=>{
        var result=dataSet[0].filter(eduDataSet=>eduDataSet.fips==d.id)
        return result[0].area_name;
    })
    .attr('data-fips',(d)=>{
        var result=dataSet[0].filter(eduDataSet=>eduDataSet.fips==d.id)
        return result[0].fips;
    })
    .attr('data-education',(d)=>{
        var result=dataSet[0].filter(eduDataSet=>eduDataSet.fips==d.id)
        return result[0].bachelorsOrHigher;
    })
    .attr('class','county')
    .style('fill',(d)=>{
        var result=dataSet[0].filter(eduDataSet=>eduDataSet.fips==d.id);
        return colorScale(result[0].bachelorsOrHigher);
    })
    .style('stroke','white')
    .style('stroke-width',0.1)
    ```
    Here we selectAll the path and than in the data method we use the topojson feature to convert the data to so it can be use by the drawPath or the d3.geoPath(). After that it will append path for each data with attributes that the d3.geoPath/drawPath gives. This will draw the map. While assigning each attribute please pay attention to the fips and the id of the datasets since it need to matched to display the choropleth map properly.  
  
17. Creating the on mouseover and mouseout function for hovering the map
    ```
    .on('mouseover',function(d){
        var position=event;
        var tooltipHeight=document.getElementById('tooltip').clientHeight;
        var result=dataSet[0].filter(eduDataSet=>eduDataSet.fips==d.id);
        tooltip.append('text')
        .html(()=>{
            return result[0].area_name+', '+result[0].state+': '+result[0].bachelorsOrHigher+'%';
        });   

        tooltip.attr('data-education',()=>{
        var result=dataSet[0].filter(eduDataSet=>eduDataSet.fips==d.id)
        return result[0].bachelorsOrHigher;
        })
        .style('opacity',0.9)
        .style('left',position.pageX+10+'px')
        .style('top',position.pageY-(tooltipHeight/2)+'px');
    })
    .on('mouseout',function(){
        tooltip.style('opacity',0)
        .select('text')
        .remove();
    });
    ```
    There is nothing new here except for the position variable which take the event of the mouse hover and take its coordination by using ```position.pageY``` and ```position.pageX``` . Which will be used to set the location of the tooltip.  
  
18. Creating the state path
    ```
    map.append('path')
    .attr('class','state')
    .attr('d',drawPath(topojson.mesh(dataSet[1],dataSet[1].objects.states,function (a,b){return a!==b;})))
    .style('fill','none')
    .style('stroke','white');
    ```
    In here we use the topojson.mesh instead to the draw the state borders.  
  
19. Creating the source link
    ```
    var source = container.append("div")
    .attr('id','source')
    .html('Source: <a id="link" href="https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx">USDA Economic Research Service</a>')
    }
    ```