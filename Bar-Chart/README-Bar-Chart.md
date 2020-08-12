# Bar Chart
In this README-Bar-Chart file, there will be descriptions and explanations for the project.  
  
## Description
In this project, we are asked to make a bar chart for the US GDP using D3.js Library.  
  
### Test/User Stories
The test or user stories that must be passed are:  
1. My chart should have a title with a corresponding id="title"
2. My chart should have a g element x-axis with a corresponding id="x-axis"
3. My chart should have a g element y-axis with a corresponding id="y-axis"
4. Both axes should contain multiple tick labels, each with the corresponding class="tick"
5. My chart should have a rect element for each data point with a corresponding class="bar" displaying the data
6. Each bar should have the properties data-date and data-gdp containing date and GDP values
7. The bar elements' data-date properties should match the order of the provided data
8. The bar elements' data-gdp properties should match the order of the provided data
9. Each bar element's height should accurately represent the data's corresponding GDP
10. The data-date attribute and its corresponding bar element should align with the corresponding value on the x-axis
11. The data-gdp attribute and its corresponding bar element should align with the corresponding value on the y-axis
12. I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area
13. My tooltip should have a data-date property that corresponds to the data-date of the active area  
  
### Dataset
The dataset that we will need to complete this project are  
https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json  

## Structure of the Bar Chart
```
<body>
    <div id="container">
        <div id="title">
        <svg>
            <g>
                <g id="x-axis">
                <g id="y-axis">
                //all rect elements
            </g>
        </svg>
        <div id="info">
        <div id="tooltip">
    <div>
</body>
```

## Step-by-step Making and Code Explanation
1. First we must retrieve the data that is needed for the project, from the URL that was given. To do this we can use the fetch method that was already taught in Get JSON with Javascript fetch method in one of the FreeCodeCamp challenges.  
In my source code that was done like this:  
``` 
    document.addEventListener('DOMContentLoaded', function(){
        fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then(response=>response.json())
        .then(data=>{
        data.data.forEach(addYAxisDateSet);
        function addYAxisDateSet(currValue, index, arr){
            yAxisDataSet.push(arr[index][1])
            xAxisDataSet.push(arr[index][0])
        }
        console.log(data);
        dataSet=data.data;
        })
        .then(()=>{loadEverything()})
    })
    ```  
Explanation:  
The first line with the fetch(URL) makes a GET request to the URL that was specified. After that it return a promise.  
After the promise is returned and the request was successfull it will execute the then method which takes the response and converts it to JSON format. This also return a promise.  
This promise is handle by the next then method where the argument is the JSON object that we need. In here we might want to save the JSON object to a variable and also save part of the JSON object that you needed to make axis to an array. The reason for this will be explained later.  
  
2. Now that we have the data we can start making the bar chart. The first thing we'll do is making the svg, since rect element and the axis itself needs to appended on an svg.  
In my source code the svg was created like this:  
```
 var width=900;
    var height=460;
    var svg=d3.select('#container')
    .append('svg')
    .attr('width', width)
    .attr('height',height)
    .style('background-color','white');
    ```  
Explanation:  
First we put the width and height to a variable so if we need to change it, we only need to change it in one place instead of going through the whole code. Then you append an svg to the body or an element you created in the body. In here i append it to the div element with an id container. Then you give the attribute of width and height and also the background color for the svg.  
3. Now we create the scales for the xAxis, yAxis and also for the yBar. The reason another scale for the yAxis is needed will be explained later.  
  Scale for yBar:  
  ```
   var yScaleBar=d3.scaleLinear()
    .domain([0,d3.max(yAxisDataSet)])
    .range([0,height-50]);
```
the domain start from 0 and the max element from the array we created after fetching the data before. The reason i created it as array is because d3.max take an array to operate. Then the range is from 0 to (height-50)  
Scale for yAxis:
```
var yScaleAxis=d3.scaleLinear()
    .domain([0,d3.max(yAxisDataSet)])
    .range([height-50,0]);
```
For the y axis itself the range was reverse so that the tick 0 start from the bottom and not from the top. if we use the same scale for the bars then the yAxis will be reverse starting from 18.000 to 0.  
Scale for xAxis:
```
var xScale=d3.scaleTime()
    .domain([new Date(parseInt(xAxisDataSet[0].split('-')[0]),
    parseInt(xAxisDataSet[0].split('-')[1]),
    parseInt(xAxisDataSet[0].split('-')[2])),
        new Date(parseInt(xAxisDataSet[xAxisDataSet.length-1].split('-')[0]),
        parseInt(xAxisDataSet[xAxisDataSet.length-1].split('-')[1])+3,
        parseInt(xAxisDataSet[xAxisDataSet.length-1].split('-')[2]))])
    .range([0,width-100]);
```
In here we use scale time since the data was in months and years. So it will be eazier if we use scale time. The two previous scale uses scaleLinear.The scale time for the domain uses date objects for the domain.  
  
4. Now that we have created the scales we will create the axis for both y and x.
```
var y_axis=d3.axisLeft()
    .scale(yScaleAxis);
var x_axis=d3.axisBottom()
    .scale(xScale);

    var g = svg.append('g');

    g.append('g')
    .attr('transform','translate(60,10)')
    .attr('id','y-axis')
    .call(y_axis);

    g.append('g')
    .attr('transform','translate(60,'+(height-40)+')')
    .attr('id','x-axis')
    .call(x_axis);
```
First we make the axis by using the scales we created earlier. After that we made a group to append both axis y and x, this is to make it more organized. Then we created two groups to contain each of the axis by calling each axis that we created before.  
  
5. Now we will create the bar chart.  
First we will create the all the rects and also its attribute according to its data
```
g.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('class','bar')
    .attr('data-gdp',(d)=>{
        return d[1]
    })
    .attr('data-date',(d)=>{
        return d[0]
    })
    .attr('height',(d)=>{
        return yScaleBar(d[1]);
    })
    .attr('y',(d)=>{
        return height - yScaleBar(d[1])-40;
    })
    .attr('x',(d)=>{
        return xScale(new Date(parseInt(d[0].split('-')[0])
        ,parseInt(d[0].split('-')[1])
        ,parseInt(d[0].split('-')[2])))+60
    })
    .attr('width',(d,i)=>{
        return (width-100)/dataSet.length
    })
```
we select the g we created to contain both the axis of x and y.Then we selectAll rects elements there. Since there is no rect elements it will return nothing. Then we put the data we get from the fetch method and enter to create the numbers of rects needed (if the previous select all rect return some rect than it will only enter new rects to fill the lacking rects elements), then we append rect elements according to the number of rects needed for the data and also the attributes that it have according to the data.  
  
6. After this we created the tooltip that will show up when we hover on the rect elements in the bar chart.
```
 d3.select('#container')
        .append('div')
        .attr('id','tooltip');
```
The reason i put this on a div element container so that the position of the tooltip wouldn't be affected if the body element got resize due to the screen. And also set the opacity to 0 in the css. Since we do not want the tooltip to show up unless one of the rect is hovered.  
  
7. Then we put a on mouseover and mouseout function on the rects elements we created previously.
```
.on('mouseover', function(d){
        var x=xScale(new Date(parseInt(d[0].split('-')[0])
        ,parseInt(d[0].split('-')[1])
        ,parseInt(d[0].split('-')[2])))+60;

        var toolTip=d3.select('#tooltip')
        .style('opacity',0.9)
        .style('left',x+30+'px')
        .style('bottom',165+'px')
        .attr('data-date',d[0]);

        toolTip.append('text')
        .attr('id','tooltip-text')
        .html(()=>{
            var q;
            if(d[0].split('-')[1]==='01'){
                q='Q1';
            }else if(d[0].split('-')[1]==='04'){
                q='Q2';
            }else if(d[0].split('-')[1]==='07'){
                q='Q3';
            }else{
                q='Q4';
            }
            return d[0].split('-')[0]+' '+q+'<br>'+'$'+d[1]+' Billion';
        });
    })
    .on('mouseout',function(){
        d3.select('#tooltip')
        .style('opacity',0);
        d3.select('#tooltip-text').remove();
    })
```
In the  mouseover function:  
Since i tried to make this as same as possible with the example project from freecodecamp. We have to use again the xScale so that the tooltip position will be the same with the rects.   
we select the tooltip we created previously and alter its attributes and style by giving it a left and bottom so its position will be the same as the rects that was hovered. And then we also append the texts of the data of the rect that was hovered.  
In the mouseout function:  
We remove the text that was added on the mouseover function and also alter back the opacity of the tooltip to 0.  
  
8. Finally we add some small details for the bar charts such as the text gross domestic product and source for more information
```
d3.select('svg').append('text')
    .text('Gross Domestic Product')
    .attr('id','gdp')
    .attr('transform','translate(80,220) rotate(-90)')
    
    ;
    d3.select('#container')
    .append('div')
    .attr('id','info')
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
    .style('margin-left',480);
```
  
For the css its only to make it look the same as the one in the example project.