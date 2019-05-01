//warning: do not use chrome developer tools to view local storage, chrome may crash

var lcc=localStorage.getItem("oierdb_data");
if(lcc)
{
    lcc=JSON.parse(LZString.decompressFromUTF16(lcc));
    if(lcc['ver']!=db_ver)
        console.log('local data is out of date!'),lcc=null;
}
if(!lcc)
{
    console.log('loading data.js...');
    $.ajaxSetup({async:false});
    $.getScript("data.js");
    lcc={};lcc['ver']=db_ver;lcc['tbl']=tb;
    localStorage.setItem('oierdb_data',LZString.compressToUTF16(JSON.stringify(lcc)));
    console.log('stored in localstorage.');
}
else
{
    console.log('loaded data from localstorage!');
    tb=lcc['tbl'];
}