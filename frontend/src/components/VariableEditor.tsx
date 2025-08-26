import React, { useState, useEffect } from 'react';

const VariableEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('options');
  const [options, setOptions] = useState<any>(null);
  const [variables, setVariables] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [optionsRes, variablesRes] = await Promise.all([
        fetch('/api/variables/options'),
        // Assuming user and project context
        fetch('/api/variables/current/johndoe/my-project'), 
      ]);
      const optionsData = await optionsRes.json();
      const variablesData = await variablesRes.json();
      setOptions(optionsData);
      setVariables(variablesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any, endpoint: string) => {
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert('Data saved successfully!');
      } else {
        alert('Failed to save data.');
      }
    } catch (error) {
      alert('Error saving data.');
    }
  };

  if (isLoading) {
    return <div>Loading variable data...</div>;
  }

  return (
    <div>
      <h2>Manage Variables and Options</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab('options')} className={activeTab === 'options' ? 'active' : ''}>
          Baseline Options
        </button>
        <button onClick={() => setActiveTab('variables')} className={activeTab === 'variables' ? 'active' : ''}>
          Project Variables
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'options' && (
          <div>
            <h3>Edit Baseline Options</h3>
            <p>Define all permitted values for variables (e.g., all valid environments).</p>
            <textarea
              value={JSON.stringify(options, null, 2)}
              onChange={(e) => {
                try {
                  setOptions(JSON.parse(e.target.value));
                } catch {}
              }}
              rows={15}
              cols={80}
            />
            <button onClick={() => handleSave(options, '/api/variables/options')}>Save Options</button>
          </div>
        )}

        {activeTab === 'variables' && (
          <div>
            <h3>Edit Project Variables</h3>
            <p>Set the current values for this project (e.g., env: dev, dept: eng).</p>
            <textarea
              value={JSON.stringify(variables, null, 2)}
              onChange={(e) => {
                try {
                  setVariables(JSON.parse(e.target.value));
                } catch {}
              }}
              rows={15}
              cols={80}
            />
            <button onClick={() => handleSave(variables, '/api/variables/current')}>Save Variables</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariableEditor;