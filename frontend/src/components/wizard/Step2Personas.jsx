import React from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const Step2Personas = ({ personas, selectedPersona, setSelectedPersona, onNext, onPrevious }) => {
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
            <i className="pi pi-user mr-2" style={{ fontSize: '1.5rem' }}></i>
            <h2 className="m-0 text-white">Step 2: Select Persona</h2>
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="persona" className="font-bold block mb-2">
              Choose a Persona:
            </label>
            <Dropdown
              id="persona"
              value={selectedPersona}
              options={personas.map(persona => ({
                label: persona,
                value: persona,
              }))}
              onChange={e => setSelectedPersona(e.value)}
              placeholder="Select a Persona"
              className="w-full"
            />
          </div>

          <div className="flex justify-content-between mt-4">
            <Button
              label="Previous"
              icon="pi pi-arrow-left"
              className="p-button-outlined"
              onClick={onPrevious}
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              className="p-button-raised"
              onClick={onNext}
              disabled={!selectedPersona}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step2Personas;
