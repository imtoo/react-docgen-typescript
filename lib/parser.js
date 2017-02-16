"use strict";
var ts = require("typescript");
var nodeUtils_1 = require("./nodeUtils");
var defaultOptions = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.CommonJS
};
/** Generate documention for all classes in a set of .ts files */
function getDocumentation(fileName, options) {
    if (options === void 0) { options = defaultOptions; }
    var program = ts.createProgram([fileName], options);
    var checker = program.getTypeChecker();
    var classes = [];
    var interfaces = [];
    var defaultProps = {};
    var sourceFile = program.getSourceFile(fileName);
    ts.forEachChild(sourceFile, visit);
    /** visit nodes finding exported classes */
    function visit(node) {
        // Only consider exported nodes
        if (!isNodeExported(node)) {
            return;
        }
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            var classNode = node;
            var symbol = checker.getSymbolAtLocation(classNode.name);
            var typeArguments = nodeUtils_1.navigate(classNode, ts.SyntaxKind.HeritageClause, ts.SyntaxKind.ExpressionWithTypeArguments);
            var list = nodeUtils_1.getFlatChildren(typeArguments)
                .filter(function (i) { return i.kind === ts.SyntaxKind.Identifier; })
                .map(function (i) { return i.text; });
            nodeUtils_1.getFlatChildren(node).map(function (x) {
                if (x.kind === ts.SyntaxKind.StaticKeyword) {
                    var defaultPropsNode = x.parent;
                    if (defaultPropsNode.name.text === 'defaultProps') {
                        var members_1 = checker.getTypeAtLocation(defaultPropsNode).members;
                        Object.keys(members_1).map(function (name) {
                            defaultProps[name] = members_1[name].valueDeclaration.getText().split(':').slice(1).join(':').trim();
                        });
                    }
                }
            });
            classes.push({
                name: symbol.name,
                comment: ts.displayPartsToString(symbol.getDocumentationComment()),
                extends: list.length > 0 ? list[0] : null,
                propInterface: list.length > 1 ? list[1] : null,
            });
        }
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            var interfaceDeclaration = node;
            if (interfaceDeclaration.parent === sourceFile) {
                var symbol = checker.getSymbolAtLocation(interfaceDeclaration.name);
                var type = checker.getTypeAtLocation(interfaceDeclaration.name);
                var members = type.getProperties().map(function (i) {
                    var symbol = checker.getSymbolAtLocation(i.valueDeclaration.name);
                    var prop = i.valueDeclaration;
                    var typeInfo = getType(prop, i.getName());
                    var name = i.getName();
                    var typeAtLocation = prop.type ? checker.getTypeAtLocation(prop.type) : {};
                    return {
                        name: name,
                        default: null,
                        text: i.valueDeclaration.getText(),
                        array: typeAtLocation.target && typeAtLocation.symbol.name === 'Array',
                        type: typeInfo.type,
                        values: typeInfo.values,
                        isRequired: !prop.questionToken,
                        comment: ts.displayPartsToString(symbol.getDocumentationComment()).trim(),
                    };
                });
                var interfaceDoc = {
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
    function isNodeExported(node) {
        return (node.flags & ts.NodeFlags.Export) !== 0 || (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
    }
    return {
        classes: classes,
        interfaces: interfaces,
        defaultProps: defaultProps
    };
    function getType(prop, name) {
        if (!prop.type) {
            return { type: 'null' };
        }
        var typeAtLocation = checker.getTypeAtLocation(prop.type);
        var array = (typeAtLocation.target && typeAtLocation.symbol.name === 'Array');
        // if(name === 'fields') {
        //     console.log(typeAtLocation.symbol)
        // }
        if (typeAtLocation) {
            var declaredType = typeAtLocation.intrinsicName;
            if (declaredType)
                return { type: declaredType };
            var multipleTypes = typeAtLocation.types;
            if (multipleTypes) {
                var firstType = multipleTypes.reduce(function (acc, n) { return (acc || n.intrinsicName); }, null);
                if (firstType) {
                    return { array: array, type: firstType };
                }
                return { type: 'enum', values: multipleTypes.map(function (n) { return "" + (n.intrinsicName || n.text); }) };
            }
        }
        var unionType = prop.type;
        if (unionType && unionType.types) {
            return {
                type: 'enum',
                values: unionType.types.map(function (i) { return i.getText(); }),
            };
        }
        return {
            array: array,
            type: prop.type.getText(),
        };
    }
}
exports.getDocumentation = getDocumentation;
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
//# sourceMappingURL=parser.js.map