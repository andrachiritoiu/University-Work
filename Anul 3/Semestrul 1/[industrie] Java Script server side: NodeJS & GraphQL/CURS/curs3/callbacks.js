// const fs = require("fs");
// const path = require("path");

// const dirPath = path.join(__dirname, "data");

// const dirContent = fs.readdir(dirPath);

// console.log(dirContent);
// // => undefined

// ======================
//
//
//
//
//
//
//
//
//
//
//
//
//
// ======================

// const fs = require("fs");
// const path = require("path");

// const dirPath = path.join(__dirname, "data");

// fs.readdir(dirPath, (error, files) => {
//   console.log(files);
// });

// ======================
//
//
//
//
//
//
//
//
//
//
//
//
//
// ======================

// const fs = require("fs");
// const path = require("path");

// const dirPath = path.join(__dirname, "data");

// fs.readdir(dirPath, (error, files) => {
//   if (error) {
//     console.error("Error reading dir", error);
//     return;
//   }

//   files.forEach((filename) => {
//     const filePath = path.join(dirPath, filename);
//     fs.readFile(filePath, (error, data) => {
//       if (error) {
//         console.error("Error reading file:", error);
//         return;
//       }

//       console.log(data.toString());
//     });
//   });
// });

// ======================
//
//
//
//
//
//
//
//
//
//
//
//
//
// ======================

const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "data");

fs.readdir(dirPath, (error, files) => {
  if (error) {
    console.error("Error reading dir", error);
    return;
  }
  files.forEach((filename) => {
    const filePath = path.join(dirPath, filename);

    fs.readFile(filePath, (error, data) => {
      if (error) {
        console.error("Error reading file:", error);
        return;
      }

      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.error("Error getting file stats", error);
          return;
        }

        console.log("*** FILE INFO ***");
        console.log("File path:", filePath);
        console.log("File size:", stats.size);
        console.log("File extension:", path.extname(filePath));
        console.log("File content:", data.toString());
      });
    });
  });
});
