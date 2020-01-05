const express = require('express');
const fileUpload = require('express-fileupload');
const download = require('image-downloader')
const app = express();
const cors = require('cors');


app.use(cors());
app.options('*', cors());
app.use(fileUpload());
app.use(express.json());

// Upload Endpoint for local file
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  file.name = Date.now()+ '_' +file.name
  const imagePath = `${__dirname}/client/public/uploads/${file.name}`
  file.mv(imagePath, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    
   res.json({ fileName: file.name, filePath: `/uploads/${file.name}` })
    
    
  });
});

// upload endpoint for an url link

app.post('/',(req, res) => {

  const url = req.body.url;
  paramArr = url.split('/')
  const fileName = paramArr[paramArr.length-1]
  
  const options = {
    url: url,
    dest: `${__dirname}/client/public/uploads/${Date.now()+fileName}`
  }
   
  async function downloadIMG() {
    try {
      const { filename, image } = await download.image(options)
      console.log('download')
      return filename
      
    } catch (e) {
      console.error(e)
    }
  }


 downloadIMG()
 .then(r => res.json({fileName: r}))
  
})

app.listen(8080, () => console.log('Server Started...'));