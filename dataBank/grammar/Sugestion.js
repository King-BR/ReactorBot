// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "MAIN", "symbols": ["mcomp"], "postprocess": d=>Object.fromEntries(d[0])},
    {"name": "mcomp", "symbols": ["mcomp", {"literal":"\n"}, "comp"], "postprocess": d=>d[0].concat([d[2]])},
    {"name": "mcomp", "symbols": ["comp"]},
    {"name": "comp$ebnf$1$string$1", "symbols": [{"literal":">"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "comp$ebnf$1", "symbols": ["comp$ebnf$1$string$1"], "postprocess": id},
    {"name": "comp$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comp$ebnf$2", "symbols": ["description2"], "postprocess": id},
    {"name": "comp$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comp", "symbols": ["comp$ebnf$1", "title", {"literal":":"}, "description1", "comp$ebnf$2"], "postprocess": d=>[d[1],d[3]+(d[4]||"")]},
    {"name": "title$ebnf$1", "symbols": [/[^*_~`\n:]/]},
    {"name": "title$ebnf$1", "symbols": ["title$ebnf$1", /[^*_~`\n:]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "title", "symbols": ["txtdec", "title$ebnf$1", "txtdec"], "postprocess": d=>d[1].join("").trim().toLowerCase()},
    {"name": "description1$ebnf$1", "symbols": [/[^\n]/]},
    {"name": "description1$ebnf$1", "symbols": ["description1$ebnf$1", /[^\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "description1", "symbols": ["description1$ebnf$1"], "postprocess": (d) => d[0].join("").trim()},
    {"name": "description2$ebnf$1", "symbols": []},
    {"name": "description2$ebnf$1$subexpression$1", "symbols": [/[^:]/]},
    {"name": "description2$ebnf$1", "symbols": ["description2$ebnf$1", "description2$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "description2", "symbols": [{"literal":"\n"}, "description2$ebnf$1"], "postprocess": (d) => d[1].join("").trim()},
    {"name": "txtdec$ebnf$1", "symbols": []},
    {"name": "txtdec$ebnf$1", "symbols": ["txtdec$ebnf$1", /[*_~`]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "txtdec", "symbols": ["txtdec$ebnf$1"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]}
]
  , ParserStart: "MAIN"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
