const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DATA_DIR = path.join(__dirname, '../../data');

// Read a YAML file
function readYaml(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
  } catch (e) {
    console.error(`Error reading YAML file ${filename}:`, e);
    return null;
  }
}

// Write to a YAML file
function writeYaml(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const yamlString = yaml.dump(data);
    fs.writeFileSync(filePath, yamlString, 'utf8');
    return true;
  } catch (e) {
    console.error(`Error writing YAML file ${filename}:`, e);
    return false;
  }
}

module.exports = {
  readYaml,
  writeYaml,
};