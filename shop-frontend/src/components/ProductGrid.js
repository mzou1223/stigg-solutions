import React, { useEffect, useState } from 'react';
import { Paywall } from '@stigg/react-sdk';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [userPlan, setUserPlan] = useState({});
    //cart array to track configuration feature
    const [cart, setCart] = useState([]);
    //initial metered feature of views count 
    const [viewCount, setViewCount] = useState(0);
    //paywall information
    const [showPaywall, setShowPaywall] = useState(null);

    const fetchData = async()=> {
        try{
        const allProducts = await fetch('http://localhost:3000/api/products');
        const productsData = await allProducts.json();
        setProducts(productsData.pets);

        //stigg entitlements with hardcoded customer
        const stiggEntitlements = await fetch('http://localhost:3000/api/stigg');
        const stiggData = await stiggEntitlements.json();
        setUserPlan({
            hasSpecialAccess: stiggData.specialProductEntitlement.hasAccess || false,
            cartLimit: stiggData.cartItemsConfig.value,
            viewLimit: stiggData.viewsEntitlements?.usageLimit || 3
        });
        }   
        catch (error){
            console.error('Error getting data')
        }
    };
    fetchData();

    useEffect(() => {
        fetchData();
    }, [])

  const handleProductClick = async (product) => {
    // if user does not have special access, cannot click into special product
    if (product.special && !userPlan.hasSpecialAccess) {
      setShowPaywall('view-limit');
      return;
    };

    //https://docs.stigg.io/guides/quick-start-guides/rendering-paywalls
    if(viewCount >= userPlan.viewLimit){
        setShowPaywall(
            'special-access');
        return;
    }

    try {
      await fetch('http://localhost:3000/api/raw-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petId: product.id })
      });
      if (viewCount <= userPlan.viewLimit){
        setViewCount(prev => prev + 1);
        alert(`+1 View for ${product.name}`);
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const addToCart = (product, event) => {
    //prevents a double call 
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
      
      {/* header information */}
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

      {/* actual product */}
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
      {showPaywall === 'special-access' && (
        <Paywall
            customerId="customer-cfb33b"
            featureId="feature-boolean-feature-special-product-access"
            onSubscriptionChange={() => {
            fetchData();
            setShowPaywall(null);
            }}
            onClose={() => setShowPaywall(null)}
        />
        )}

        {/* paywall for view limit */}
        {showPaywall === 'view-limit' && (
        <Paywall
            customerId="customer-cfb33b"
            featureId="feature-metered-feature-raw-product-views"
            onSubscriptionChange={() => {
            fetchData();
            setViewCount(0);
            setShowPaywall(null);
            }}
            onClose={() => setShowPaywall(null)}
        />
        )}

      {/* clearing cart options*/}
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        textAlign: 'center'
      }}>
        <button onClick={() => setCart([])}>
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;