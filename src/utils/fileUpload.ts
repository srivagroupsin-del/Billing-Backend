import fs from "fs";
import path from "path";

const uploadBase =
    process.env.NODE_ENV === "production"
        ? "/home/srivagroupsin/public_html/uploads"
        : path.join(process.cwd(), "uploads");

/**
 * Sanitizes a string to be used as a folder name
 */
export const sanitizeFolderName = (name: string): string => {
    return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
};

/**
 * Moves a file from products folder to a specific hierarchy
 * @param currentPath relative path in uploads/ (e.g. 'products/filename.jpg')
 * @param hierarchy array of folder names (e.g. ['Electronics', 'Apple'])
 * @returns new relative path (e.g. 'Electronics/Apple/filename.jpg')
 */
export const moveProductImage = async (
    currentPath: string,
    hierarchy: string[]
): Promise<string> => {
    if (!currentPath) return "";

    const filename = path.basename(currentPath);
    const sanitizedHierarchy = hierarchy.map(sanitizeFolderName);

    // Construct absolute target dir
    const targetDir = path.join(uploadBase, ...sanitizedHierarchy);

    // ensure target folder exists
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const sourceAbsPath = path.join(uploadBase, currentPath);
    const targetAbsPath = path.join(targetDir, filename);

    // If source exists, move it
    if (fs.existsSync(sourceAbsPath)) {
        fs.renameSync(sourceAbsPath, targetAbsPath);
    }

    // Return new relative path for DB
    return [...sanitizedHierarchy, filename].join("/");
};
