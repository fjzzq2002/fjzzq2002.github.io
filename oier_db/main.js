if('undefined'==typeof tb)
    console.log('loading failed for some reason, fallback'),
    document.write('<script src="data.js" charset="UTF-8"></script>');
function chkpy(s,a) {return pinyin.chk(s,a);}
function hassub(a,s) {return a.indexOf(s)>=0;}
function dump(a) {return JSON.stringify(a);}
function change_h()
{
    $("#filter_box_ghost").val($("#filter_box").val());
    $("#filter_box").height($("#filter_box_ghost").prop("scrollHeight"));
}
function gen_td(txt,clas='')
{
    var node=document.createElement("td");
    node.appendChild(document.createTextNode(txt));
    if(clas!='') node.setAttribute('class',clas);
    return node;
}
function gen_span(txt)
{
    var node=document.createElement("span");
    node.setAttribute('alt',txt);
    node.setAttribute('style','display:none');
    return node;
}
function prt(x)
{
    var f=Math.round(x*100)/100;
    var s=f.toString();
    var rs=s.indexOf('.');
    if(rs<0) rs=s.length,s+='.';
    while(s.length<=rs+2) s+='0';
    return s;
}
function tryload(s)
{
    $("#filter_box").val(unescape(s)); change_h(); filter();
}
var ys=["小一","小二","小三","小四","小五","小六","初一","初二","初三","高一","高二","高三"]
for(var i=0;i<1000;i++) ys.push('高三以上');
function disp(id)
{
    var p=tb[id],txt='<h4>'+p[2]+'OIer'+p[0]+'，',sc=p[4].slice(0),high=0;
    if(p[1]!='@') txt+=p[1]+'，';
    if(p[3]!='@')
    {
        var s=new Date().toISOString();
        var y=s.substr(0,4)*1,m=s.substr(5,2);
        if(m<'09') --y;
        txt+='现在'+ys[y-p[3]]+'，';
        if(ys[y-p[3]]=='高三以上') high=1;
    }
    var g='';
    if(!high) g=sc.pop();
    if(sc.length)
    {
        txt+="曾在"+sc.join('、')+'学习';
        if(g!='') txt+='，现在'; else txt+='。';
    }
    if(g!='') txt+='在'+g+'学习。';
    txt+='评分 '+prt(p[6])+'（Rank '+(id+1)+'）';
    var func='pv=="'+p[2]+'"&&nm=="'+p[0]+'"';
    txt+='<a href="javascript:tryload(\''+escape(func)+'\');void(0);">';
    txt+='<i class="fa fa-external-link" style="font-size:18px;"></i></a>';
    txt+='</h4>';
    var aw=new Array();
    for(var s=0;s<p[5].length;++s)
        aw.push(p[5][s][0]);
    txt+='<h4>曾获得'+aw.join('、')+'。</h4>';
    $('#display_info').html(txt);
    $('#rating_change_body > tr').remove();
    $('#display_info').html(txt);
    $('#rating_change_body > tr').remove();
    for(var s=0;s<p[5].length;++s)
    {
        var node=document.createElement("tr");
        node.appendChild(gen_td(p[5][s][1]));
        node.appendChild(gen_td('#'+(p[5][s][2]+1)));
        node.appendChild(gen_td(prt(p[5][s][3])));
        $('#rating_change_body')[0].appendChild(node);
    }
}
function filter()
{
    var f=$("#filter_box").val();
    var ur=location.href.split('?')[0]+'?f='+escape(f);
    history.pushState({},null,ur);
    tmp=function(nm,pv,sc,score,grade,full){return eval(f);}
    rst=new Array();
    {
    var s=new Date().toISOString();
    var y=s.substr(0,4)*1,m=s.substr(5,2);
    if(m<'09') --y;
    for(var s=0;s<tb.length;++s)
    {
        var sc=tb[s][4][tb[s][4].length-1];
        if(tmp(tb[s][0],tb[s][2],sc,tb[s][6],ys[y-tb[s][3]],tb[s])) rst.push(s);
    }
    }
    $('#filter_result_num').html(rst.length);
    $('#filter_result_body > tr').remove();
    for(var g=0;g<rst.length;++g)
    {
        var node=document.createElement("tr");
        var ts=gen_td(tb[rst[g]][0]);
        ts.appendChild(gen_span(rst[g]));
        node.appendChild(ts);
        node.appendChild(gen_td(tb[rst[g]][2]));
        if(tb[rst[g]][3]!='@')
        {
            var s=new Date().toISOString();
            var y=s.substr(0,4)*1,m=s.substr(5,2);
            if(m<'09') --y;
            var str=ys[y-tb[rst[g]][3]];
            node.appendChild(gen_td(str,'hidden-xs'));
        }
        else node.appendChild(gen_td('未知','hidden-xs'));
        node.appendChild(gen_td(tb[rst[g]][4][tb[rst[g]][4].length-1]));
        node.appendChild(gen_td(prt(tb[rst[g]][6])));
        $('#filter_result_body')[0].appendChild(node);
    }
    $("#filter_result_body > tr").click(function () {
        var t=$(this).find("span").attr("alt");
        if(t!=undefined) disp(t*1);
    });
}
function GetQueryString(name)
{
     var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null) return unescape(r[2]); return null;
}
$(document).ready(function(){
    var s=GetQueryString('f');
    if(s!=null) $("#filter_box").val(s);
    change_h(); $("#filter_box").bind("input",change_h);
    $("#filter_box").bind("propertychange",change_h);
    $("#filter_button").bind("click",filter);
    $("#filter_result_body > tr").click(function () {
        var t=$(this).find("span").attr("alt");
        if(t!=undefined) disp(t*1);
    });
    $("#gen_button").click(function () {
        s=[];
        var tmp=$('#input_py').val();
        if(tmp!='') s.push('chkpy(nm,"'+tmp+'")');
        tmp=$('#input_name').val();
        if(tmp!='') s.push('nm=="'+tmp+'"');
        tmp=$('#input_prov').val();
        if(tmp!='') s.push('pv=="'+tmp+'"');
        tmp=$('#input_school').val();
        if(tmp!='') s.push('hassub(sc,"'+tmp+'")');
        tmp=$('#input_grade').val();
        if(tmp!='') s.push('grade=="'+tmp+'"');
        var ff='1';
        if(s.length) ff=s.join('&&');
        $("#filter_box").val(ff); change_h(); filter();
    });
    filter();
});
if(!history.pushState) console.log('better change your out-of-date browser!');