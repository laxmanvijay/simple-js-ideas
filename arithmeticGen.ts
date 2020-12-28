/**
 * A simple compiler that converts arithmetic ops
 * 
 * supported operations: add, sub, mul, div
 * 
 * Example:
 * 
 * mul 1 2
 * 
 * is converted to
 * 
 * ( 1 * 2 )
 * 
 * Note: This is a naive implementation and assumes that the operations are sequential
 * Eg: mul 1 add 1 2 sub 3 div 5 6 
 */

import { Keywords, LexTypes, ParseTypes } from "./enums";
import { Lexed, Parsed } from "./typDef";

export const arithmeticLexer = (code: string): Lexed[] => {
    return code.split(/\s+/)
        .filter((x: string) => x.length > 0)
        .map((x: string) => {
            return isNaN(parseInt(x))
                ? {
                    type: LexTypes.op,
                    value: x
                }
                : {
                    type: LexTypes.number,
                    value: x
                }
        })
}

export const arithmeticParser = (ast: Parsed, tokens: Lexed[]): Parsed => {
    while (tokens.length > 0) {
        let curr_token: Lexed = tokens.shift();
        if (curr_token.type == LexTypes.op) {
            if (Keywords[curr_token.value] !== undefined) {
                if (ast.type === undefined) {
                    ast = {
                        type: ParseTypes.CallExpression,
                        keyword: Keywords[curr_token.value],
                        operands: []
                    }
                } else {
                    ast.operands.push({
                        type: ParseTypes.CallExpression,
                        keyword: Keywords[curr_token.value],
                        operands: []
                    })
                    arithmeticParser(ast.operands[ast.operands.length - 1], tokens);
                }
            } else {
                throw `Unknown keyword: ${curr_token.value}`
            }
        } else {
            if (ast.type === undefined) {
                ast = {
                    type: ParseTypes.NumExpression,
                    keyword: curr_token.value,
                    operands: []
                }
            } else {
                ast.operands.push({
                    type: ParseTypes.NumExpression,
                    keyword: curr_token.value,
                    operands: []
                })
            }
            arithmeticParser(ast, tokens);
        }
    }
    return ast;
}

const getOp = (ast: Parsed): string => {
    switch (ast.keyword) {
        case Keywords.add:
            return '+'
        case Keywords.sub:
            return '-'
        case Keywords.mul:
            return '*'
        case Keywords.div:
            return '/'
    }
}

export const arithmeticGenerate = (ast: Parsed) => {
    if (ast.type == ParseTypes.CallExpression) {
        let gen: string = '';
        let len = 0;
        gen = `( ${ast.operands.map((x:Parsed) => {
            len += 1;
            return len !== ast.operands.length
                ? arithmeticGenerate(x) + ' ' + getOp(ast)
                : arithmeticGenerate(x);
        }).join(" ")} )`;
        return gen;
    } else {
        return ast.keyword;
    }
}