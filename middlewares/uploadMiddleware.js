import multer from "multer";
import path from "path";

// Dosyaların kaydedileceği dizini belirle
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "uploads/images/");
    } else if (file.fieldname === "file") {
      cb(null, "uploads/files/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Hangi dosya türlerinin kabul edileceğini belirle
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image" && !file.mimetype.startsWith("image")) {
    cb(new Error("Only image files are allowed!"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
