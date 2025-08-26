const { readYaml } = require('./yamlHandler');

// A placeholder for a more complex validation regex
const NAME_REGEX = /^[a-z0-9-]+$/; 

function generateName(template, variables) {
  let name = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\$\\{${key}\\}`, 'g');
    name = name.replace(placeholder, value);
  }
  return name;
}

function validateName(name) {
  return NAME_REGEX.test(name);
}

// NEW FUNCTION: Validate all provided attributes against baseline options
function validateAttributes(attributes) {
  const options = readYaml('baseline-options.yaml');
  for (const [key, value] of Object.entries(attributes)) {
    // If the attribute name exists as a key in the options file and its value is a list
    if (options && options[key] && Array.isArray(options[key])) {
      if (!options[key].includes(value)) {
        return {
          isValid: false,
          message: `Variable '${key}' with value '${value}' is not a permitted value.`,
        };
      }
    }
  }
  return { isValid: true };
}

function getTemplate(resourceType) {
  const templates = readYaml('resource-templates.yaml');
  const [service, type] = resourceType.split('_');
  return templates[service] && templates[service][type];
}

module.exports = {
  generateName,
  validateName,
  validateAttributes, // Export the new validation function
  getTemplate,
};