const express = require('express');
const router = express.Router();
const { readYaml, writeYaml } = require('../lib/yamlHandler');
const { generateName, validateName, getTemplate } = require('../lib/nameGenerator');

// Assumes user and project are passed in the request body for simplicity
// In a real app, this would come from an authenticated session
const getUserProjectFile = (username, projectName) => `${username}_${projectName}_resources.yaml`;

// POST /api/resources - Add a new resource
router.post('/', (req, res) => {
  const { username, projectName, resourceType, attributes } = req.body;

  const template = getTemplate(resourceType);
  if (!template) {
    return res.status(400).json({ error: 'Invalid resource type' });
  }

  const generatedName = generateName(template.template, attributes);
  if (!validateName(generatedName)) {
    return res.status(400).json({ error: 'Generated name violates naming conventions.' });
  }

  const newResource = {
    resourceType,
    generatedName,
    attributes,
  };

  const filename = getUserProjectFile(username, projectName);
  const data = readYaml(filename) || { resources: [] };
  data.resources.push(newResource);
  writeYaml(filename, data);

  res.status(201).json(newResource);
});

// GET /api/resources - Get all resources
router.get('/:username/:projectName', (req, res) => {
  const { username, projectName } = req.params;
  const filename = getUserProjectFile(username, projectName);
  const data = readYaml(filename);
  res.json(data ? data.resources : []);
});

// POST /api/resources - Add a new resource
router.post('/', (req, res) => {
  const { username, projectName, resourceType, attributes } = req.body;

  const template = getTemplate(resourceType);
  if (!template) {
    return res.status(400).json({ error: 'Invalid resource type' });
  }

  // NEW VALIDATION STEP: Validate attributes against baseline options
  const attrValidation = validateAttributes(attributes);
  if (!attrValidation.isValid) {
    return res.status(400).json({ error: attrValidation.message });
  }

  const generatedName = generateName(template.template, attributes);
  if (!validateName(generatedName)) {
    return res.status(400).json({ error: 'Generated name violates naming conventions.' });
  }

  const newResource = {
    resourceType,
    generatedName,
    attributes,
  };

  const filename = getUserProjectFile(username, projectName);
  const data = readYaml(filename) || { resources: [] };
  data.resources.push(newResource);
  writeYaml(filename, data);

  res.status(201).json(newResource);
});

module.exports = router;