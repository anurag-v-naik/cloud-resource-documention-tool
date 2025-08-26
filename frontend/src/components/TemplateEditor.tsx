import React, { useState, useEffect } from 'react';

const TemplateEditor: React.FC = () => {
  const [templates, setTemplates] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        console.error('Failed to fetch templates.');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templates),
      });
      if (response.ok) {
        alert('Templates saved successfully!');
      } else {
        alert('Failed to save templates.');
      }
    } catch (error) {
      alert('Error saving templates.');
    }
  };

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div>
      <h2>Edit Naming Templates</h2>
      <p>Edit the JSON below to update the templates. Be careful with the format!</p>
      <textarea
        value={JSON.stringify(templates, null, 2)}
        onChange={(e) => {
          try {
            setTemplates(JSON.parse(e.target.value));
          } catch (error) {
            // Can add an error message here
          }
        }}
        rows={20}
        cols={80}
        style={{ width: '100%' }}
      />
      <button onClick={handleSave}>Save Templates</button>
    </div>
  );
};

export default TemplateEditor;