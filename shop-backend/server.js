import express from 'express';
import cors from 'cors';
import products from './data/products.js';
import stiggClient from './stigg/index.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const CUSTOMER_ID = 'customer-cfb33b'


app.get('/', (req,res) => {
    res.json({
        status: 'testing is working. test',
        timestamp: new Date().toISOString()
    });
});

//route to test the stigg entitlements with hardcoded customer
app.get('/api/stigg', async (req, res) => {
    try {
        const entitlements = await stiggClient.getEntitlements(CUSTOMER_ID);    
        const specialProductEntitlement = await stiggClient.getBooleanEntitlement({
        customerId: CUSTOMER_ID,
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

// route to test hard coded customer's existence
app.get('/api/test-customer', async (req, res) => {
    try {
        const customer = await stiggClient.getCustomer(CUSTOMER_ID);
        
        res.json({
            customerExists: true,
            customer: customer
        });
    } catch (error) {
        res.json({
            customerExists: false,
            error: error.message
        });
    }
});

//route to get all products 
app.get('/api/products', async (req, res) => {
    try {
        //documentation here: https://node-sdk-docs.stigg.io/classes/stigg#getBooleanEntitlement
        const specialAccess = await stiggClient.getBooleanEntitlement({
            customerId: CUSTOMER_ID,
            featureId: 'feature-boolean-feature-special-product-access'
        });
        // filtering products based on customer's special access
        let filteredProducts;
        if (specialAccess.hasAccess){
            filteredProducts = products
        } else {
            filteredProducts = products.filter(pet => !pet.premium)
        }
        res.json({
            pets: filteredProducts,
            specialAccess: specialAccess.hasAccess
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//tracking raw pet views
app.post('/api/raw-views', async (req, res) => {
    try {
        const { petId } = req.body;
        const pet = products.find(p => p.id === parseInt(petId));
        
        if (!pet) {
            return res.status(404).json({ error: 'searched pet does not exist' });
        }
            //https://docs.stigg.io/api-and-sdks/integration/backend/nodejs#reporting-usage-measurements-to-stigg
        await stiggClient.reportEvent({
            customerId: CUSTOMER_ID,
            eventName: 'product_view',
            idempotencyKey: '82f584b6-488f-4275-a0d3-47442d64ad79',
            dimensions: {
                pet_id: petId.toString(),
                pet_name: pet.name,
                is_special: pet.special.toString()
            },
            timestamp: new Date().toISOString()
        });

        res.json({ success: true, message: 'pet view tracked' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//test get route for pet raw views
app.get('/api/raw-views/test/:petId', async (req, res) => {
    try {
        const petId = req.params.petId;
        // same as post route above but with url
        const pet = products.find(p => p.id === parseInt(petId));
        if (!pet) {
            return res.status(404).json({ error: 'pet does not exist' });
        }
        await stiggClient.reportEvent({
            customerId: CUSTOMER_ID,
            eventName: 'product_view',
            idempotencyKey: '82f584b6-488f-4275-a0d3-47442d64ad79',
            dimensions: {
                pet_id: petId.toString(),
                pet_name: pet.name,
                is_special: pet.special.toString()
            },
            timestamp: new Date().toISOString()
        });

        res.json({ success: true, message: 'pet view tracked' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        // tracking searches
        // documentation here: https://docs.stigg.io/api-and-sdks/integration/backend/nodejs#reporting-usage-measurements-to-stigg
        await stiggClient.reportUsage({
            customerId: CUSTOMER_ID,
            featureId: 'feature-metered-feature-usage-product-searches',
            value: 10
        });

        // actually filtering for searches 
        const results = products.filter(pet => 
            pet.name.toLowerCase().includes(query.toLowerCase())
        );

        res.json({ 
            results,
            query,
            count: results.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/search/test/:query', async (req, res) => {
    try {
        const query = req.params.query;
         await stiggClient.reportUsage({
            customerId: CUSTOMER_ID,
            featureId: 'feature-metered-feature-usage-product-searches',
            value: 10
        });

        // actually filtering for searches 
        const results = products.filter(pet => 
            pet.name.toLowerCase().includes(query.toLowerCase())
        );

        res.json({ 
            results,
            query,
            count: results.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, ()=> {
    console.log(`server running on port: ${PORT}`)
})

