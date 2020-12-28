import { arithmeticGenerate, arithmeticLexer, arithmeticParser } from "./arithmeticGen";
import { generate, lexer, parser, transform } from "./svgGen";
import { Lexed, Parsed } from "./typDef";

const init = () => {
    let input: string = "Paper 100 Pen 50 Line 20 30 30 30";
    let tokens: Lexed[] = lexer(input);
    console.log(tokens);
    let ast = parser(tokens);
    console.log(ast);
    let svgdef = transform(ast);
    console.log(svgdef);
    let svg = generate(svgdef);
    console.log(svg);

    let arith: string = "mul 1 add 1 2 sub 3 div 5 6"

    let arithLex: Lexed[] = arithmeticLexer(arith);
    console.log(arithLex);
    let par: Parsed = {
        operands: []
    }
    let parseArith: Parsed = arithmeticParser(par, arithLex);
    console.log(parseArith);

    let gen = arithmeticGenerate(parseArith);
    console.log(gen);
    

}

init()