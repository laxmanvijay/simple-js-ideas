/**
 * This is a simple compiler that converts commands to svg
 * 
 * Available commands: 
 * 
 * Paper - takes a single argument (color)
 * Pen - takes a single argument (color)
 * Line - takes 4 arguments (x1,y1,x2,y2)
 * 
 * Example:
 * 
 * Paper 100
 * Pen 50
 * Line 20 30 30 30
 * 
 * is converted to 
 * 
 * <svg width="100" height="100" viewbox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
 *  <rect x="0" y="0" width="100" height="100" fill="rgb(0%,0%,0%)"></rect>
 *  <line x="20" y="30" x2="30" y2="30" stroke="rgb(50%,50%,50%)"></line>
 * </svg>
 */


import { LexTypes, Keywords, ParseTypes, SVGTags } from "./enums";
import { Lexed, Parsed, SVGAttr, SVGDef } from "./typDef"


export const lexer = (code: string): Lexed[] => {
    return code.split(/\s+/)
        .filter((x: string) => x.length > 0)
        .map((x: string) => {
            return isNaN(parseInt(x))
                ? {
                    type: LexTypes.word,
                    value: x
                } : {
                    type: LexTypes.number,
                    value: x
                }
        });
}

export const parser = (tokens: Lexed[]): Parsed[] => {
    let items: Parsed[] = [];

    while (tokens.length > 0) {
        let curr_token: Lexed = tokens.shift();
        if (curr_token.type == LexTypes.word) {
            if (Keywords[curr_token.value] !== undefined) {
                let tokenToPass: Lexed[] = [];
                if (curr_token.value == Keywords.Line) {
                    for (let i = 0; i < 4; i++) {
                        tokenToPass.push(tokens.shift());
                    }
                } else {
                    tokenToPass.push(tokens.shift());
                }
                items.push(argParse(tokenToPass, Keywords[curr_token.value]));
            }
            else
                throw "Unsupported Keyword: " + curr_token.value;
        }
    }
    return items;
}

export const transform = (ast: Parsed[]): SVGDef => {
    let svgdef: SVGDef = {
        tag: SVGTags.svg,
        attr: {
            width: 100,
            height: 100,
            viewbox: '0 0 100 100',
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.1'
        },
        body: []
    };
    let penColor = 100;
    while (ast.length > 0) {
        let node: Parsed = ast.shift();
        switch (node.keyword) {
            case Keywords.Paper:
                let paper_color = 100 - parseInt(node.arguments[0].value)
                svgdef.body.push({
                tag : SVGTags.rect,
                attr : {
                    x1: '0',
                    y1: '0',
                    width: 100,
                    height:100,
                    fill: 'rgb(' + paper_color + '%,' + paper_color + '%,' + paper_color + '%)'
                }
                });
                break;
            case Keywords.Pen:
                penColor = 100 - parseInt(node.arguments[0].value);
                break;
            case Keywords.Line:
                svgdef.body.push({
                    tag: SVGTags.line,
                    attr: {
                      x1: node.arguments[0].value,
                      y1: node.arguments[1].value,
                      x2: node.arguments[2].value,
                      y2: node.arguments[3].value,
                      stroke: 'rgb(' + penColor + '%,' + penColor + '%,' + penColor + '%)'
                    }
                  });
                break;
        }
    }
    return svgdef;
}

export const generate = (svgdef: SVGDef) => {
    let attrStr: string = buildStringFromAttrs(svgdef.attr);

    let elements = svgdef.body.map((x: SVGDef) => {
        return '<' + x.tag + ' ' + buildStringFromAttrs(x.attr) + '></' + x.tag + '>'
      }).join('\n\t');
    
    return '<svg '+ attrStr +'>\n' + elements + '\n</svg>'
}

const argParse = (tokens: Lexed[], keyword: Keywords): Parsed => {
    let expr: Parsed = {
        type: ParseTypes.CallExpression,
        keyword: keyword,
        arguments: []
    };
    tokens.forEach((x: Lexed) => {
        if (x.type == LexTypes.number) {
            expr.arguments.push(x)
        } else {
            throw `Argument of ${keyword} should be a number, recieved: ${x.value}`
        }
    })
    return expr;
}

const buildStringFromAttrs = (attr: SVGAttr): string => {
    return Object.keys(attr).map((x: string) => {
        return x + '="' + attr[x] + '"';
    })
    .join(" ");
}