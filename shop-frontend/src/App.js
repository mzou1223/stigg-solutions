import React from 'react';
import './App.css';
import { StiggProvider } from '@stigg/react-sdk';
import ProductGrid from './components/ProductGrid';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <StiggProvider
      apiKey={process.env.REACT_APP_STIGG_API_KEY}
      customerId="customer-cfb33b"
    >
    <div className="App">
      <header className="app-header">
        <h1>Stigg Pet Shop </h1>
      </header>

      <main className="app-main">

        <section className="search-section">
          <SearchBar />
        </section>

        <section className="products-section">
          <ProductGrid />
        </section>
      </main>
    </div>
    </StiggProvider>
  );
}

export default App;
