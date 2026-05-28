import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Grab category sent from React form data (lowercase it to match enums)
    const category = req.body.category ? req.body.category.toLowerCase().trim() : 'general';
    
    // Map the singular category field to plural folder structures context
    let folderName = 'general';
    if (category === 'hospital') folderName = 'hospitals';
    if (category === 'restaurant') folderName = 'restaurants';
    if (category === 'park') folderName = 'parks';

    // Resolve the target folder path cleanly relative to this middleware script position
    // Matches: backend/uploads/hospitals, backend/uploads/restaurants, etc.
    const targetPath = path.join(__dirname, '../uploads', folderName);

    // Fail-safe: Automatically build the physical directory folder if it doesn't exist yet
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    cb(null, targetPath);
  },
  filename: (req, file, cb) => {
    // Generates a clean timestamped asset name string (e.g., service-171649231.jpg)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({ storage });