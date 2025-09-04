import express from 'express';
import cors from 'cors';
import products from './data/products.js';
import stiggClient from './stigg/index.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;


app.get('/', (req,res) => {
    res.json({
        status: 'testing is working. test',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/products', (req,res) => {
    res.json({
        pets: products,
        count: products.length,
        message: 'testing products'
    })
})

//route to test the stigg entitlements with hardcoded customer
app.get('/api/stigg', async (req, res) => {
    try {
        const entitlements = await stiggClient.getEntitlements({
        customerId: 'customer-cb2a66'
        });    
        console.log('customer entitlements:', entitlements);
        const specialProductEntitlement = await stiggClient.getBooleanEntitlement({
        customerId: 'customer-cb2a66',
        featureId: 'feature-boolean-feature-special-product-access',
        });
        console.log('special access:', specialProductEntitlement);
        res.json({
            entitlementsCount: entitlements.length,
            specialProductEntitlement: specialProductEntitlement,
            entitlements: entitlements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(PORT, ()=> {
    console.log(`server running on port: ${PORT}`)
})

