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
    function loadEverything(){
        var width=960;
        var height=550;
        dataSet.children.forEach(addTotalValue)
        function addTotalValue(currValue,index,arr){
            var totalValue=0;
            for(let i =0;i<arr[index].children.length;i++){
                totalValue+=parseFloat(arr[index].children[i].value);
            }
            arr[index].totalValue=totalValue;
        }
        dataSet.children.sort((a,b)=>(a.totalValue<b.totalValue)?1:-1);
        console.log(dataSet);

        var title=d3.select('body')
        .append('text')
        .attr('id','title')
        .text('Video Game Sales');

        var description=d3.select('body')
        .append('text')
        .attr('id','description')
        .text('Top 100 Most Sold Video Games Grouped by Platform');

        var container=d3.select('body')
        .append('div')
        .attr('id','container');
        var tooltip=d3.select('#container')
        .append('div')
        .attr("id",'tooltip');
        //treemap
        var treeMapSvg=container.append('svg')
        .attr('id','tree-map')
        .attr('width',width)
        .attr('height',height)

       //treemap
       var root= d3.hierarchy(dataSet)
       .sum(function(d){return d.value;});

       var treemap=d3.treemap()
       .size([width,height])
       .padding(0)
       (root);
       console.log(root.leaves());
       var treeMapElements=treeMapSvg.selectAll('g')
       .data(root.leaves())
       .enter()
       .append('g')
       .attr('transform',(d)=>{
           return 'translate('+d.x0+','+d.y0+')'
       })
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
        .on('mouseover',function(d){
            tooltip.style('opacity',0.9)
            .attr('data-value',d.data.value)
            .append('text')
            .html(()=>{
                return 'Name: '+d.data.name+'<br>'+'Category: '+d.data.category+'<br>'+'Value: '+d.data.value;
            })
            treeMapRects.on('mousemove',function(){
                var position=event;
                var tooltipHeight=document.getElementById('tooltip').clientHeight;
                tooltip.style('left',position.pageX+10+'px')
                .style('top',position.pageY-(tooltipHeight/2)+'px')
            })
            var tooltipHeight=document.getElementById('tooltip').clientHeight;
        })
        .on('mouseout', function(d){
            tooltip
            .style('opacity',0)
            .select('text')
            .remove();
        });;

        console.log(dataSet.children[0].children[0].name.split(' ')[0])
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
    
        //legend
        var legendDataSet=['Wii','GB','PS2','SNES','GBA','2600','DS','PS3','3DS','PS','XB','PSP','X360','NES','PS4','N64','PC','XOne']
        var legendSvgWidth=60+(Math.ceil(legendDataSet.length/6)*150);
        var legendSvg=d3.select('body')
        .append('svg')
        .attr('id','legend')
        .attr('width',legendSvgWidth)
        .attr('height',160);

        var legendGroup=legendSvg.append("g")
        .attr('transform','translate(60,10)');

        var legendElements=legendGroup.selectAll('g')
        .data(legendDataSet)
        .enter()
        .append('g')
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
        legendElements.append('text')
        .attr('transform',(d,i)=>{
            var x=(Math.floor((i)/6)*150)+19;
            var y=((i%6)*25)+13;
            return 'translate('+x+','+y+')'
        })
        .text((d)=>{
            return d;
        });


    }
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