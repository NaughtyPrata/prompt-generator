import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import WizardContainer from './components/wizard/WizardContainer';
import ThemeToggle from './components/ThemeToggle';

// Set up axios with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Use environment variable for API URL
  timeout: 5000, // 5 second timeout
});

function App() {
  const [products, setProducts] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [smalltalks, setSmalltalks] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('');
  const [selectedSmalltalk, setSelectedSmalltalk] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [outputFiles, setOutputFiles] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'online', 'offline', 'unknown'

  // Check API health
  const checkApiHealth = async () => {
    try {
      await api.get('/api/health');
      setApiStatus('online');
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      setApiStatus('offline');
      setMessage({
        text: 'Backend server is not responding. Please ensure it is running on port 5000.',
        type: 'error',
      });
      return false;
    }
  };

  // Fetch available prompts
  const fetchPrompts = async () => {
    try {
      setLoading(true);

      // First check if API is available
      const isHealthy = await checkApiHealth();
      if (!isHealthy) {
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      console.log('Fetching prompts from API...');
      const response = await api.get('/api/prompts');
      console.log('Received prompts data:', response.data);

      const { products, personas, smalltalks } = response.data;

      setProducts(products);
      setPersonas(personas);
      setSmalltalks(smalltalks);

      // Set default selections if available
      if (products.length > 0) setSelectedProduct(products[0]);
      if (personas.length > 0) setSelectedPersona(personas[0]);
      if (smalltalks.length > 0) setSelectedSmalltalk(smalltalks[0]);

      // Clear any error messages
      setMessage({ text: '', type: '' });
    } catch (error) {
      console.error('Error fetching prompts:', error);

      // Extract the specific error message if available
      let errorMsg = 'Error loading prompts. Please ensure the backend server is running.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMsg = `Error: ${error.response.data.error}`;
      }

      setMessage({
        text: errorMsg,
        type: 'error',
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Fetch output files
  const fetchOutputs = async () => {
    try {
      const response = await api.get('/api/outputs');
      setOutputFiles(response.data.outputs);
    } catch (error) {
      console.error('Error fetching outputs:', error);
      // Don't show error message for this one to avoid UI clutter
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchPrompts();
    // Also fetch output files on initial load
    fetchOutputs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate prompt
  const handleGeneratePrompt = async promptOrder => {
    if (!selectedProduct || !selectedPersona || !selectedSmalltalk) {
      setMessage({
        text: 'Please select all prompt components',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/generate', {
        product: selectedProduct,
        persona: selectedPersona,
        smalltalk: selectedSmalltalk,
        promptOrder: promptOrder
          ? promptOrder.map(item => item.id)
          : ['product', 'persona', 'smalltalk'],
      });

      setGeneratedPrompt(response.data.content);
      setMessage({
        text: `Prompt generated and saved as: ${response.data.filename}`,
        type: 'success',
      });

      // Refresh the output files list
      await fetchOutputs();
    } catch (error) {
      console.error('Error generating prompt:', error);

      // Extract the specific error message if available
      let errorMsg = 'Error generating prompt. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      }

      setMessage({
        text: errorMsg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // View a specific output file
  const handleViewOutput = async filename => {
    try {
      setLoading(true);
      const response = await api.get(`/api/output/${filename}`);
      setGeneratedPrompt(response.data.content);
      setMessage({ text: `Loaded: ${filename}`, type: 'success' });
    } catch (error) {
      console.error('Error loading output file:', error);

      // Extract the specific error message if available
      let errorMsg = 'Error loading output file. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      }

      setMessage({
        text: errorMsg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div>Loading application...</div>
      </div>
    );
  }

  return (
    <div
      className="app-container p-4"
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ThemeToggle />
      <div className="container" style={{ flex: 1, overflow: 'auto' }}>
        <Header />

        <div className="card mt-4">
          <WizardContainer
            products={products}
            personas={personas}
            smalltalks={smalltalks}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedPersona={selectedPersona}
            setSelectedPersona={setSelectedPersona}
            selectedSmalltalk={selectedSmalltalk}
            setSelectedSmalltalk={setSelectedSmalltalk}
            onGenerate={handleGeneratePrompt}
            generatedPrompt={generatedPrompt}
            outputFiles={outputFiles}
            onViewOutput={handleViewOutput}
            loading={loading}
            apiStatus={apiStatus}
            message={message}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
