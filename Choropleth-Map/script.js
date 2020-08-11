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
function loadEverything(){
var legendBarDataSet=[3,12,21,30,39,48,57,66];
var width=960;
var height=600;

d3.select('body')
.append('text')
.attr('id','title')
.text('United States Educational Attainment');

d3.select('body')
.append("text")
.attr('id','description')
.text('Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)');

var container = d3.select('body')
.append('div')
.attr("id",'container');

var tooltip = container.append('div')
.attr('id','tooltip');

var svg = container.append('svg')
.attr('width',width)
.attr('height',height);

var legendScale = d3.scaleLinear()
.domain([d3.min(legendDataSet),d3.max(legendDataSet)])
.range([0,260]);

var colorScale = d3.scaleQuantize()
.domain([d3.min(legendDataSet),d3.max(legendDataSet)])
.range(['#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b']);

console.log(d3.min(legendDataSet));

var legendAxis = d3.axisBottom()
.tickValues([3,12,21,30,39,48,57,66])
.tickSizeOuter(0)
.tickSizeInner(15)
.tickFormat(function(d){
    return d+'%';
})
.scale(legendScale);

var legend=svg.append('g')
.attr('id','legend')
.attr('transform','translate('+(width-360)+',40)');

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

legend.append("g")
.call(legendAxis)
.select('.domain')
.attr('stroke-width',0);

var drawPath=d3.geoPath();
var map=svg.append('g');
var mapCounty=map.append('g').attr('id','mapCounty');

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

map.append('path')
.attr('class','state')
.attr('d',drawPath(topojson.mesh(dataSet[1],dataSet[1].objects.states,function (a,b){return a!==b;})))
.style('fill','none')
.style('stroke','white');

var source = container.append("div")
.attr('id','source')
.html('Source: <a id="link" href="https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx">USDA Economic Research Service</a>')
}