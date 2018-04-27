var lcc=localStorage.getItem("oierdb_data");
if(lcc)
{
    lcc=JSON.parse(lcc);
    if(lcc['ver']!=db_ver)
        console.log('local data is out of date!'),lcc=null;
}
if(!lcc)
{
    console.log('loading data.js...');
    $.ajaxSetup({async:false});
    $.getScript("data.js");
    lcc={};lcc['ver']=db_ver;lcc['tbl']=tb;
    localStorage.setItem('oierdb_data',JSON.stringify(lcc));
    console.log('stored in localstorage.');
}
else
{
    console.log('loaded data from localstorage!');
    tb=lcc['tbl'];
}