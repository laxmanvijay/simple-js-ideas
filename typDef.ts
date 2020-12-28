import { LexTypes, ParseTypes, Keywords, SVGTags } from "./enums";

export interface Lexed {
    type: LexTypes;
    value: string;
}

export interface Parsed{
    type?: ParseTypes;
    keyword?: Keywords | string;
    arguments?: Lexed[];
    operands?: Parsed[];
}

export interface SVGAttr {
    x1?: string;
    y1?: string;
    x2?: string;
    y2?: string;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    viewbox?: string;
    xmlns?: string;
    version?: string;
}

export interface SVGDef {
    tag: SVGTags;
    attr: SVGAttr;
    body?: SVGDef[]
}