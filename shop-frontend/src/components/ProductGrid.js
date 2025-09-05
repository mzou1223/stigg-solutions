import React, { useState } from 'react';
import products from '../data/products';

const ProductGrid = () => {
  const [userPlan, setUserPlan] = useState({
    hasSpecialAccess: false,
    cartLimit: 5
  });

  //cart array to track configuration feature
  const [cart, setCart] = useState([]);
  //initial metered feature of views count 
  const [viewCount, setViewCount] = useState(0);
  //paywall information
  const [showPaywall, setShowPaywall] = useState(null);

  const handleProductClick = (product) => {
    // if user does not have special access, cannot click into special product
    if (product.special && !userPlan.hasSpecialAccess) {
      setShowPaywall(product);
      return;
    }

    // use state to increment to track views for product
    setViewCount(prev => prev + 1);

    alert(`+1 View for ${product.name}`);
  };

  const addToCart = (product, event) => {
    event.stopPropagation();

    // checking cart limit based on userPlan limit
    if (cart.length >= userPlan.cartLimit) {
      alert(`Cart limit reached! You can only add ${userPlan.cartLimit} items.`);
      return;
    }

    // check special access
    if (product.special && !userPlan.hasSpecialAccess) {
      setShowPaywall(product);
      return;
    }

    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ 
        background: 'white',
        padding: '20px',
        border: '1px solid #ddd',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Pet Shop</h2>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            {userPlan.hasSpecialAccess ? 'Premium Access' : 'Free Plan'}
          </p>
        </div>
        <div style={{ fontSize: '14px' }}>
          <div>Cart: {cart.length}/{userPlan.cartLimit}</div>
          <div>Views: {viewCount}</div>
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        {products.map(product => (
          <div 
            key={product.id}
            onClick={() => handleProductClick(product)}
            style={{ 
              background: 'white',
              border: '1px solid #ddd',
              padding: '15px',
              cursor: 'pointer'
            }}
          >
            {/* Special Badge */}
            {product.special && (
              <div style={{ color: 'red', fontSize: '10px' }}>
                SPECIAL
              </div>
            )}

            {/* Product Info */}
            <h3 style={{ fontSize: '16px' }}>
              {product.name}
            </h3>
            
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              ${product.price}
            </div>

            {/* add to cart button */}
            <button
              onClick={(e) => addToCart(product, e)}
              disabled={product.special && !userPlan.hasSpecialAccess}
            >
              {product.special && !userPlan.hasSpecialAccess ? 'Special Access Needed' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>

      {/* Shopping Cart */}
      {cart.length > 0 && (
        <div style={{
          background: 'white',
          padding: '15px',
          border: '1px solid #ddd',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Shopping Cart ({cart.length}/{userPlan.cartLimit})</h3>
          {cart.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '5px 0'
            }}>
              <span>{item.name} - ${item.price}</span>
              <button onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* paywall component */}
      {showPaywall && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            textAlign: 'center',
            maxWidth: '300px'
          }}>
            <h3>Premium Access Required</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              "{showPaywall.name}" requires premium access.
            </p>
            <div>
              <button
                onClick={() => {
                  setUserPlan({ ...userPlan, hasSpecialAccess: true });
                  setShowPaywall(null);
                }}
              >
                Upgrade
              </button>
              <button onClick={() => setShowPaywall(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* grant special access as well as clearing cart options*/}
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        textAlign: 'center'
      }}>
        <button
          onClick={() => setUserPlan({ ...userPlan, hasSpecialAccess: !userPlan.hasSpecialAccess })}
        >
          {userPlan.hasSpecialAccess ? 'Remove' : 'Grant'} Special Access
        </button>
        <button onClick={() => setCart([])}>
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;