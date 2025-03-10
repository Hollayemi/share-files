/* eslint-disable no-inner-declarations */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unsupported-features/es-syntax */
const fs = require('fs');
const path = require("path")


exports.videoDir =  path.join(__dirname, "public", "Tyler Perrys Sistas S1")
exports.videoDir = path.join("/home/stephanyemmitty")


exports.viewItems = async (req, res) => {
  try {
    const {params} = req;
    const dir = Object.values(params).join("/");
    console.log(this.videoDir, "Checking directory...");

    const fullDir = path.join(this.videoDir, dir);
    console.log(fullDir, "Full Directory");
    // Read directory asynchronously
    const files = await fs.promises.readdir(fullDir);

    // Process files and check if they are files or folders
    const results = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(fullDir, file);
        const stats = await fs.promises.stat(filePath);
        return stats.isFile()
          ? { name: file, type: "File" }
          : { name: file, type: "Folder" };
      })
    );

    // Separate files and folders
    const singles = results.filter((item) => item.type === "File");
    const folders = results.filter((item) => item.type === "Folder");

    // HTML response
    const productHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Product Page</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .product { width: 100px; margin: 10px auto; padding: 20px; border: 1px solid #ccc; display: flex; flex-direction: column; align-items: center; overflow: hidden; }    
        .product h1 { margin-top: 0; }
        .product p { margin: 5px 0; }
        .product .price { font-size: 13px; color: #b12704; margin-top: 30px; }
      </style>
    </head>
    <body>
    <div style="display: flex; flex-wrap: wrap;">
    ${folders
          .map(
            (x) => `
          <div class="product">
            <img src="/folder.png" width="80" />
            <a href='${req.originalUrl}/${x.name}' class="price">${x.name.replaceAll("_", " ").replaceAll("-", " ").replaceAll(".", " ")}</a>
          </div>
        `
          )
          .join("")}
        ${singles
          .map(
            (x) => `
          <div class="product">
            <img src="/file.png" width="80" />
            <a href='/download/${dir}/${x.name}' download class="price">${x.name.replaceAll("_", " ").replaceAll("-", " ").replaceAll(".", " ")}</a>
          </div>
        `
          )
          .join("")}
      </div>
    </body>
    </html>
  `;

    return res.send(productHtml);
  } catch (err) {
    return res.send(`<html>
      <body>
        <h2>Error:</h2>
        <p>${err.toString()}</p>
      </body>
      </html>`);
  }
};
