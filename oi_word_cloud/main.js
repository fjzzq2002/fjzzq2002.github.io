coeff=undefined;
function gather_data() {
    var scr={};
    for(var s of ['lojd','lojp','bzojp','blogs','oiwiki']) {
        for(var t of Object.keys(obj[s])) {
            var v=obj[s][t],ov=0;
            if(scr[t]!=undefined) ov=scr[t];
            scr[t]=ov+v*coeff[s];
        }
    }
    var maxv=1e-3;
    var minv=1e-3;
    for(var t of Object.keys(scr)) {
        maxv=Math.max(maxv,scr[t]);
        if(scr[t]>1e-6)
            minv=Math.min(minv,scr[t]);
        else scr[t]=undefined;
    }
    var mv=Math.log(maxv/minv+1e-7); mv=mv*mv;
    var labels=[],probs=[];
    for(var t of Object.keys(scr)) {
        var v=Math.log(scr[t]/minv+1e-7); v=v*v/mv;
        labels.push(t); probs.push(v);
    }
    var op=[];
    for(var i=0;i<labels.length;++i) {
        op.push({text:labels[i],value:probs[i]*1000});
    }
    console.log('loaded '+op.length+' words');
    return op;
}
function redraw() {
    var start=Date.now();
    d3.select("#cloud").selectAll("*").remove();
    var width = window.innerWidth-15;
    var height = window.innerHeight-15;
    d3.select("#cloud").style("width", width + 'px')
                    .style("height", height + 'px');
    console.log('width '+width+'  height '+height);
    var fill = d3.scaleOrdinal(d3.schemeDark2); //function(a) {return 'rgb(0,0,0)';};
    var data = gather_data();
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(data)
        .rotate(function() { return ((Math.random() * 6) - 3) * 2; })
        .on("end", draw);
    layout.start();
    function draw(words) {
        var dur=Date.now()-start;
        document.getElementById('plzwait').setAttribute('style','display:none');
        d3.select("#cloud")
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .text((d) => d.text)
            .style("font-size", (d) => d.size + "px")
            .style("font-family", (d) => d.font)
            .style("fill", (d, i) => fill(i))
            .attr("text-anchor", "middle")
            .attr("transform", (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")");
        console.log('Finally done! Took '+dur/1000.+'s.');
    }
}
function gen() {
    coeff={};
    for(var s of ['lojd','lojp','bzojp','blogs','oiwiki']) {
        coeff[s]=document.getElementById('s_'+s).value*1.;
    }
    document.getElementById('controls').setAttribute('style','display:none');
    document.getElementById('plzwait').setAttribute('style','display:block');
    setTimeout(redraw,0);
}