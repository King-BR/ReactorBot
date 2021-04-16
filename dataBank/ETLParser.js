// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

	const ezier = {
		"sin": (n) => Math.sin(parseFloat(n)/180*Math.PI),
		"cos": (n) => Math.cos(parseFloat(n)/180*Math.PI),
		"tan": (n) => Math.tan(parseFloat(n)/180*Math.PI),
		"len": (a,b) => (parseFloat(a) **2 + parseFloat(b)**2)**0.5,
		
		"pow": (d) => parseFloat(d[0]) ** parseFloat(d[4]),
		
		"mul": (d) => parseFloat(d[0]) * parseFloat(d[4]),
		"div": (d) => parseFloat(d[0]) / parseFloat(d[4]),
		"mod": (d) => parseFloat(d[0]) % parseFloat(d[4]),
		"idiv": (d) => Math.floor(parseFloat(d[0]) / parseFloat(d[4])),
		
		"add": (d) => parseFloat(d[0]) + parseFloat(d[4]),
		"sub": (d) => parseFloat(d[0]) - parseFloat(d[4]),

		"shl": (d) => parseFloat(d[0]) << parseFloat(d[4]),
		"shr": (d) => parseFloat(d[0]) >> parseFloat(d[4]),
		
		"lessThan": (d) => parseFloat(d[0]) < parseFloat(d[4]),
		"lessThanEq": (d) => parseFloat(d[0]) <= parseFloat(d[4]),
		"greaterThan": (d) => parseFloat(d[0]) > parseFloat(d[4]),
		"greaterThanEq": (d) => parseFloat(d[0]) >= parseFloat(d[4]),
		
		"equal": (d) => parseFloat(d[0]) == parseFloat(d[4]),
		"notEqual": (d) => parseFloat(d[0]) != parseFloat(d[4]),
		"strictEqual": (d) => parseFloat(d[0]) === parseFloat(d[4]),
		
		"and": (d) => parseInt(d[0]) && parseInt(d[4]),
		"or": (d) => parseInt(d[0]) | parseInt(d[4]),
		
	};

	const cez = (name,arr) => !arr.some(v => isNaN(v)) && ezier[name];
	const op1 = (name,n = 0,numb = 0) => (d) => cez(name,[d[n]]) ? ezier[name](d[n]) : [name,d[n],numb];	
	const op2 = (name) => (d) => {
		
		if(!isNaN(d[0]) && !isNaN(d[4]) && ezier[name])
			return ezier[name](d);
		
		return [name,d[0],d[4]];
	};
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Main", "symbols": ["SET"], "postprocess": id},
    {"name": "SET", "symbols": ["lines"], "postprocess": d => {
        	const breakline = "\n";
        	let txt = "";
        	let callStack = [[d[0],"_",0,true]];
        	
        	//return d;
        	
        	if(!Array.isArray(d[0]))
        		return d[0];
        	
        	while(callStack.length){
        		let args = callStack.pop();
        		let v = args[0];
        		let name = args[1];
        		let l = args[2];
        		let lf = v[1];
        		let rg = v[2];
        		let r = name + "_"+l;
        		
        		if(v[0] == "newline"){
        			callStack.push([v[1],"_",0]);
        			callStack.push([v[2],"_",0]);
        			continue;
        		}
        		
        		if(Array.isArray(rg) && rg[0] == "set"){
        			callStack.push([rg,rg[1],0])
        			rg = rg[1]
        		}
        		
        		if(v[0] == "drawflush") {
        			
        			txt = `drawflush ${v[1]}${breakline}${txt}`;
        			
        		} else if(v[0] == "circle") {
        			
        			txt = `draw poly ${v[1]} ${v[2]} 10 ${v[4]} 0 0${breakline}${txt}`;
        			
        		} else if(v[0] == "clear") {
        			
        			txt = `draw clear 0 0 0 0 0 0${breakline}${txt}`;
        			
        		} else if(v[0] == "print") {
        			
        			if(Array.isArray(lf)){
        				callStack.push([lf,name,l]);
        				lf = name + "_" + l;
        			}
        			
        			txt = `print ${lf}${breakline}printflush ${rg}${breakline}${txt}`;
        			
        		} else if(v[0] == "set") {
        			
        			name = lf;
        			
        			if (!Array.isArray(rg)){
        				txt = `set ${name} ${rg}${breakline}${txt}`;
        				continue;
        			} else {
        				callStack.push([rg,name,l,true])
        			} 
        			
        		} else {
        			
        			if(Array.isArray(lf)){
        				callStack.push([lf,name,l]);
        				lf = name + "_"+l
        				l++;
        			}
        			
        			if(Array.isArray(rg)){
        				callStack.push([rg,name,l]);
        				rg = name + "_"+l
        			}
        			
        			txt = `op ${v[0]} ${args[3]?name:r} ${lf} ${rg}${breakline}${txt}`
        		}
        	}
        	
        	return txt;
        }},
    {"name": "P21", "symbols": [{"literal":"("}, "_", "P3", "_", {"literal":")"}], "postprocess": d=>d[2]},
    {"name": "P21$string$1", "symbols": [{"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P21", "symbols": ["P21$string$1", "_", "P21"], "postprocess": op1("sin",2)},
    {"name": "P21$string$2", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P21", "symbols": ["P21$string$2", "_", "P21"], "postprocess": op1("cos",2)},
    {"name": "P21$string$3", "symbols": [{"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P21", "symbols": ["P21$string$3", "_", "P21"], "postprocess": op1("tan",2)},
    {"name": "P21$string$4", "symbols": [{"literal":"p"}, {"literal":"r"}, {"literal":"i"}, {"literal":"n"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P21", "symbols": ["P21$string$4", "_", {"literal":"("}, "_", "P3", "_", {"literal":")"}], "postprocess": d=>["print",d[4],"message1"]},
    {"name": "P21$string$5", "symbols": [{"literal":"p"}, {"literal":"r"}, {"literal":"i"}, {"literal":"n"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P21", "symbols": ["P21$string$5", "_", {"literal":"("}, "_", "P3", "_", {"literal":","}, "_", "P3", {"literal":")"}], "postprocess": d=>["print",d[4],d[8]]},
    {"name": "P21$string$6", "symbols": [{"literal":"l"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P21", "symbols": ["P21$string$6", "_", {"literal":"("}, "_", "P3", "_", {"literal":","}, "_", "P3", {"literal":")"}], "postprocess": d=>cez("len",[d[4],d[8]])? ezier["len"](d[4],d[8]):["len",d[4],d[8]]},
    {"name": "P21$string$7", "symbols": [{"literal":"c"}, {"literal":"l"}, {"literal":"e"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P21", "symbols": ["P21$string$7", "_", {"literal":"("}, "_", {"literal":")"}], "postprocess": d=>["clear",0,0,0]},
    {"name": "P21$string$8", "symbols": [{"literal":"c"}, {"literal":"i"}, {"literal":"r"}, {"literal":"c"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P21", "symbols": ["P21$string$8", "_", {"literal":"("}, "_", "P3", "_", {"literal":","}, "_", "P3", "_", {"literal":","}, "_", "P3", "_", {"literal":")"}], "postprocess": d=>["circle",d[4],d[8],10,d[12],0]},
    {"name": "P21$string$9", "symbols": [{"literal":"d"}, {"literal":"r"}, {"literal":"a"}, {"literal":"w"}, {"literal":"f"}, {"literal":"l"}, {"literal":"u"}, {"literal":"s"}, {"literal":"h"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P21", "symbols": ["P21$string$9", "_", {"literal":"("}, "_", {"literal":")"}], "postprocess": d=>["drawflush","display1"]},
    {"name": "P21", "symbols": ["VAR"], "postprocess": id},
    {"name": "P17", "symbols": [{"literal":"!"}, "_", "P21"], "postprocess": d=>["not",d[2],0]},
    {"name": "P17", "symbols": [{"literal":"-"}, "_", "P21"], "postprocess": d=>["mul",d[2],-1]},
    {"name": "P17", "symbols": ["P21"], "postprocess": id},
    {"name": "P16$string$1", "symbols": [{"literal":"*"}, {"literal":"*"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P16", "symbols": ["P17", "_", "P16$string$1", "_", "P16"], "postprocess": op2("pow")},
    {"name": "P16", "symbols": ["P17"], "postprocess": id},
    {"name": "P15", "symbols": ["P15", "_", {"literal":"*"}, "_", "P16"], "postprocess": op2("mul")},
    {"name": "P15", "symbols": ["P15", "_", {"literal":"/"}, "_", "P16"], "postprocess": op2("div")},
    {"name": "P15$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P15", "symbols": ["P15", "_", "P15$string$1", "_", "P16"], "postprocess": op2("idiv")},
    {"name": "P15", "symbols": ["P15", "_", {"literal":"%"}, "_", "P16"], "postprocess": op2("mod")},
    {"name": "P15", "symbols": ["P16"], "postprocess": id},
    {"name": "P14", "symbols": ["P14", "_", {"literal":"+"}, "_", "P15"], "postprocess": op2("add")},
    {"name": "P14", "symbols": ["P14", "_", {"literal":"-"}, "_", "P15"], "postprocess": op2("sub")},
    {"name": "P14", "symbols": ["P15"], "postprocess": id},
    {"name": "P13$string$1", "symbols": [{"literal":"<"}, {"literal":"<"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P13", "symbols": ["P13", "_", "P13$string$1", "_", "P14"], "postprocess": op2("shl")},
    {"name": "P13$string$2", "symbols": [{"literal":">"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P13", "symbols": ["P13", "_", "P13$string$2", "_", "P14"], "postprocess": op2("shr")},
    {"name": "P13$string$3", "symbols": [{"literal":">"}, {"literal":">"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P13", "symbols": ["P13", "_", "P13$string$3", "_", "P14"], "postprocess": d=>["and",["shr",d[0],d[4]], isNaN(d[4]) ? ["sub",["shl",1,["sub",32,d[4]]],1]: 1<<(32-parseInt(d[4]))-1] 
        	},
    {"name": "P13", "symbols": ["P14"], "postprocess": id},
    {"name": "P12", "symbols": ["P12", "_", {"literal":"<"}, "_", "P13"], "postprocess": op2("gtn")},
    {"name": "P12", "symbols": ["P13"], "postprocess": id},
    {"name": "P11$string$1", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P11", "symbols": ["P11", "_", "P11$string$1", "_", "P12"], "postprocess": op2("equal")},
    {"name": "P11$string$2", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P11", "symbols": ["P11", "_", "P11$string$2", "_", "P12"], "postprocess": op2("notEqual")},
    {"name": "P11$string$3", "symbols": [{"literal":"="}, {"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P11", "symbols": ["P11", "_", "P11$string$3", "_", "P12"], "postprocess": op2("strictEqual")},
    {"name": "P11$string$4", "symbols": [{"literal":"!"}, {"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P11", "symbols": ["P11", "_", "P11$string$4", "_", "P12"], "postprocess": d=>["not",["strictEqual",d[0],d[4]],0]},
    {"name": "P11", "symbols": ["P12"], "postprocess": id},
    {"name": "P10", "symbols": ["P10", "_", {"literal":"&"}, "_", "P11"], "postprocess": op2("and")},
    {"name": "P10", "symbols": ["P11"], "postprocess": id},
    {"name": "P9", "symbols": ["P9", "_", {"literal":"^"}, "_", "P10"], "postprocess": op2("xor")},
    {"name": "P9", "symbols": ["P10"], "postprocess": id},
    {"name": "P8", "symbols": ["P8", "_", {"literal":"|"}, "_", "P9"], "postprocess": op2("or")},
    {"name": "P8", "symbols": ["P9"], "postprocess": id},
    {"name": "P7$string$1", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P7", "symbols": ["P7", "_", "P7$string$1", "_", "P8"], "postprocess": op2("land")},
    {"name": "P7", "symbols": ["P8"], "postprocess": id},
    {"name": "P6$string$1", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P6", "symbols": ["P6", "_", "P6$string$1", "_", "P7"], "postprocess": op2("or")},
    {"name": "P6", "symbols": ["P7"], "postprocess": id},
    {"name": "P5$string$1", "symbols": [{"literal":"?"}, {"literal":"?"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P5", "symbols": ["P5", "_", "P5$string$1", "_", "P6"], "postprocess": d=>["or",["and",["strictEqual",d[0],null],d[4]],d[0]]},
    {"name": "P5", "symbols": ["P6"], "postprocess": id},
    {"name": "P4", "symbols": ["P5", "_", {"literal":"?"}, "_", "P5", "_", {"literal":":"}, "_", "P4"], "postprocess": d=>["or",["and",d[0],d[4]],d[8]]},
    {"name": "P4", "symbols": ["P5"], "postprocess": id},
    {"name": "P3", "symbols": ["VAR", "_", {"literal":"="}, "_", "P3"], "postprocess": op2("set")},
    {"name": "P3$string$1", "symbols": [{"literal":"+"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$1", "_", "P3"], "postprocess": d=>["set",d[0],["add",d[0],d[4]]]},
    {"name": "P3$string$2", "symbols": [{"literal":"-"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$2", "_", "P3"], "postprocess": d=>["set",d[0],["sub",d[0],d[4]]]},
    {"name": "P3$string$3", "symbols": [{"literal":"*"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$3", "_", "P3"], "postprocess": d=>["set",d[0],["mul",d[0],d[4]]]},
    {"name": "P3$string$4", "symbols": [{"literal":"/"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$4", "_", "P3"], "postprocess": d=>["set",d[0],["div",d[0],d[4]]]},
    {"name": "P3$string$5", "symbols": [{"literal":"%"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$5", "_", "P3"], "postprocess": d=>["set",d[0],["mod",d[0],d[4]]]},
    {"name": "P3$string$6", "symbols": [{"literal":"<"}, {"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$6", "_", "P3"], "postprocess": d=>["set",d[0],["shl",d[0],d[4]]]},
    {"name": "P3$string$7", "symbols": [{"literal":">"}, {"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$7", "_", "P3"], "postprocess": d=>["set",d[0],["shr",d[0],d[4]]]},
    {"name": "P3$string$8", "symbols": [{"literal":">"}, {"literal":">"}, {"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$8", "_", "P3"], "postprocess": d=>["set",d[0],["shr",d[0],d[4]]]},
    {"name": "P3$string$9", "symbols": [{"literal":"&"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$9", "_", "P3"], "postprocess": d=>["set",d[0],["and",d[0],d[4]]]},
    {"name": "P3$string$10", "symbols": [{"literal":"^"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$10", "_", "P3"], "postprocess": d=>["set",d[0],["xor",d[0],d[4]]]},
    {"name": "P3$string$11", "symbols": [{"literal":"|"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "P3", "symbols": ["VAR", "_", "P3$string$11", "_", "P3"], "postprocess": d=>["set",d[0],["or" ,d[0],d[4]]]},
    {"name": "P3", "symbols": ["P4"], "postprocess": id},
    {"name": "lines$ebnf$1", "symbols": [{"literal":"\n"}]},
    {"name": "lines$ebnf$1", "symbols": ["lines$ebnf$1", {"literal":"\n"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "lines", "symbols": ["lines", "lines$ebnf$1", "P3"], "postprocess": d=>["newline",d[0],d[2]]},
    {"name": "lines", "symbols": ["P3"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": d=>parseInt(d[0].join(""))},
    {"name": "VAR$ebnf$1", "symbols": [/[@a-zA-Z0-9\.]/]},
    {"name": "VAR$ebnf$1", "symbols": ["VAR$ebnf$1", /[@a-zA-Z0-9\.]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "VAR", "symbols": ["VAR$ebnf$1"], "postprocess": d=>d[0].join("")},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]}
]
  , ParserStart: "Main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
