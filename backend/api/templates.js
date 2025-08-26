const express = require('express');
const router = express.Router();
const { readYaml, writeYaml } = require('../lib/yamlHandler');

const TEMPLATE_FILE = 'resource-templates.yaml';

// GET /api/templates
// Retrieve all naming templates
router.get('/', (req, res) => {
  const templates = readYaml(TEMPLATE_FILE);
  if (templates) {
    res.json(templates);
  } else {
    res.status(500).json({ error: 'Failed to read templates file.' });
  }
});

// PUT /api/templates - Update the entire templates file
// This is a simpler approach for a small app. A more robust solution might handle specific template updates.
router.put('/', (req, res) => {
  const newTemplates = req.body;
  if (writeYaml(TEMPLATE_FILE, newTemplates)) {
    res.json({ message: 'Templates updated successfully.' });
  } else {
    res.status(500).json({ error: 'Failed to write templates file.' });
  }
});

// POST /api/templates - Add or update a specific template
// This is an alternative to the PUT route above, allowing for more granular updates.
router.post('/', (req, res) => {
  const { service, type, template, attributes } = req.body;
  if (!service || !type || !template || !attributes) {
    return res.status(400).json({ error: 'Missing required fields (service, type, template, attributes).' });
  }

  const allTemplates = readYaml(TEMPLATE_FILE) || {};
  if (!allTemplates[service]) {
    allTemplates[service] = {};
  }
  allTemplates[service][type] = { template, attributes };

  if (writeYaml(TEMPLATE_FILE, allTemplates)) {
    res.status(201).json({ message: 'Template added/updated successfully.' });
  } else {
    res.status(500).json({ error: 'Failed to update templates file.' });
  }
});

module.exports = router;