Readline=require('readline');
var environment={};

environment.bye=function()
{
    console.log("bye");
    process.exit(0);
}

environment['+']=function()
{
    //console.trace(arguments);
    var ret=arguments[1];
    for(var i=2;i<arguments.length;++i)
    {
        ret += arguments[i];
    }
    return ret;
};


environment['-']=function()
{
    //check(arguments);
    var ret=arguments[1];
    for(var i=2;i<arguments.length;++i)
    {
        ret -= arguments[i];
    }
    return ret;
};


environment['*']=function()
{
    //check(arguments);
    var ret=arguments[1];
    for(var i=2;i<arguments.length;++i)
    {
        ret *= arguments[i];
    }
    return ret;
};

environment['/']=function()
{
    var ret=arguments[1];
    for(var i=2;i<arguments.length;++i)
    {
        ret /= arguments[i];
    }
    return ret;
}


environment.quote=function()
{
    //console.log("arguments:%j",arguments);
    if(arguments.length <2 )
    {
        console.error('bad synty');
        throw new Error("bad synty");
    }
    return arguments[1];
};

environment.autom=function()
{
    //console.log("arguments:%j",arguments);
    if(arguments.length!= 2)
    {
        console.error('bad synty');
        throw new Error("bad synty");
    }

    var x=arguments[1];
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
};

environment.eq=function()
{
    //check(arguments);
    if(arguments.length != 3)
    {
        throw new Error("bad synty");
    }
    return arguments[1] === arguments[2] ;
};

environment['=?']=environment.eq;


environment.car=function()
{
    //console.log("arguments:%j",arguments);
    if(arguments.length == 2)
    {
        var l = arguments[1];
        if(l instanceof Array)
        {
             return l[0];
        }
    }
    throw new Error("bad synty");
};


environment.cdr=function()
{
    //check(arguments);
    if(arguments.length == 2)
    {
        var l = arguments[1];
        if(l instanceof Array)
        {
            return l.slice(1);
        }
    }
    throw new Error("bad synty");
};

//(lamda (a1,a3)())
environment.lambda=function(lambda,param,body)
{
    var ret=body.concat()
    ret.param=param;
    return ret;
};

environment.cons=function()
{
    console.log("arugments:%j",arguments);
    if(arguments.length != 3)
    {
        throw new Error("bad synty");
    }
    var t=arguments[2];
    if(t instanceof Array){
        t.unshift(arguments[1]);
    }else{
        t=[arguments[1],arguments[2]];
    }
    return t;
};


function value(l,env)
{
    //console.trace(l);
    env = env|| environment;
    if(env !== environment)
    {
        env.prototype=environment;
    }
    if(l instanceof Array == false)
    {
        return l;
    }else{
        if(l[0] == 'quote')
        {
            return env.quote.apply(env,l);
        }
        
        if(l[0] == 'lambda')
        {
            return env.lambda.apply(env,l);
        }
        
        l.forEach(function (item,index,array)
        {
            if(index != 0)
            {
                if(item instanceof Array)
                { 
                    var result=value(item,env);
                    //console.log("item:%j=%j",item,result);
                    array[index]=result;
                }
            }
        });
        
        if(l[0] instanceof Array)
        {
            var ls=l[0];
            if(ls[0]== 'lambda')
            {
                l[0]=env[ls[0]].apply(env,ls);
            }
        }
        if(l[0].param != null)
        {
            //l[0] is lambda 
            var lambda = l[0];
            var arg=lambda.param.concat();
            var o={};
            arg.forEach(function(item,index)
            {
                o[item]=l[index+1];
            });
            lambda=lambda.concat();
            lambda.forEach(function(item,index,array)
            {
                if(item in o)
                {
                    array[index]=o[item];
                }
            } );
            return env[lambda[0]].apply(env,lambda);
        }
        
        if(l[0] in env)
        {
            return env[l[0]].apply(env,l);
        }else
        {
            throw new Error("Not not find function "+l[0]);
        }
    }
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
    
    function s_t_n(str)
    {
        var i=/[\+-]?(\d+|0x[\da-fA-F]+|0[0-7]+)/;
        var d=/^((\+|-)?\d*\.?\d+)$/;
        var d2=/^((\+|-)?\d*\.?\d+(e|E)(\+|-)\d+)$/
       
        if(i.test(str) || d.test(str) ||d2.test(str))
        {
            return Number(str);
        }
        return str;
    }
    if(count ==0 )
    {
        if((count in obj )== false && ele!='')
        {
            return s_t_n(ele)
        }
        var ret = obj[count];
        //console.log(ret);
        ret= ret.map(function (item){
            if(item instanceof Array)
            {
                //return item.map(arguments.caller);
                //console.log(arguments.callee.name);
                return item.map(arguments.callee);
            }
            if( typeof(item) == "string")
            {
                return s_t_n(item);
            }
        });
        //console.log(ret);
        return ret
    }else
    {
        throw new Error("Not a lisp");
    }
}

function Computer(str)
{
    if(str.trim() == '')
    {
        console.log(str);
        return;
    }
    var l = Parser(str);
    var t=value( l );
    if(t instanceof Array)
    {
        t=t.join(" ");
        t="("+t+")";
    }
    console.log( t );
}

function Loop(rl)
{
    rl.prompt();
    rl.on('line',function(line){
        line=line.trim();
        rl.prompt();
        Computer(line);
        rl.prompt();
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