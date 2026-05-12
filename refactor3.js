"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const project = new ts_morph_1.Project({
    tsConfigFilePath: "tsconfig.json"
});
project.addSourceFilesAtPaths("src/modules/**/*.controller.ts");
for (const sourceFile of project.getSourceFiles()) {
    let text = sourceFile.getFullText();
    const replacements = [];
    let needsCatchAsync = false;
    let needsSuccessResponse = false;
    let needsErrorCodes = false;
    sourceFile.getVariableDeclarations().forEach(varDecl => {
        const initializer = varDecl.getInitializer();
        if (initializer && ts_morph_1.Node.isArrowFunction(initializer)) {
            const params = initializer.getParameters();
            if (params.length >= 2 && (params[0].getName() === "req" || params[0].getType().getText().includes('Request')) && (params[1].getName() === "res" || params[1].getType().getText().includes('Response'))) {
                replacements.push({
                    start: initializer.getStart(),
                    end: initializer.getStart(),
                    text: "catchAsync("
                });
                replacements.push({
                    start: initializer.getEnd(),
                    end: initializer.getEnd(),
                    text: ")"
                });
                needsCatchAsync = true;
            }
        }
    });
    const calls = sourceFile.getDescendantsOfKind(ts_morph_1.SyntaxKind.CallExpression);
    for (const node of calls) {
        const expr = node.getExpression();
        if (ts_morph_1.Node.isPropertyAccessExpression(expr)) {
            const propName = expr.getName();
            const obj = expr.getExpression();
            let isResJson = false;
            let statusCode = "";
            let targetNodeToReplace = node;
            if (propName === "json" || propName === "send") {
                if (obj.getText() === "res") {
                    isResJson = true;
                }
                else if (ts_morph_1.Node.isCallExpression(obj)) {
                    const innerExpr = obj.getExpression();
                    if (ts_morph_1.Node.isPropertyAccessExpression(innerExpr) && innerExpr.getName() === "status" && innerExpr.getExpression().getText() === "res") {
                        isResJson = true;
                        statusCode = obj.getArguments()[0]?.getText() || "";
                    }
                }
            }
            if (isResJson) {
                const args = node.getArguments();
                if (args.length === 1 && ts_morph_1.Node.isObjectLiteralExpression(args[0])) {
                    const objLiteral = args[0];
                    const props = objLiteral.getProperties();
                    const successProp = props.find(p => p.getText().includes('success:'));
                    const isSuccessFalse = successProp && successProp.getText().includes('false');
                    if (isSuccessFalse) {
                        const messageProp = props.find(p => p.getText().startsWith('message:')) || props.find(p => p.getText().startsWith('"message":')) || props.find(p => p.getText().startsWith("'message':"));
                        let msg = '"Operation failed"';
                        if (messageProp && ts_morph_1.Node.isPropertyAssignment(messageProp)) {
                            msg = messageProp.getInitializer()?.getText() || msg;
                        }
                        replacements.push({
                            start: targetNodeToReplace.getStart(),
                            end: targetNodeToReplace.getEnd(),
                            text: `throw new BusinessError(${msg}, ErrorCodes.BUSINESS_RULE_VIOLATION)`
                        });
                        needsErrorCodes = true;
                    }
                    else {
                        const dataProp = props.find(p => p.getText().startsWith('data:') || p.getText() === 'data');
                        const msgProp = props.find(p => p.getText().startsWith('message:') || p.getText() === 'message');
                        const metaProp = props.find(p => p.getText().startsWith('meta:') || p.getText() === 'meta');
                        let successArgs = `{ res`;
                        if (dataProp) {
                            if (ts_morph_1.Node.isPropertyAssignment(dataProp)) {
                                successArgs += `, data: ${dataProp.getInitializer()?.getText()}`;
                            }
                            else if (ts_morph_1.Node.isShorthandPropertyAssignment(dataProp)) {
                                successArgs += `, data: ${dataProp.getName()}`;
                            }
                        }
                        if (msgProp) {
                            if (ts_morph_1.Node.isPropertyAssignment(msgProp)) {
                                successArgs += `, message: ${msgProp.getInitializer()?.getText()}`;
                            }
                            else if (ts_morph_1.Node.isShorthandPropertyAssignment(msgProp)) {
                                successArgs += `, message: ${msgProp.getName()}`;
                            }
                        }
                        if (metaProp) {
                            if (ts_morph_1.Node.isPropertyAssignment(metaProp)) {
                                successArgs += `, meta: ${metaProp.getInitializer()?.getText()}`;
                            }
                            else if (ts_morph_1.Node.isShorthandPropertyAssignment(metaProp)) {
                                successArgs += `, meta: ${metaProp.getName()}`;
                            }
                        }
                        if (statusCode) {
                            successArgs += `, statusCode: ${statusCode}`;
                        }
                        successArgs += ` }`;
                        replacements.push({
                            start: targetNodeToReplace.getStart(),
                            end: targetNodeToReplace.getEnd(),
                            text: `successResponse(${successArgs})`
                        });
                        needsSuccessResponse = true;
                    }
                }
            }
        }
    }
    // Sort replacements descending by start position to not mess up indices
    replacements.sort((a, b) => b.start - a.start);
    for (const rep of replacements) {
        text = text.substring(0, rep.start) + rep.text + text.substring(rep.end);
    }
    if (needsCatchAsync || needsSuccessResponse || needsErrorCodes) {
        let imports = "";
        const dir = sourceFile.getDirectoryPath();
        let relativePath = path.relative(dir, path.join(process.cwd(), "src/utils")).replace(/\\/g, "/");
        if (!relativePath.startsWith("."))
            relativePath = "./" + relativePath;
        if (needsCatchAsync)
            imports += `import { catchAsync } from "${relativePath}/catchAsync";\n`;
        if (needsSuccessResponse)
            imports += `import { successResponse } from "${relativePath}/response";\n`;
        if (needsErrorCodes) {
            imports += `import { BusinessError } from "${relativePath}/appError";\n`;
            imports += `import { ErrorCodes } from "${relativePath}/errorCodes";\n`;
        }
        text = imports + text;
    }
    fs.writeFileSync(sourceFile.getFilePath(), text, "utf8");
}
console.log("Refactoring complete");
