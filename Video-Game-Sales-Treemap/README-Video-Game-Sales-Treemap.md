# Video-Game-Sales-Treemap
In this README-Video-Game-Sales-Treemap file there will be description and also explanation for the project and the code.
## Description
In the fifth project of the FreeCodeCamp Data Visualization Curriculum. We have to make a treemap for a video game sales or movie data or a kickstarter funding. In here we are going to make the treemap for the video game sales.

### Test/User-stories
1. My tree map should have a title with a corresponding id="title".
2. My tree map should have a description with a corresponding id="description".
3. My tree map should have rect elements with a corresponding class="tile" that represent the data.
4. There should be at least 2 different fill colors used for the tiles.
5. Each tile should have the properties data-name, data-category, and data-value containing their corresponding name, category, and value.
6. The area of each tile should correspond to the data-value amount: tiles with a larger data-value should have a bigger area.
7. My tree map should have a legend with corresponding id="legend".
8. My legend should have rect elements with a corresponding class="legend-item".
9. The rect elements in the legend should use at least 2 different fill colors.
10. I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
11. My tooltip should have a data-value property that corresponds to the data-value of the active area.

### Dataset
There are the three dataset that we can use for this project.
1. Video Game Sales:  
https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json
2. Kickstarter Pledges:  
https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json
3. Movie Sales:  
https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json

## Structure of the Video Game Sales TreeMap
```
<body>
    <text id="title">
    <text id="description">
    <div id="container">
        <div id="tooltip">
        <svg id="treemap">
            // all the rects for the treemap are here
        </svg>
    </div>
    <svg id="legend">
        <g>
            // all of the groups that contain the rect and text of each legend are here
        </g>
    </svg>
</body>
```
## Step-by-step making and code explanation
1. Retrieve the data from the given URL.
```
var dataSet;
    document.addEventListener('DOMContentLoaded', function(){
        fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
        .then(function (response){
            return response.json();
        })
        .then(data=>{
            dataSet=data;
        })
        .then(()=>loadEverything())
    })
```
Just like in the previous project we retrieve the data and store it in a variable.  
  
2. Create the loadEverything function
```
function loadEverything(){
// all your code goes here
}
```
Just like in all the previous projects this function will run and load your TreeMap when the data has already been received and stored in your variable and are ready to be used.  
  
3. Sort the data
```
  dataSet.children.forEach(addTotalValue)
        function addTotalValue(currValue,index,arr){
            var totalValue=0;
            for(let i =0;i<arr[index].children.length;i++){
                totalValue+=parseFloat(arr[index].children[i].value);
            }
            arr[index].totalValue=totalValue;
        }
        dataSet.children.sort((a,b)=>(a.totalValue<b.totalValue)?1:-1);
```
In here we sorted the data in descending order by its group total value. This isn't required to pass the test but if you want to make it look the same as the example project. This needs to be done since if we were to examine the treemap in the example. The order of the video game group by console isnt the same as the provided data set.  
  
4. Append title and description to the body.
```
    var title=d3.select('body')
    .append('text')
    .attr('id','title')
    .text('Video Game Sales');

    var description=d3.select('body')
    .append('text')
    .attr('id','description')
    .text('Top 100 Most Sold Video Games Grouped by Platform');
```
  
5. Append a div container to the body
```
    var container=d3.select('body')
    .append('div')
    .attr('id','container');
```
This div container will hold your tooltip and treemap.  
  
6. Append a div tooltip to the div container
```
    var tooltip=d3.select('#container')
    .append('div')
    .attr("id",'tooltip');
```
  
7. Append the svg treemap to the div container
```
    var width=960;
    var height=550;
    var treeMapSvg=container.append('svg')
    .attr('id','tree-map')
    .attr('width',width)
    .attr('height',height)
```
  
8. Creating a colorPicker
```
function colorPicker(category){
        if(category=='Wii'){
            return '#4c92c3'
        }else if(category=='GB'){
            return '#ffc993'
        }else if(category=='PS2'){
            return '#de5253'
        }else if(category=='SNES'){
            return '#d1c0dd'
        }else if(category=='GBA'){
            return '#e992ce'
        }else if(category=='2600'){
            return '#d2d2d2'
        }else if(category=='DS'){
            return '#bed2ed'
        }else if(category=='PS3'){
            return '#56b356'
        }else if(category=='3DS'){
            return '#ffadab'
        }else if(category=='PS'){
            return '#a3786f'
        }else if(category=='XB'){
            return '#f9c5db'
        }else if(category=='PSP'){
            return '#c9ca4e'
        }else if(category=='X360'){
            return '#ff993e'
        }else if(category=='NES'){
            return '#ade5a1'
        }else if(category=='PS4'){
            return '#a985ca'
        }else if(category=='N64'){
            return '#d0b0a9'
        }else if(category=='PC'){
            return '#999999'
        }else{
            return '#e2e2a4'
        }
    }
```
Unlike the previous projects the data that was used to pick the colors aren't suitable for colorScales since it doesn't have any measurement. So to make it eazier, we should just create a function that can be call to pick the color when we need it.  
  
9. Creating the treemap
```
    var root= d3.hierarchy(dataSet)
    .sum(function(d){return d.value;});

    var treemap=d3.treemap()
    .size([width,height])
    .padding(0)
    (root);
```
In here we give the data to this cluster layout and also size of each leave is set based on the value of each data.  
  
    Then the d3.treemap computes the position of each element of the hierarchy.
  
10. Creating the treemap element groups
```
  var treeMapElements=treeMapSvg.selectAll('g')
       .data(root.leaves())
       .enter()
       .append('g')
       .attr('transform',(d)=>{
           return 'translate('+d.x0+','+d.y0+')'
       })
```
this group will contain both of the rect and text of the treemap elements.  
  
11. Appending the rect elements to the treemap element groups
```
    var treeMapRects=treeMapElements.append('rect')
        .attr('class','tile')
        .attr('data-name',(d)=>{
            return d.data.name;
        })
        .attr('data-category',(d)=>{
            return d.data.category;
        })
        .attr('data-value',(d)=>{
            return d.value;
        })
        .attr('width',(d)=>{
            return d.x1-d.x0;
        })
        .attr("height",(d)=>{
            return d.y1-d.y0;
        })
        .style('fill',(d)=>{
            return colorPicker(d.data.category)
        })
        .style('stroke','white') 
```
Just like in previous projects we append rects elements for each of the data.  
  
12. Appending the text elements to the treemap element group
```
treeMapElements.append('text')
        .html((d)=>{
            var result='';
            var level=0;
            var temp=d.data.name.split(' ');
            for(let i =0;i<temp.length;i++){
                if(temp[i].length>2){
                    if(i!=0){
                    result+='</tspan>'
                    level++;
                    }
                    result+='<tspan x=\'4\' y='+((level*10)+3)+'>'
                        result+=temp[i];
                }else{
                    result+=' '+temp[i];
                }
            }
            return result;
        })
        .attr('transform',(d)=>{
            return 'translate('+0+','+10+')'
        });
```
This is the text that will hold all of the information of each data. First we will split the data since it was too long for the rect elements then the looping function is to create ```<tspan>```which is a new line for each split since ```<br>``` doesn't work in svg elements. This is just to make the treemap more readable and is not required to pass the test.  
  
13. Appending the legend svg to the body
```
     var legendDataSet=['Wii','GB','PS2','SNES','GBA','2600','DS','PS3','3DS','PS','XB','PSP','X360','NES','PS4','N64','PC','XOne']
        var legendSvgWidth=60+(Math.ceil(legendDataSet.length/6)*150);
        var legendSvg=d3.select('body')
        .append('svg')
        .attr('id','legend')
        .attr('width',legendSvgWidth)
        .attr('height',160);
```
Here we create the svg for the legends.  
  
14. Append a group to contain all of the legend.
```
    var legendGroup=legendSvg.append("g")
        .attr('transform','translate(60,10)');
```
this group is created to make it more eazier to move all of the legend at once.  
  
15. Append groups that will contain each rect and text of a legend.
```
    var legendElements=legendGroup.selectAll('g')
        .data(legendDataSet)
        .enter()
        .append('g')
```
  
16. Appending the rect elements of the legends
```
legendElements.append('rect')
        .attr('width',15)
        .attr('height',15)
        .style('fill',(d)=>{
            return colorPicker(d);
        })
        .attr('transform',(d,i)=>{
            var x=Math.floor((i)/6)*150;
            var y=(i%6)*25;
            return 'translate('+x+','+y+')'
        })
        .attr('class','legend-item')
```
This rect element will represent the color of each legend.  
  
17. Appending the text elements of the legends
```
 legendElements.append('text')
        .attr('transform',(d,i)=>{
            var x=(Math.floor((i)/6)*150)+19;
            var y=((i%6)*25)+13;
            return 'translate('+x+','+y+')'
        })
        .text((d)=>{
            return d;
        });
```
This text element will decribe which legend it is.
