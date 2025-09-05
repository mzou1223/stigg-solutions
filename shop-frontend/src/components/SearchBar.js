import React, { useState } from 'react';
import products from '../data/products';
import { Paywall } from '@stigg/react-sdk'; 

const SearchBar = () => {

  const [searchUsage, setSearchUsage] = useState({
    current: 1,
    limit: 3
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleSearch = (query) => {
    if (searchUsage.current >= searchUsage.limit) {
      setShowPaywall(true);
      return;
    }

    const results = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.type.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setSearchUsage(prev => ({
      ...prev,
      current: prev.current + 1
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
    }
  };

  const resetSearchLimit = () => {
    setSearchUsage(prev => ({ ...prev, current: 0 }));
    setShowPaywall(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Search Header */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0 }}>Product Search</h2>
          <div>
            Search Limit: {searchUsage.current}/{searchUsage.limit}
          </div>
        </div>

        {/* search form  */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for pets"
          />
          <button
            type="submit"
            disabled={!searchQuery.trim()}
          >
            {searchUsage.current >= searchUsage.limit ? 'Limit Reached' : 'Search'}
          </button>
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h3 style={{ marginTop: 0 }}>
            Results for "{searchQuery}" ({searchResults.length} found)
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {searchResults.map(product => (
              <div key={product.id} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                padding: '15px',
                background: '#f9f9f9'
              }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{product.name}</h4>
                <div>
                  ${product.price}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {product.special && <span>SPECIAL • </span>}
                  {product.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* paywall */}
      {showPaywall && (
      <Paywall
        customerId="customer-cfb33b"
        featureId="feature-metered-feature-usage-product-searches"
        onSubscriptionChange={() => {
          setSearchUsage(prev => ({ ...prev, current: 0, limit: 20 })); // Upgrade to higher limit
          setShowPaywall(false);
        }}
        onClose={() => setShowPaywall(false)}
      />
    )}

      {/* clear search */}
      <div style={{
        textAlign: 'center'
      }}>
        <button
          onClick={resetSearchLimit}
        >
          Reset Search Limit
        </button>
        <button
          onClick={() => {
            setSearchResults([]);
            setSearchQuery('');
          }}
        >
          Clear Results
        </button>
      </div>
    </div>
  );
};

export default SearchBar;