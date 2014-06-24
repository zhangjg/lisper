Readline=require('readline');
var environment={};

environment['+']=function()
{
    if(argument[0]!=argument.caller.name){
        throw Error("Parse Error");
    }
    var ret=argument[1];
    for(var i=2;i<argument.length;++i)
    {
        ret += argument[i];
    }
    return ret;
};

environment['-']=function()
{
    if(argument[0]!=argument.caller.name){
        throw Error("Parse Error");
    }
    var ret=argument[1];
    for(var i=2;i<argument.length;++i)
    {
        ret -= argument[i];
    }
    return ret;
};

environment['*']=function()
{
    if(argument[0]!=argument.caller.name){
        throw Error("Parse Error");
    }
    var ret=argument[1];
    for(var i=2;i<argument.length;++i)
    {
        ret *= argument[i];
    }
    return ret;
};

environment['/']=function()
{
    if(argument[0]!=argument.caller.name){
        throw Error("Parse Error");
    }
    var ret=argument[1];
    for(var i=2;i<argument.length;++i)
    {
        ret /= argument[i];
    }
    return ret;
}

environment.quote=function()
{
    if(argument[0]!=argument.caller.name){
        throw Error("Parse Error");
    }
    if(argument.length !=2 )
    {
        console.error('bad synty');
    }
    return argument[2];
}

environment.autom=function()
{
    if(argument[0]!=argument.caller.name){
        throw Error("Parse Error");
    }

    if(argument.length!= 2)
    {       
        console.error('bad synty');
    }

    var x=argument[1];
    if( x instanceof Array)
    {
        if( x.length==0)
        {
            return true;
        }else
        {
            return false;
        }
    }else
    {
        return true;
    }
}

environment.eq=function()
{
    if(argument.caller.name==argument[0])
    {

    }
    return a === b ;
}

environment.car=function(l)
{
    return l[0];
}

environment.cdr=function(l)
{
    return l.slice(1)
}

environment.cons=function(a,l)
{
    if(this.autom(l))
    {
        return [a,l];
    }
    var t=[a];
    t.concat(l);
}

function value(l,env)
{
    env = env|| environment;
    if(env !== environment)
    {
        env.prototype=environment;
    }
env[l[0]]
}



function Parser(src)
{
    var count=0;
    var obj={};
    var ele='';
    for(var i=0;i<src.length;++i)
    {
        if( src[i] == '(')
        {
            ele=ele.trim();
            if(ele != '' && count >= 1)
            {
                obj[count-1].push(ele);
                ele='';
            }
 
            obj[count]=[];//the count th lisp
            count++;
            if(count != 1)
            {
                obj[count-2].push(obj[count-1]);
            }
            console.log("count:%d",count);
            console.log(obj[0]);
        }else if(src[i]==')')
        {
            ele=ele.trim();
            if(ele != '')
            {
                obj[count-1].push(ele);
                ele='';
            }
            count--;
        }else if(src[i]==" " || src[i]=='\t')
        {
            ele=ele.trim();
            if(ele != '')
            {
                obj[count-1].push(ele);
                ele='';
            }
        }else{
            ele+=src[i];
        }
    }
    if(count ==0 )
    {
        return obj[count];
    }else
    {
        throw new Error("Not a lisp");
    }
}

function Computer(str)
{
    console.log(Parser(str));
}
function Loop(rl)
{
    rl.prompt();
    rl.on('line',function(line){
        line=line.trim();
        rl.prompt();
        if(line=='quit' || line=='exit'||line=='bye' )
        {
            console.log("bye");
            rl.close();
            return ;
        }else
        {
            Computer(line);
            rl.prompt();
        }
    });
}

function main()
{
    var rl = Readline.createInterface({input:process.stdin,output:process.stdout});
    rl.setPrompt("lisper>");
    Loop(rl);
}

if (require.main == module)
{
    main();
}