import React, { useState } from 'react';

interface ExportUIProps {
  username: string;
  projectName: string;
}

const ExportUI: React.FC<ExportUIProps> = ({ username, projectName }) => {
  // State for Confluence export form
  const [confluenceUrl, setConfluenceUrl] = useState('');
  const [confluenceSpace, setConfluenceSpace] = useState('');
  const [confluencePage, setConfluencePage] = useState('');
  const [confluenceToken, setConfluenceToken] = useState('');

  const handleExport = async (format: string) => {
    try {
      const response = await fetch(`/api/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, projectName }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      if (format === 'confluence') {
        alert('Documentation successfully sent to Confluence!');
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName}_${format}.txt`; // Adjust filename based on format
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        alert(`Exported ${format} successfully!`);
      }
    } catch (error: any) {
      alert(`Error exporting to ${format}: ${error.message}`);
    }
  };

  const handleConfluenceExport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/export/confluence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          projectName,
          confluenceUrl,
          confluenceSpace,
          confluencePage,
          confluenceToken,
        }),
      });

      if (response.ok) {
        alert('Documentation successfully sent to Confluence!');
      } else {
        const error = await response.json();
        alert(`Failed to send to Confluence: ${error.message}`);
      }
    } catch (error) {
      alert('Error connecting to Confluence API.');
    }
  };

  return (
    <div className="export-ui">
      <h2>Export Resources and Documentation</h2>
      
      <div className="export-section">
        <h3>Download Exports</h3>
        <button onClick={() => handleExport('terraform')}>Export as Terraform</button>
        <button onClick={() => handleExport('html')}>Export as HTML</button>
        <button onClick={() => handleExport('mermaid')}>Export as Mermaid Diagram</button>
      </div>

      <div className="export-section">
        <h3>Export to Confluence</h3>
        <form onSubmit={handleConfluenceExport}>
          <div>
            <label>Confluence URL:</label>
            <input type="text" value={confluenceUrl} onChange={(e) => setConfluenceUrl(e.target.value)} required />
          </div>
          <div>
            <label>Space Key:</label>
            <input type="text" value={confluenceSpace} onChange={(e) => setConfluenceSpace(e.target.value)} required />
          </div>
          <div>
            <label>Page Title:</label>
            <input type="text" value={confluencePage} onChange={(e) => setConfluencePage(e.target.value)} required />
          </div>
          <div>
            <label>API Token:</label>
            <input type="password" value={confluenceToken} onChange={(e) => setConfluenceToken(e.target.value)} required />
          </div>
          <button type="submit">Send to Confluence</button>
        </form>
      </div>
    </div>
  );
};

export default ExportUI;