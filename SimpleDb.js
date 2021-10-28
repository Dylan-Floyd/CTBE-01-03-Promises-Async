const { writeFile, readFile, readdir, rm } = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');

class SimpleDb {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  save(obj) {
    obj.id = nanoid();
    return this.writeToId(obj.id, obj);
  }

  get(id) {
    return this.readJsonFile(`${id}.json`);
  }

  readJsonFile(fileName) {
    const filePath = path.join(this.rootDir, fileName);
    return new Promise((resolve, reject) => {
      readFile(filePath, 'utf8')
        .then(file => resolve(JSON.parse(file)))
        .catch(e => {
          if (e.code === 'ENOENT') resolve(null);
          else reject(e);
        });
    });
  }

  getAll() {
    return readdir(this.rootDir)
      .then(files => Promise.all(files.map(file => this.readJsonFile(file))));
  }

  remove(id) {
    const filePath = path.join(this.rootDir, `${id}.json`);
    return rm(filePath, { force: true });
  }

  writeToId(id, obj) {
    const objPath = path.join(this.rootDir, `${id}.json`);
    return writeFile(objPath, JSON.stringify(obj));
  }

  update(id, newObj) {
    newObj.id = id;
    return this.writeToId(id, newObj);
  }
}

module.exports = SimpleDb;
