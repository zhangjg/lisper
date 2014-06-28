var environment={};

//SynError.prototype=Error;

environment["+"]=function()
{
    if(arguments.length<2)
    {
        throw new Error(arguments.callee.name+" nedd at lest 1 argument.");
    }
    var ret=arguments[1];
    for(var i=2;i<arguments.length;++i)
    {
        ret +=arguments[i];
    }
    return ret;
};
environment["-"]=function()
{
    if(arguments.length<2)
    {
        throw new Error(arguments.callee.name+" nedd at lest 1 argument.");
    }
    var ret=arguments[1];
    for(var i=2;i<arguments.length;++i)
    {
        ret -=arguments[i];
    }
    return ret;
};

environment["*"]=function()
{
    if(arguments.length<2)
    {
        throw new Error(arguments.callee.name+" nedd at lest 1 argument.");
    }
    var ret=arguments[1];
    for(var i=2;i<arguments.length;++i)
    {
        ret *=arguments[i];
    }
    return ret;
};
environment["/"]=function()
{
    if(arguments.length<2)
    {
        throw new Error(arguments.callee.name+" nedd at lest 1 argument.");
    }
    var ret=arguments[1];
    for(var i=2;i<arguments.length;++i)
    {
        ret /=arguments[i];
    }
    return ret;
};

environment.lambda=function(lambda,params,bodys)
{
    //['lambad',[params],[bodys]]
    var ret=bodys.concat();
    if(bodys instanceof Array && params instanceof Array )
    {
        ret.params=params;
        return ret;
    }
    throw new Error("Lambda errory.");
};

environment.define=function(define,name,value)
{
    if(arguments.length != 3)
    {
        console.log(arguments);
        throw new Error("define error");
    }
    if(typeof(name)=='string' || typeof(name)=='number')
    {
        environment[name]=caculate(value);
        return value;
    }
}

environment.concat=function(concat,a,l)
{
    var ret;
    if(l instanceof Array == false)
    {
        ret=[l];
    }else
    {
        ret=l.concat();
    }
    ret.unshift(a);
    return ret;
}

/*
if(global.environment!= null)
{
    global.environment=environment;
}
*/

function caculate(l)
{
    if(typeof(l) == 'number')
    {
        return l;
    }
    if(typeof(l) == 'string')
    {
        return environment[l];
    }
    
    if( l instanceof Array)
    {
        //console.trace(l);
        if(typeof(l[0])=='string')
        {
            //console.trace(l[0]);
            if(typeof(environment[l[0]])=='function')
            {
                return environment[l[0]].apply(environment,l);
            }
            else
            {
                //console.trace(environment[l[0]]);
                l[0]=environment[l[0]];
                console.log(l);
                return caculate(l);
                //return environment[l[0]].apply(environment,l);
            }
        }
        if(l[0] instanceof Array)
        {
            //lambda call
            if('params' in l[0] == false)
            {
                throw new Error('synError');
            }
            var lambda_fun=l[0].concat(); 
            var param=l[0].params.concat();
            var arg=l.splice(1);
            if(param.length != arg.length)
            {
                throw new Error("Need "+param.length +" parameters get "+arg.length);
            }
            var obj={};
            arg.map( function(item,index)
            {
                obj[param[index]]=item;
            } );
            /* TODO process the more arguments
            if(var i=arg.length;i<param.length; ++i)
            {
                obj[param[i]]=environment[paramp[i]];
            }
            */
            for(var i=1;i<lambda_fun.length;++i)
            {   //parameter biding
                var ele=lambda_fun[i];
                if(ele in obj)
                {
                    lambda_fun[i]=obj[ele];
                }
            }
            //console.log(lambda_fun[0]);
            return environment[lambda_fun[0]].apply(environment,lambda_fun);
        }
    }
}

exports.caculate=caculate;

if(require.main == module)
{
    //var l=['+', 2, 3 ];l.needInputMore=false; 
    //var l=['lambda', ['x'], ["+", "x", 1] ];l.needInputMore=false; 
    //var l=[ '+', 'x', 1];l.params=[ 'x' ];l=[l,2];
    var l=["define","x",3.14]
    
    var ret=caculate(l);
    console.log(ret);
}