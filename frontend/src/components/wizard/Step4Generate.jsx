import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import './ReorderStyles.css';

const Step4Generate = ({
  selectedProduct,
  selectedPersona,
  selectedSmalltalk,
  onGenerate,
  onPrevious,
  loading,
  promptOrder,
  setPromptOrder,
}) => {
  const [items, setItems] = useState([]);

  // Initialize items when component loads or selections change
  useEffect(() => {
    if (!promptOrder || promptOrder.length === 0) {
      // Default order if not provided
      setItems([
        { id: 'product', label: 'Product', value: selectedProduct },
        { id: 'persona', label: 'Persona', value: selectedPersona },
        { id: 'smalltalk', label: 'Small Talk', value: selectedSmalltalk },
      ]);
    } else {
      // Use provided order
      const newItems = promptOrder.map(item => {
        if (item.id === 'product') return { ...item, value: selectedProduct };
        if (item.id === 'persona') return { ...item, value: selectedPersona };
        if (item.id === 'smalltalk') return { ...item, value: selectedSmalltalk };
        return item;
      });
      setItems(newItems);
    }
  }, [selectedProduct, selectedPersona, selectedSmalltalk, promptOrder]);

  return (
    <div className="step-card" style={{ height: '100%' }}>
      <Card
        style={{ borderRadius: '10px', height: '100%' }}
        header={
          <div
            className="flex align-items-center justify-content-center p-3 bg-primary text-white"
            style={{
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
          >
            <i className="pi pi-check-circle mr-2" style={{ fontSize: '1.5rem' }}></i>
            <h2 className="m-0 text-white">Step 4: Review & Generate</h2>
          </div>
        }
      >
        <div
          className="p-fluid"
          style={{
            height: 'calc(100% - 4rem)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div className="mb-4" style={{ flex: 1, overflow: 'auto' }}>
            <h3>Review Your Selections</h3>
            <p className="mb-3">Here is the order of prompt elements:</p>

            <div className="reorder-group">
              {items.map(item => (
                <div
                  key={item.id}
                  className="p-card p-4 mb-3 surface-50"
                >
                  <div className="flex align-items-center">
                    <p className="m-0">
                      <strong>{item.label}:</strong> {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-content-between mt-4" style={{ flexShrink: 0 }}>
            <Button
              label="Previous"
              icon="pi pi-arrow-left"
              className="p-button-outlined"
              onClick={onPrevious}
            />
            <Button
              label="Generate Prompt"
              icon="pi pi-bolt"
              iconPos="right"
              className="p-button-success"
              onClick={onGenerate}
              loading={loading}
              loadingIcon="pi pi-spin pi-spinner"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step4Generate;
