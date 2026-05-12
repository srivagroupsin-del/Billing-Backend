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
const project = new ts_morph_1.Project({
    tsConfigFilePath: "tsconfig.json"
});
project.addSourceFilesAtPaths("src/modules/**/*.controller.ts");
const sourceFiles = project.getSourceFiles();
for (const sourceFile of sourceFiles) {
    let needsCatchAsync = false;
    let needsSuccessResponse = false;
    let needsErrorCodes = false;
    const varDecls = sourceFile.getVariableDeclarations();
    for (const varDecl of varDecls) {
        const initializer = varDecl.getInitializer();
        if (initializer && ts_morph_1.Node.isArrowFunction(initializer)) {
            const params = initializer.getParameters();
            if (params.length >= 2 && (params[0].getName() === "req" || params[0].getType().getText().includes('Request')) && (params[1].getName() === "res" || params[1].getType().getText().includes('Response'))) {
                // Remove try-catch if it exists
                const block = initializer.getBody();
                if (ts_morph_1.Node.isBlock(block)) {
                    const statements = block.getStatements();
                    if (statements.length === 1 && ts_morph_1.Node.isTryStatement(statements[0])) {
                        const tryBlock = statements[0].getTryBlock();
                        // We replace the try statement with the contents of the try block
                        const tryStatements = tryBlock.getStatements().map(s => s.getText()).join("\n");
                        statements[0].replaceWithText(tryStatements);
                    }
                }
                // Wrap in catchAsync
                const originalText = initializer.getText();
                if (!originalText.startsWith("catchAsync(")) {
                    initializer.replaceWithText(`catchAsync(${originalText})`);
                    needsCatchAsync = true;
                }
            }
        }
    }
    // Process res.status().json() and res.json()
    sourceFile.forEachDescendant(node => {
        if (ts_morph_1.Node.isCallExpression(node)) {
            const expr = node.getExpression();
            if (ts_morph_1.Node.isPropertyAccessExpression(expr)) {
                const propName = expr.getName();
                const obj = expr.getExpression();
                // check if it's res.json(...) or res.status(..).json(...)
                let isResJson = false;
                let statusCode = "";
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
                            // Turn into throw new AppError
                            const messageProp = props.find(p => p.getText().startsWith('message:')) || props.find(p => p.getText().startsWith('"message":')) || props.find(p => p.getText().startsWith("'message':"));
                            let msg = '"Operation failed"';
                            if (messageProp && ts_morph_1.Node.isPropertyAssignment(messageProp)) {
                                msg = messageProp.getInitializer()?.getText() || msg;
                            }
                            node.replaceWithText(`throw new BusinessError(${msg}, ErrorCodes.BUSINESS_RULE_VIOLATION)`);
                            needsErrorCodes = true;
                        }
                        else {
                            // Turn into successResponse
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
                            node.replaceWithText(`successResponse(${successArgs})`);
                            needsSuccessResponse = true;
                        }
                    }
                }
            }
        }
    });
    if (needsCatchAsync || needsSuccessResponse || needsErrorCodes) {
        const dir = sourceFile.getDirectoryPath();
        let relativePath = path.relative(dir, path.join(process.cwd(), "src/utils")).replace(/\\/g, "/");
        if (!relativePath.startsWith("."))
            relativePath = "./" + relativePath;
        if (needsCatchAsync && !sourceFile.getImportDeclaration(i => i.getModuleSpecifierValue() === `${relativePath}/catchAsync`)) {
            sourceFile.addImportDeclaration({ moduleSpecifier: `${relativePath}/catchAsync`, namedImports: ["catchAsync"] });
        }
        if (needsSuccessResponse && !sourceFile.getImportDeclaration(i => i.getModuleSpecifierValue() === `${relativePath}/response`)) {
            sourceFile.addImportDeclaration({ moduleSpecifier: `${relativePath}/response`, namedImports: ["successResponse"] });
        }
        if (needsErrorCodes && !sourceFile.getImportDeclaration(i => i.getModuleSpecifierValue() === `${relativePath}/appError`)) {
            sourceFile.addImportDeclaration({ moduleSpecifier: `${relativePath}/appError`, namedImports: ["BusinessError"] });
            sourceFile.addImportDeclaration({ moduleSpecifier: `${relativePath}/errorCodes`, namedImports: ["ErrorCodes"] });
        }
    }
}
project.saveSync();
console.log("Refactoring complete");
