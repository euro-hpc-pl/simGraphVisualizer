const fs = require('fs');
const path = require('path');

let load = mypath => {
  let pth = mypath;

  if (fs.existsSync(pth)) {
    let data = fs.readFileSync(pth,{encoding:'utf8', flag:'r'});

    if (data !== '') {
      return data;
    } else return null;
  } else {
    return null;
  }
};

let save = (mypath, data) => {
  let pth = mypath;

  fs.writeFileSync(pth, data);
  return true;
};

const dataFile = {
  save: save,
  load: load
};

module.exports = dataFile;
