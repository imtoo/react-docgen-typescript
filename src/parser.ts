import * as path from 'path';
import * as ts from 'typescript';
import { dumpNode, navigate, getFlatChildren } from './nodeUtils';


const defaultOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.CommonJS
};

export interface ClassDoc {
    name: string;
    extends: string;
    propInterface: string;
    comment: string;
}

export interface InterfaceDoc {
    name: string;
    members: MemberDoc[];
    comment: string;
}

export interface MemberDoc {
    name: string;
    text: string;
    type: string;
    array?: boolean;
    values?: string[];
    isRequired: boolean;
    comment: string;
}

export interface DefaultProps {
    [key: string]: string;
}

export interface FileDoc {
    classes: ClassDoc[];
    interfaces: InterfaceDoc[];
    defaultProps: DefaultProps;
}
/** Generate documention for all classes in a set of .ts files */
export function getDocumentation(fileName: string, options: ts.CompilerOptions = defaultOptions): FileDoc {

    let program = ts.createProgram([fileName], options);
    let checker = program.getTypeChecker();

    const classes: ClassDoc[] = [];
    const interfaces: InterfaceDoc[] = [];
    const defaultProps: DefaultProps = {};

    const sourceFile = program.getSourceFile(fileName);
    ts.forEachChild(sourceFile, visit);

    /** visit nodes finding exported classes */
    function visit(node: ts.Node) {
        // Only consider exported nodes
        if (!isNodeExported(node)) {
            return;
        }


        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            const classNode = node as ts.ClassDeclaration;
            const symbol = checker.getSymbolAtLocation(classNode.name);

            const typeArguments = navigate(classNode,
                ts.SyntaxKind.HeritageClause,
                ts.SyntaxKind.ExpressionWithTypeArguments);

            const list = getFlatChildren(typeArguments)
                .filter(i => i.kind === ts.SyntaxKind.Identifier)
                .map((i: ts.Identifier) => i.text);

            getFlatChildren(node).map(x => {
                if (x.kind === ts.SyntaxKind.StaticKeyword) {
                    const defaultPropsNode = x.parent;
                    if (defaultPropsNode.name.text === 'defaultProps') {
                        const members = checker.getTypeAtLocation(defaultPropsNode).members;
                        Object.keys(members).map(name => {
                            defaultProps[name] = members[name].valueDeclaration.getText().split(':').slice(1).join(':').trim();
                        })
                    }
                }
            })

            classes.push({
                name: symbol.name,
                comment: ts.displayPartsToString(symbol.getDocumentationComment()),
                extends: list.length > 0 ? list[0] : null,
                propInterface: list.length > 1 ? list[1] : null,
            });
        }
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            const interfaceDeclaration = node as ts.InterfaceDeclaration;
             if (interfaceDeclaration.parent === sourceFile) {

                const symbol = checker.getSymbolAtLocation(interfaceDeclaration.name);
                const type = checker.getTypeAtLocation(interfaceDeclaration.name);

                const members = type.getProperties().map(i => {
                    const symbol = checker.getSymbolAtLocation(i.valueDeclaration.name);
                    const prop = i.valueDeclaration as ts.PropertySignature;
                    const typeInfo = getType(prop, i.getName());
                    const name = i.getName();

                    const typeAtLocation: any = prop.type ? checker.getTypeAtLocation(prop.type) : {};

                    return {
                        name: name,
                        default: null,
                        text: i.valueDeclaration.getText(),
                        array: typeAtLocation.target && typeAtLocation.symbol.name === 'Array',
                        type: typeInfo.type,
                        values: typeInfo.values,
                        isRequired: !prop.questionToken,
                        comment: ts.displayPartsToString(symbol.getDocumentationComment()).trim(),
                    };
                });

                const interfaceDoc: InterfaceDoc = {
                    name: symbol.getName(),
                    comment: ts.displayPartsToString(symbol.getDocumentationComment()).trim(),
                    members: members,
                };
                interfaces.push(interfaceDoc);
             }
         }
        else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        }
    }

    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node: ts.Node): boolean {
        return (node.flags & ts.NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }

    return {
        classes,
        interfaces,
        defaultProps
    }

    function getType(prop: ts.PropertySignature, name: string): { array?: boolean; type: string, values?: string[]}  {
        if (!prop.type) {
            return { type: 'null' };
        }
        const typeAtLocation: any = checker.getTypeAtLocation(prop.type);

        const array = (typeAtLocation.target && typeAtLocation.symbol.name === 'Array');

        // if(name === 'fields') {
        //     console.log(typeAtLocation.symbol)
        // }

        if (typeAtLocation) {
            const declaredType = typeAtLocation.intrinsicName;
            if (declaredType) return { type: declaredType };

            const multipleTypes = typeAtLocation.types;
            if (multipleTypes) {
                const firstType = multipleTypes.reduce((acc, n) => (acc || n.intrinsicName), null);
                if (firstType) {
                    return { array, type: firstType };
                }

                return { type: 'enum', values: multipleTypes.map(n => `${n.intrinsicName || n.text}`) };
            }
        }

        const unionType = prop.type as ts.UnionTypeNode;
        if (unionType && unionType.types) {
            return {
                type: 'enum',
                values: unionType.types.map(i => i.getText()),
            }
        }
        return {
            array,
            type: prop.type.getText(),
        }
    }
}
// /** Serialize a symbol into a json object */
//     function serializeSymbol(symbol: ts.Symbol): DocEntry {
//         return {
//             name: symbol.getName(),
//             documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
//             type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
//         };
//     }

//     /** Serialize a class symbol infomration */
//     function serializeClass(symbol: ts.Symbol) {
//         //console.log('flags: ', symbol.getFlags(), ' declarations:', symbol.getDeclarations());
//         let details = serializeSymbol(symbol);

//         // Get the construct signatures
//         let constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
//         details.constructors = constructorType.getConstructSignatures().map(serializeSignature);
//         return details;
//     }

//     /** Serialize a signature (call or construct) */
//     function serializeSignature(signature: ts.Signature) {
//         return {
//             parameters: signature.parameters.map(serializeSymbol),
//             returnType: checker.typeToString(signature.getReturnType()),
//             documentation: ts.displayPartsToString(signature.getDocumentationComment())
//         };
//     }
