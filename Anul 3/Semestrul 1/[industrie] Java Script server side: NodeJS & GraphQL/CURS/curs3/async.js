const fs = require("fs/promises");
const path = require("path");

async function doDirectoryReport(dirPath) {
  const files = await fs.readdir(dirPath);
  files.forEach(async (file) => {
    const filepath = path.join(__dirname, "data", file);
    const content = await fs.readFile(filepath);
    const { size } = await fs.stat(filepath);

    console.log("*** FILE INFO ***");
    console.log("File path:", filepath);
    console.log("File size:", size);
    console.log("File extension:", path.extname(filepath));
    console.log("File content:", content.toString());
  });

  console.log("ALL DONE in func");
}

// for...of + await: one file at a time, in order
async function doDirectoryReportSequential(dirPath) {
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    const filepath = path.join(dirPath, file);
    const content = await fs.readFile(filepath);
    const { size } = await fs.stat(filepath);

    console.log("*** FILE INFO ***");
    console.log("File path:", filepath);
    console.log("File size:", size);
    console.log("File extension:", path.extname(filepath));
    console.log("File content:", content.toString());
  }
}

// Promise.all + map: all files at the same time, wait for all, then print in order
async function doDirectoryReportParallel(dirPath) {
  const files = await fs.readdir(dirPath);
  const reports = await Promise.all(
    files.map(async (file) => {
      const filepath = path.join(dirPath, file);
      const content = await fs.readFile(filepath);
      const { size } = await fs.stat(filepath);
      return { filepath, size, content };
    }),
  );

  reports.forEach(({ filepath, size, content }) => {
    console.log("*** FILE INFO ***");
    console.log("File path:", filepath);
    console.log("File size:", size);
    console.log("File extension:", path.extname(filepath));
    console.log("File content:", content.toString());
  });
}

const dataPath = path.join(__dirname, "data");

// doDirectoryReport(dataPath).then(() => console.log("ALL DONE in Then"));
// doDirectoryReportSequential(dataPath).then(() => console.log("ALL DONE"));
doDirectoryReportParallel(dataPath).then(() => console.log("ALL DONE"));
