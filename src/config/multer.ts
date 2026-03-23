import multer from "multer";
import path from "path";
import fs from "fs";

const uploadBase =
  process.env.NODE_ENV === "production"
    ? "/home/srivagroupsin/public_html/uploads"
    : path.join(process.cwd(), "uploads");

/**
 * Reusable image upload system
 * Stores images in: uploads/{moduleName}/filename
 * 
 * Usage in routes:
 * router.post("/", uploadTo('brand').single('image'), controller.create);
 */
export const uploadTo = (moduleName: string) => {
  const uploadPath = path.join(uploadBase, moduleName);

  // ensure module folder exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const uploadInstance = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only images allowed") as any, false);
      }
      cb(null, true);
    },
  });

  return {
    single: (fieldName: string) => (req: any, res: any, next: any) => {
      uploadInstance.single(fieldName)(req, res, (err: any) => {
        if (err) return next(err);
        if (req.file) {
          req.file.filename = `${moduleName}/${req.file.filename}`;
        }
        next();
      });
    },
    array: (fieldName: string, maxCount?: number) => (req: any, res: any, next: any) => {
      uploadInstance.array(fieldName, maxCount)(req, res, (err: any) => {
        if (err) return next(err);
        if (req.files && Array.isArray(req.files)) {
          req.files.forEach((file: any) => {
            file.filename = `${moduleName}/${file.filename}`;
          });
        }
        next();
      });
    },
    fields: (fields: multer.Field[]) => (req: any, res: any, next: any) => {
      uploadInstance.fields(fields)(req, res, (err: any) => {
        if (err) return next(err);
        if (req.files && !Array.isArray(req.files)) {
          Object.values(req.files).forEach((fileArray: any) => {
            fileArray.forEach((file: any) => {
              file.filename = `${moduleName}/${file.filename}`;
            });
          });
        }
        next();
      });
    }
  };
};

// Default upload for general use (saved to root uploads/)
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(uploadBase)) {
        fs.mkdirSync(uploadBase, { recursive: true });
      }
      cb(null, uploadBase);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed") as any, false);
    }
    cb(null, true);
  },
});
