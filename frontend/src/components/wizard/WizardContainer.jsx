import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Step1Products from './Step1Products';
import Step2Personas from './Step2Personas';
import Step3Smalltalk from './Step3Smalltalk';
import Step4Generate from './Step4Generate';
import ResultPage from './ResultPage';

const WizardContainer = ({
  products,
  personas,
  smalltalks,
  selectedProduct,
  setSelectedProduct,
  selectedPersona,
  setSelectedPersona,
  selectedSmalltalk,
  setSelectedSmalltalk,
  onGenerate,
  generatedPrompt,
  outputFiles,
  onViewOutput,
  loading,
  apiStatus,
  message,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [promptOrder, setPromptOrder] = useState([
    { id: 'product', label: 'Product' },
    { id: 'persona', label: 'Persona' },
    { id: 'smalltalk', label: 'Small Talk' },
  ]);
  const toast = useRef(null);

  const items = [
    { label: 'Product' },
    { label: 'Persona' },
    { label: 'Small Talk' },
    { label: 'Generate' },
  ];

  useEffect(() => {
    if (message.text && message.type) {
      const severity =
        message.type === 'success' ? 'success' : message.type === 'info' ? 'info' : 'error';

      toast.current.show({
        severity,
        summary: severity === 'success' ? 'Success' : severity === 'info' ? 'Information' : 'Error',
        detail: message.text,
        life: 5000,
      });
    }
  }, [message]);

  const nextStep = () => {
    setCurrentStep(prevStep => {
      if (prevStep < 3) {
        return prevStep + 1;
      }
      return prevStep;
    });
  };

  const previousStep = () => {
    setCurrentStep(prevStep => {
      if (prevStep > 0) {
        return prevStep - 1;
      }
      return prevStep;
    });
  };

  const handleGenerate = async () => {
    // Pass the promptOrder to the onGenerate function
    await onGenerate(promptOrder);
    setCompleted(true);
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setCompleted(false);
    // Reset prompt order to default
    setPromptOrder([
      { id: 'product', label: 'Product' },
      { id: 'persona', label: 'Persona' },
      { id: 'smalltalk', label: 'Small Talk' },
    ]);
  };

  const renderStep = () => {
    if (completed) {
      return (
        <ResultPage
          generatedPrompt={generatedPrompt}
          onReset={resetWizard}
          outputFiles={outputFiles}
          onViewOutput={onViewOutput}
        />
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <Step1Products
            products={products}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <Step2Personas
            personas={personas}
            selectedPersona={selectedPersona}
            setSelectedPersona={setSelectedPersona}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 2:
        return (
          <Step3Smalltalk
            smalltalks={smalltalks}
            selectedSmalltalk={selectedSmalltalk}
            setSelectedSmalltalk={setSelectedSmalltalk}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 3:
        return (
          <Step4Generate
            selectedProduct={selectedProduct}
            selectedPersona={selectedPersona}
            selectedSmalltalk={selectedSmalltalk}
            onGenerate={handleGenerate}
            onPrevious={previousStep}
            loading={loading}
            promptOrder={promptOrder}
            setPromptOrder={setPromptOrder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container p-4" style={{ height: '100%' }}>
      <Toast ref={toast} />

      {!completed && (
        <div className="mb-3">
          <Steps
            model={items}
            activeIndex={currentStep}
            onSelect={e => setCurrentStep(e.index)}
            readOnly={false}
            className="mb-2"
          />
          <ProgressBar value={(currentStep + 1) * 25} showValue={false} style={{ height: '6px' }} />
        </div>
      )}

      <div className="step-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default WizardContainer;
