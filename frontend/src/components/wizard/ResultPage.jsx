import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Editor from '@monaco-editor/react';

const ResultPage = ({ generatedPrompt, onReset, outputFiles, onViewOutput }) => {
  console.log('🚀 ~ generatedPrompt:', generatedPrompt);
  return (
    <div className="step-card" style={{ height: '100%' }}>
      <Card
        style={{ borderRadius: '10px', height: '100%' }}
        header={
          <div
            className="flex align-items-center justify-content-center p-3 bg-success text-white"
            style={{
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
          >
            <i className="pi pi-check-circle mr-2" style={{ fontSize: '1.5rem' }}></i>
            <h2 className="m-0">Generated Prompt</h2>
          </div>
        }
      >
        <div className="p-fluid">
          <div className="p-2 mb-3 surface-50 prompt-preview" style={{ height: '400px' }}>
            <Editor
              height="100%"
              value={generatedPrompt}
              language="markdown"
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>

          <div className="mb-4">
            <h3>Previous Outputs</h3>
            <ul className="output-list p-0 m-0 mt-2" style={{ height: '30vh', overflowY: 'auto' }}>
              {outputFiles.map((file, index) => (
                <li
                  key={index}
                  className="p-3 border-bottom-1 surface-hover cursor-pointer flex align-items-center"
                  onClick={() => onViewOutput(file)}
                >
                  <i className="pi pi-file mr-2"></i> {file}
                </li>
              ))}
              {outputFiles.length === 0 && (
                <li className="p-3 text-color-secondary">No previous outputs found.</li>
              )}
            </ul>
          </div>

          <div className="flex justify-content-end mt-4">
            <Button
              label="Create New Prompt"
              icon="pi pi-plus"
              className="p-button-primary"
              onClick={onReset}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultPage;
