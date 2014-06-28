var Parser=require("./Parser").Parser;
var caculate=require("./Computer").caculate;
Readline=require('readline'); 

function loop(rl)
{
    var p = new Parser();
    rl.prompt();
    var ret=null;
    rl.on('line',function(line){
        line=line.trim();
        //console.log(line);
        rl.prompt();
        p.add(line);
        if(ret == null){
            ret=p.results();
        }else
        {
            var f=p.results();
            ret=ret.concat(f);
            ret.needInputMore=f.needInputMore;
            ret.line_size = f.line_size;
            delete f.needInputMore;
            delete f.line_size;
        }
        if(ret.needInputMore)
        {
            var more='lisper>';
            //console.log(prompt);
            for(var i=0;i<ret.line_size;++i)
            {
                more+=" ";
            }
            rl.setPrompt(more);
            //console.log(more);
            rl.prompt();
        }else{
            rl.setPrompt("lisper>");
            rl.prompt();
            for(var i=0;i<ret.length;++i)
            {
                var t=caculate(ret[i]);
                console.log(t); 
                rl.prompt();
            }
            ret=null;
        }
        //rl.prompt();
    });
}

function main()
{
    //console.log(Parser);
    var rl = Readline.createInterface({input:process.stdin,output:process.stdout});
    rl.setPrompt("lisper>");
    loop(rl);
}

if(require.main == module)
{
    main();
}