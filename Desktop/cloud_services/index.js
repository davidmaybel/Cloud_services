const express = require('express');
const app = express();

const port = 3000;
let costs;

try {
  costs = require('./costs');
} catch (error) {
  console.error('Error importing costs:', error);
}

// Function to get all costs for a given service
const getAllCosts = (serviceCode) => {
  const service = costs.find(s => s.code === serviceCode);
  return service ? service.cost : null;
};

// Function to get costs for a given service and date range
const getCostsInRange = (serviceCode, startDate, endDate) => {
    const allCosts = getAllCosts(serviceCode);
    if (!allCosts) return null;
  
    const startIdx = Object.keys(allCosts).indexOf(startDate);
    const endIdx = Object.keys(allCosts).indexOf(endDate);
    if (startIdx === -1 || endIdx === -1) return null;
  
    const filteredCosts = {};
    const keys = Object.keys(allCosts).slice(startIdx, endIdx + 1);
    keys.forEach(key => {
      filteredCosts[key] = allCosts[key];
    });
  
    return filteredCosts;
  };

// Define routes
app.get('/costs/:serviceCode/all', (req, res) => {
  const serviceCode = req.params.serviceCode;
  const data = getAllCosts(serviceCode);
  if (data) {
    res.json(data);
  } else {
    res.status(404).send('Service not found');
  }
});

app.get('/costs/:serviceCode', (req, res) => {
  const serviceCode = req.params.serviceCode;
  const { start, end } = req.query;
  const data = getCostsInRange(serviceCode, start, end);
  if (data) {
    res.json(data);
  } else {
    res.status(404).send('Service or date range not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});