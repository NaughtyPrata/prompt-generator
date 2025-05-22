import React from 'react';

function Header() {
  return (
    <div
      className="header p-2 mb-2 shadow-1"
      style={{ borderRadius: '8px' }}
    >
      <div className="grid">
        <div className="col-12">
          <div className="flex align-items-center">
            <div>
              <i className="pi pi-magic mr-3" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <div>
              <h1 className="mb-0 text-3xl text-white">
                AIA Thailand Sales Genie
              </h1>
              <p className="mt-2 mb-0 text-sm opacity-80">
                Create customized sales prompts by combining product information, persona styles,
                and small talk elements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
