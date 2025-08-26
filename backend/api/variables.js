const express = require('express');
const router = express.Router();
const { readYaml, writeYaml } = require('../lib/yamlHandler');

const OPTIONS_FILE = 'baseline-options.yaml';
const VARIABLES_FILE = 'baseline-variables.yaml';

// GET /api/variables/options
// Retrieve all baseline options (e.g., allowed environments, departments)
router.get('/options', (req, res) => {
  const options = readYaml(OPTIONS_FILE);
  if (options) {
    res.json(options);
  } else {
    res.status(500).json({ error: 'Failed to read options file.' });
  }
});

// PUT /api/variables/options
// Update the entire baseline options file
router.put('/options', (req, res) => {
  const newOptions = req.body;
  if (writeYaml(OPTIONS_FILE, newOptions)) {
    res.json({ message: 'Baseline options updated successfully.' });
  } else {
    res.status(500).json({ error: 'Failed to write options file.' });
  }
});

// GET /api/variables/current
// Retrieve the current values for a specific project/user
router.get('/current/:username/:projectName', (req, res) => {
  const { username, projectName } = req.params;
  // This is a simplified approach, assuming one file for all variables.
  // A better approach might be a per-project file.
  const variables = readYaml(VARIABLES_FILE);
  if (variables) {
    res.json(variables);
  } else {
    res.status(500).json({ error: 'Failed to read variables file.' });
  }
});

// PUT /api/variables/current
// Update the current values for a specific project/user
router.put('/current', (req, res) => {
  const { username, projectName, newVariables } = req.body;
  if (writeYaml(VARIABLES_FILE, newVariables)) {
    res.json({ message: 'Baseline variables updated successfully.' });
  } else {
    res.status(500).json({ error: 'Failed to write variables file.' });
  }
});

module.exports = router;