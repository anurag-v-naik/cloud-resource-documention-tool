import React, { useState, useEffect } from 'react';

// Define the shape of an attribute from the template
interface TemplateAttribute {
  name: string;
  // Other properties like 'label' or 'description' could be added here
}

interface Props {
  resourceType: string;
  onSubmit: (formData: Record<string, string>) => void;
}

const ResourceForm: React.FC<Props> = ({ resourceType, onSubmit }) => {
  const [templateAttributes, setTemplateAttributes] = useState<TemplateAttribute[]>([]);
  const [baselineOptions, setBaselineOptions] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!resourceType) return;
      setIsLoading(true);
      try {
        // Fetch the resource template attributes
        const templateResponse = await fetch(`/api/templates`);
        const allTemplates = await templateResponse.json();
        const [service, type] = resourceType.split('_');
        const attributes = allTemplates[service][type]?.attributes || [];
        setTemplateAttributes(attributes);

        // Fetch the baseline options
        const optionsResponse = await fetch('/api/variables/options');
        const optionsData = await optionsResponse.json();
        setBaselineOptions(optionsData);

        // Initialize form data
        const initialData: Record<string, string> = {};
        attributes.forEach((attr: any) => {
          // Set a default value if the option list has one, otherwise an empty string
          if (optionsData[attr.name] && optionsData[attr.name].length > 0) {
            initialData[attr.name] = optionsData[attr.name][0]; // Set first option as default
          } else {
            initialData[attr.name] = '';
          }
        });
        setFormData(initialData);

      } catch (error) {
        console.error('Failed to fetch form data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [resourceType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (isLoading) {
    return <div>Loading form...</div>;
  }

  if (!resourceType) {
    return <div>Please select a resource type to begin creating a new resource.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {templateAttributes.map((attr) => (
        <div key={attr.name}>
          <label htmlFor={attr.name}>{attr.name}</label>
          {baselineOptions[attr.name] && Array.isArray(baselineOptions[attr.name]) ? (
            // Render a dropdown for variables with a predefined list of options
            <select
              id={attr.name}
              name={attr.name}
              value={formData[attr.name] || ''}
              onChange={handleChange}
            >
              {baselineOptions[attr.name].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            // Render a text input for free-form variables
            <input
              type="text"
              id={attr.name}
              name={attr.name}
              value={formData[attr.name] || ''}
              onChange={handleChange}
              required
            />
          )}
        </div>
      ))}
      <button type="submit">Generate and Create Resource</button>
    </form>
  );
};

export default ResourceForm;