const router = require('express').Router();
const path = require('path');
const { viewItems, videoDir } = require('../view');
const fs = require('fs');

router.route('/home/*').get(viewItems);

router.get('/download/*', (req, res) => {
  const file = req.params[0];
  const dir = Object.values(params).splice(0, 1).join("/");
  console.log(dir, "Dir");
  const filePath = path.join(videoDir, file);
  console.log(filePath)
  res.download(filePath, file, (err) => {
    if (err) {
      console.log('Error downloading the file:', err);
    }
  });
});

router.get('/video', (req, res) => {
    const videoPath = path.join('/home/stephanyemmitty/Videos');
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});


module.exports = router;
