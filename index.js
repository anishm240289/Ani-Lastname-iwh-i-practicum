require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   APP CONFIG
========================= */
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

/* =========================
   HUBSPOT CONFIG
========================= */
const HUBSPOT_BASE_URL = 'https://api.hubapi.com';

const headers = {
  Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * IMPORTANT:
 * Replace `p_pets` ONLY if your objectTypeId is different
 * (example: p123456_pets or 2-12345678)
 */
const OBJECT_TYPE = '2-55446012';

/* =========================
   ROUTES
========================= */

/**
 * Homepage – GET /
 * Fetch and display custom object records
 */
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/${OBJECT_TYPE}?properties=name,type,age`,
      { headers }
    );

    res.render('homepage', {
      title: 'Custom Object Table | Integrating With HubSpot I Practicum',
      records: response.data.results
    });
  } catch (error) {
    console.error('GET / error:', error.response?.data || error.message);
    res.status(500).send('Error loading records');
  }
});

/**
 * Form page – GET /update-cobj
 */
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

/**
 * Create record – POST /update-cobj
 */
app.post('/update-cobj', async (req, res) => {
  try {
    await axios.post(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/${OBJECT_TYPE}`,
      {
        properties: {
          name: req.body.name,
          type: req.body.type,
          age: req.body.age
        }
      },
      { headers }
    );

    res.redirect('/');
  } catch (error) {
    console.error('POST /update-cobj error:', error.response?.data || error.message);
    res.status(500).send('Error creating record');
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
