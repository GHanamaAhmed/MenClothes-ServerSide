const fs = require("fs");
const ph = require("path");
const convertUrlToPath = (url) => {
  return url.replace(process.env.DOMAIN_NAME, ph.resolve(__dirname, "../../"));
};
const redUrl = [
  ph.resolve(__dirname, "../../"),
  ph.resolve(__dirname, "../../uploads"),
  ph.resolve(__dirname, "../../uploads/products"),
  ph.resolve(__dirname, "../../uploads/reels"),
  ph.resolve(__dirname, "../../uploads/users"),
];
const moveFileUrl = (currrentRoute, newRoute) => {
  if (redUrl.includes(convertUrlToPath(currrentRoute))) return;
  if (fs.existsSync(convertUrlToPath(currrentRoute))) {
    try {
      fs.renameSync(
        convertUrlToPath(currrentRoute),
        convertUrlToPath(newRoute)
      );
    } catch (error) {
      console.log(error);
    }
  }
};
const removeFileUrl = (route) => {
  if (redUrl.includes(convertUrlToPath(route))) return;
  if (fs.existsSync(convertUrlToPath(route))) {
    try {
      fs.unlinkSync(convertUrlToPath(route),{});
    } catch (error) {
      console.log(error);
    }
  }
};
const removeFolderUrl = (route) => {
  if (redUrl.includes(convertUrlToPath(route))) return;
  if (fs.existsSync(convertUrlToPath(route))) {
    try {
      fs.rmSync(convertUrlToPath(route), {
        recursive: true,
        force: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const moveFile = (currrentRoute, newRoute) => {
  if (redUrl.includes(currrentRoute)) return;
  if (fs.existsSync(currrentRoute)) {
    try {
      fs.renameSync(currrentRoute, newRoute);
    } catch (error) {
      console.log(error);
    }
  }
};
const removeFile = (route) => {
  if (redUrl.includes(route)) return;
  if (fs.existsSync(route)) {
    try {
      fs.unlinkSync(route);
    } catch (error) {
      console.log(error);
    }
  }
};
const removeFolder =  (route) => {
  if (redUrl.includes(route)) return;
  if (fs.existsSync(route)) {
    try {
       fs.rm(
        route,
        {
          recursive: true,
          force: true,
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
};
const deleteFolderRecursive = function (path) {
  if (redUrl.includes(path)) return;
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    console.log("ff");
    fs.rm(path, { recursive: true, force: true }, (err) => {
      console.log(err);
    });
    console.log("ds");
  }
};

const baseUrl = () => ph.resolve(__dirname, "../../");
module.exports = {
  removeFileUrl,
  removeFolderUrl,
  moveFileUrl,
  removeFile,
  removeFolder,
  moveFile,
  deleteFolderRecursive,
  baseUrl,
  convertUrlToPath,
};
