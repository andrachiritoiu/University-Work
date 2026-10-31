// const fs = require("fs");
// const path = require("path");

// const dirPath = path.join(__dirname, "data");

// const dirContent = new Promise((resolve, reject) => {
//   fs.readdir(dirPath, (error, files) => {
//     if (error) {
//       reject(error);
//     } else {
//       resolve(files);
//     }
//   });
// });

// dirContent.then((data) => {
//   console.log("data", data);
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
// ======================

// const fs = require("fs");
// const path = require("path");

// const dirPath = path.join(__dirname, "data");

// const getDirContent = (dirPath) => {
//   return new Promise((resolve, reject) => {
//     fs.readdir(dirPath, (error, files) => {
//       if (error) {
//         reject(error);
//       } else {
//         const filesWithAbsolutePath = files.map((filename) =>
//           path.join(dirPath, filename),
//         );
//         resolve(filesWithAbsolutePath);
//       }
//     });
//   });
// };

// const getFileContent = (filePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, (error, data) => {
//       if (error) {
//         // reject(error);
//         resolve("data 1");
//       } else {
//         resolve("data 2");
//       }
//     });
//   });
// };

// // getDirContent(path.join(__dirname, "data")).then((files) => {
// //   console.log(files);
// //   files.forEach((file) => {
// //     getFileContent(file).then((fileContent) =>
// //       console.log(fileContent.toString()),
// //     );
// //   });
// // });

// const res = getFileContent("asdas").then((data) => console.log(data)).catch((err) => console.error(err));
// console.log(res);

/*
[Error: ENOENT: no such file or directory, open '1.txt'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '1.txt'
}
*/

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
// ======================

// const fs = require("fs");
// const path = require("path");

// const getDirContent = (dirPath) => {
//   return new Promise((resolve, reject) => {
//     fs.readdir(dirPath, (error, files) => {
//       if (error) {
//         reject(error);
//       } else {
//         const filesWithAbsolutePath = files.map((filename) =>
//           path.join(dirPath, filename),
//         );
//         resolve(filesWithAbsolutePath); // [1.txt, 2.txt...]
//       }
//     });
//   });
// };

// const getFileContent = (filePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, (error, data) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// };

// const getFileStats = (filePath) => {
//   return new Promise((resolve, reject) => {
//     fs.stat(filePath, (error, stats) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(stats);
//       }
//     });
//   });
// };

// getDirContent(path.join(__dirname, "data")).then((files) => {
//   files.forEach((filePath) => {
//     getFileContent(filePath).then((fileContent) => {
//       getFileStats(filePath).then((fileStats) => {
//         console.log("*** FILE INFO ***");
//         console.log("File path:", filePath);
//         console.log("File size:", fileStats.size);
//         console.log("File extension:", path.extname(filePath));
//         console.log("File content:", fileContent.toString());
//       });
//     });
//   });
// });

// getDirContent(path.join(__dirname, "data"))
//   .then((files) => {
//     return Promise.all([
//       getFileContent(files[0]),
//       getFileContent(files[1]),
//       getFileContent(files[2]),
//     ]);
//   })
//   .then((filesContent) => {
//     filesContent.forEach((fileContent) => console.log(fileContent.toString()));
//   });

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
// ======================

const fs = require("fs");
const path = require("path");

const getDirContent = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (error, files) => {
      if (error) {
        reject(error);
      } else {
        const filesWithAbsolutePath = files.map((filename) => {
          return {
            filePath: path.join(dirPath, filename),
          };
        });
        resolve(filesWithAbsolutePath);
      }
    });
  });
};

const getFileContent = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file.filePath, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          ...file,
          content: data.toString(),
        });
      }
    });
  });
};

const getFileStats = (file) => {
  return new Promise((resolve, reject) => {
    fs.stat(file.filePath, (error, stats) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          ...file,
          stats: stats,
        });
      }
    });
  });
};

// getDirContent(path.join(__dirname, "data"))
//   .then((files) => {
//     const filesContentPromises = files.map((file) => getFileContent(file));
//     console.log("filesContentPromises", filesContentPromises);
//     return Promise.all(filesContentPromises);
//   })
//   .then((files) => {
//     const filesStatsPromises = files.map((file) => getFileStats(file));
//     console.log("filesStatsPromises", filesStatsPromises);
//     return Promise.all(filesStatsPromises);
//   })
//   .then((filesStatsPromisesResponses) => {
//     filesStatsPromisesResponses.forEach((file) => {
//       console.log("*** FILE INFO ***");
//       console.log("File path:", file.filePath);
//       console.log("File size:", file.stats.size);
//       console.log("File extension:", path.extname(file.filePath));
//       console.log("File content:", file.content);
//     });
//   });

getDirContent(path.join(__dirname, "data"))
  .then((files) => Promise.all(files.map((file) => getFileContent(file))))
  .then((files) => Promise.all(files.map((file) => getFileStats(file))))
  .then((files) => {
    files.forEach((file) => {
      console.log("*** FILE INFO ***");
      console.log("File path:", file.filePath);
      console.log("File size:", file.stats.size);
      console.log("File extension:", path.extname(file.filePath));
      console.log("File content:", file.content);
    });
  });
