# stigg-solutions
Stigg Solutions Engineer Take-Home

Hey Mike! This is a full-stack eCommerce application that integrates the Stigg billing platform.

File Structure:
shop-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ProductGrid.js
│   │   ├── SearchBar.js
│   ├── data/           
│   │   └── products.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
shop-backend/
├── data/
│   └── products.js
├── stigg/
│   └── index.js
├── server.js
└── package.json

Setup Instructions: Open two terminals, one for backend and one for frontend. Make sure to create .env files in each folder and update your API keys there. 

Backend Setup
cd shop-backend
npm install
npm start
Server runs on http://localhost:3000

Frontend Setup
bashcd shop-frontend
npm install
npm start
Frontend runs on http://localhost:3001


Overview:
The app uses hardcoded customer ID customer-cfb33b with these features:
Boolean Feature (Special Product Access)
- Special products show paywall for free plan users
- Premium access required to view/purchase special items
Upgrade button grants access instantly

Configuration Feature (Cart/View Limits)
- Configurable limit controls maximum items in cart

Metered Feature - Events (Product Views)
- Every product click tracked as raw event to Stigg
- View counter increments with each product interaction
- Events sent to /api/raw-views endpoint

Metered Feature - Usage (Search Tracking)
- Search functionality tracks usage against daily limits
- Paywall triggers when search limit exceeded
- Usage reported to /api/search endpoint

What I'd Do With More Time
- Implement real eCommerce functionality (e.g. actual product pages to track views rather than an alert, product categories rather than singular all product grid)
- Add support for real customers rather than a singular, hardcoded customer (e.g. customer login page)
- Create a premium tier plan as well so the distinction between tiers can be demonstrated
- Integrate the Stigg pricing, Customer Portal, and Checkout within the Widgets section onto a landing page
