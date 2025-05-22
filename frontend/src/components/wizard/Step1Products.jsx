import React from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const Step1Products = ({ products, selectedProduct, setSelectedProduct, onNext }) => {
  return (
    <div className="step-card" style={{ height: '100%' }}>
      <Card
        title="Step 1: Select Product"
        style={{ borderRadius: '10px', height: '100%' }}
        header={
          <div
            className="flex align-items-center justify-content-center p-3 bg-primary text-white"
            style={{
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
          >
            <i className="pi pi-shopping-cart mr-2" style={{ fontSize: '1.5rem' }}></i>
            <h2 className="m-0 text-white">Step 1: Select Product</h2>
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="product" className="font-bold block mb-2">
              Choose a Product:
            </label>
            <Dropdown
              id="product"
              value={selectedProduct}
              options={products.map(product => ({
                label: product,
                value: product,
              }))}
              onChange={e => setSelectedProduct(e.value)}
              placeholder="Select a Product"
              className="w-full"
            />
          </div>

          <div className="flex justify-content-end mt-4">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              className="p-button-raised"
              onClick={onNext}
              disabled={!selectedProduct}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step1Products;
