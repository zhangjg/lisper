function Parser() 
{
    this.flore = -1;
    // this.iresult=0;//the ith result;
    this.ele = '';
    this.beginList = false;
    this.result = [];
    this.obj = {};
    this.line_size=0;
}

Parser.prototype.get_current_flore = function() 
{
    if (this.flore in this.obj == false) 
    {
        this.obj[this.flore] = [];
        //console.log("%j",this);
        if (this.flore > 0) {
            if((this.flore-1) in this.obj ==false)
            {
                this.obj[this.flore-1]=[];
            }
            this.obj[this.flore - 1].push(this.obj[this.flore]);
            //delete this.obj[this.flore];
            //this.flore --;
        }
    }
    return this.obj[this.flore];
};

Parser.prototype.__set_ele = function() {
    if (this.ele != '') 
    {
        // the up list have element not put in result
        this.ele = this.ele.trim();
        if (this.ele != '') { 
            var str=this.ele;
            this.ele = '';
            var num=Number(str);
            if(isNaN(num)==false)
            {
                //console.log("%j",this);
                this.get_current_flore().push(num);
            }else
            {
                this.get_current_flore().push(str);
            }
        }
    }
};

Parser.prototype.__set_result = function() {
    if (this.beginList==true && this.flore == -1) {
        this.result.push(this.obj[0]);
        this.ele = "";
        this.obj = {};
        this.beginList = false;
    }
    //console.trace("%j",this);
};

Parser.prototype.results = function() {
    var result=this.result.concat();
    result.needInputMore=true;
    result.line_size=this.line_size;
    if (this.beginList==false && this.flore == -1)
    {
        this.constructor();
        result.needInputMore=false;
    }
    return result;
};

Parser.prototype.add = function(line) {
    this.line_size=line.length;
    line = line.trim();
    for (var i = 0; i < line.length; ++i) {
        //console.log("line[%d]=%s", i, line[i]);
        switch (line[i]) {
        case '(': {// new list
            this.beginList = true;
            this.__set_ele();// put the down flore's last ele to down flore.
            this.flore++;// up one flore
            //this.get_current_flore();
            //console.trace("%j", this);
        }
            break;
        case ')': {// end current flore
            this.__set_ele();
            if(this.flore != 0)
            {
                delete this.obj[this.flore];
            }
            this.flore--;// feed back to the down flore
            this.__set_result();
            //console.trace("%j", this);
        }
            break;
        case ' ':
        case '\t': {// new ele
            this.__set_ele();
            //console.trace("%j", this);
        }
            break;
        default: {
            this.ele += line[i];
            //console.trace("%j", this);
        }
        }
    }
    this.__set_ele();
    //this.__set_result();
    //console.trace("%j",this);
};

exports.Parser=Parser;

function test() {
    console.log("module.name:%j",module.name);
    var p = new Parser();
    //p.add("(+ 2 3)");
    p.add("((4 5)(3 5))");
    //var l=[];
    var t=p.results();
    console.log(t);
    //console.log(p);
}

if (require.main == module) {
    test();
}
