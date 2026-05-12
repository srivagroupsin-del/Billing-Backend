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
project.addSourceFilesAtPaths("src/modules/**/*.service.ts");
for (const sourceFile of project.getSourceFiles()) {
    let text = sourceFile.getFullText();
    const replacements = [];
    let needsAppError = false;
    const throwStatements = sourceFile.getDescendantsOfKind(ts_morph_1.SyntaxKind.ThrowStatement);
    for (const throwStmt of throwStatements) {
        const expr = throwStmt.getExpression();
        if (expr && ts_morph_1.Node.isNewExpression(expr)) {
            const className = expr.getExpression().getText();
            if (className === "Error") {
                const args = expr.getArguments();
                let message = '""';
                if (args.length > 0) {
                    message = args[0].getText();
                }
                replacements.push({
                    start: throwStmt.getStart(),
                    end: throwStmt.getEnd(),
                    text: `throw new BusinessError(${message})`
                });
                needsAppError = true;
            }
        }
    }
    if (needsAppError) {
        // Sort replacements descending by start position to not mess up indices
        replacements.sort((a, b) => b.start - a.start);
        for (const rep of replacements) {
            text = text.substring(0, rep.start) + rep.text + text.substring(rep.end);
        }
        let imports = "";
        const dir = sourceFile.getDirectoryPath();
        let relativePath = path.relative(dir, path.join(process.cwd(), "src/utils")).replace(/\\/g, "/");
        if (!relativePath.startsWith("."))
            relativePath = "./" + relativePath;
        imports += `import { BusinessError } from "${relativePath}/appError";\n`;
        text = imports + text;
        fs.writeFileSync(sourceFile.getFilePath(), text, "utf8");
    }
}
console.log("Service refactoring complete");
