import React, { useState } from 'react';
import TabbedLayout from './components/TabbedLayout';
import ResourceForm from './components/ResourceForm';
import TemplateEditor from './components/TemplateEditor';
import VariableEditor from './components/VariableEditor';
import ExportUI from './components/ExportUI';
import './App.css'; 

function App() {
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const [currentProject, setCurrentProject] = useState({ username: 'johndoe', projectName: 'my-project' });

  const handleFormSubmit = async (formData: Record<string, string>) => {
    const postData = {
      username: currentProject.username,
      projectName: currentProject.projectName,
      resourceType: selectedResourceType,
      attributes: formData,
    };
    
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      if (response.ok) {
        alert(`Resource created with name: ${result.generatedName}`);
        // Optionally, refresh the list of resources
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to connect to the server.');
    }
  };
  
  // Define the tabs for the TabbedLayout component
  const tabs = [
    {
      label: 'Resources',
      content: (
        <div className="resource-tab">
          <h2>Manage Resources</h2>
          <div className="resource-selector">
            <label>Select Resource Type:</label>
            <select value={selectedResourceType} onChange={(e) => setSelectedResourceType(e.target.value)}>
              <option value="">-- Choose --</option>
              <option value="aws_s3_bucket">AWS S3 Bucket</option>
              <option value="aws_iam_role">AWS IAM Role</option>
              <option value="snowflake_warehouse">Snowflake Warehouse</option>
              {/* ... other options */}
            </select>
          </div>
          <ResourceForm resourceType={selectedResourceType} onSubmit={handleFormSubmit} />
          {/* List of existing resources would go here */}
        </div>
      ),
    },
    {
      label: 'Templates',
      content: <TemplateEditor />,
    },
    {
      label: 'Variables',
      content: <VariableEditor />,
    },
    {
      label: 'Export',
      content: <ExportUI username={currentProject.username} projectName={currentProject.projectName} />,
    },
  ];

  return (
    <div className="app-container">
      <header>
        <h1>Enterprise Naming Standards Tool</h1>
      </header>
      <TabbedLayout tabs={tabs} />
    </div>
  );
}

export default App;