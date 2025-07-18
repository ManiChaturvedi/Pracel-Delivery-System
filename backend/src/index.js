const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { parseXmlBuffer } = require('./xmlParser');
const { routeParcel } = require('./parcelRouter');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/xml' || 
        file.mimetype === 'text/xml' || 
        file.originalname.toLowerCase().endsWith('.xml')) {
      cb(null, true);
    } else {
      cb(new Error('Only XML files are allowed'), false);
    }
  }
});


app.post('/upload', upload.single('xmlFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please upload an XML file' 
      });
    }

  
    const data = await parseXmlBuffer(req.file.buffer);  

    if (!data.Container || !data.Container.parcels || !data.Container.parcels.Parcel) {
      return res.status(400).json({ 
        error: 'Invalid XML structure',
        message: 'XML must contain Container > parcels > Parcel structure' 
      });
    }

    const parcels = Array.isArray(data.Container.parcels.Parcel) 
      ? data.Container.parcels.Parcel 
      : [data.Container.parcels.Parcel];

    const results = parcels.map((parcel, index) => {
      try {
        const weight = parseFloat(parcel.Weight);
        const value = parseFloat(parcel.Value);
        
        if (isNaN(weight) || isNaN(value)) {
          throw new Error(`Invalid weight or value for parcel ${index + 1}`);
        }

        const departments = routeParcel({ weight, value });
        return {
          id: index + 1,
          recipient: parcel.Receipient?.Name || `Parcel ${index + 1}`,
          weight: weight,
          value: value,
          departments: departments,
          delivery: departments.length > 1 ? "1-2 days" : "3-5 days"
        };
      } catch (error) {
        return {
          id: index + 1,
          error: error.message
        };
      }
    });

    res.json({
      success: true,
      message: 'XML file processed successfully',
      filename: req.file.originalname,
      results: results
    });

  } catch (error) {
    console.error('Error processing XML:', error);
    res.status(500).json({ 
      error: 'Failed to process XML file',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});