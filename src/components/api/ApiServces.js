// // api/apiService.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const API_BASE_URL = 'https://test.tallydekho.com/app';

// // Create axios instance with default config
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//   },
// });

// // Add request interceptor for adding tokens or common headers
// apiClient.interceptors.request.use(
//   async config => {
//     const token = await AsyncStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error),
// );

// // Add response interceptor for error handling
// apiClient.interceptors.response.use(
//   response => {
//     return response.data;
//   },
//   error => {
//     console.error('API Error:', error);
//     return Promise.reject(error);
//   },
// );

// // API METHODS
// const apiService = {
//   // Fetch all companies
//   fetchCompanies: async () => {
//     try {
//       const response = await apiClient.get('/companies');
//       return response;
//     } catch (error) {
//       throw new Error('Failed to fetch companies: ' + error.message);
//     }
//   },

//   fetchLedgers: async body => {
//     try {
//       const response = await fetch('https://test.tallydekho.com/app/ledgers', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });

//       return await response.json();
//     } catch (error) {
//       console.log('Ledger API Error:', error);
//       throw error;
//     }
//   },

//   fetchLedgerDetails: async body => {
//     try {
//       const response = await fetch('https://test.tallydekho.com/app/ledger', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });

//       return await response.json();
//     } catch (error) {
//       console.log('Ledger API Error:', error);
//       throw error;
//     }
//   },

//   fetchStockSummary: async companyGuid => {
//     try {
//       const response = await fetch(
//         'https://test.tallydekho.com/app/stock-dashboard',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({companyGuid}),
//         },
//       );

//       return await response.json();
//     } catch (error) {
//       console.log('Stock Summary API Error:', error);
//       throw error;
//     }
//   },
//   fetchStockFilters: async companyGuid => {
//     try {
//       const response = await fetch(
//         'https://test.tallydekho.com/app/stock-filters',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({companyGuid}),
//         },
//       );

//       return await response.json();
//     } catch (error) {
//       console.log('Stock Filters API Error:', error);
//       throw error;
//     }
//   },

//   fetchStocks: async body => {
//     try {
//       const response = await fetch('https://test.tallydekho.com/app/stocks', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });

//       return await response.json();
//     } catch (error) {
//       console.log('Stocks API Error:', error);
//       throw error;
//     }
//   },

//   pairDevice: async body => {
//     try {
//       const response = await fetch('https://test.tallydekho.com/app/pairing', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify(body),
//       });

//       return await response.json();
//     } catch (error) {
//       console.log('Pairing API Error:', error);
//       throw error;
//     }
//   },

//   verifyToken: async token => {
//     try {
//       const response = await fetch('https://test.tallydekho.com/app/verify', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({token}),
//       });

//       return await response.json();
//     } catch (error) {
//       console.log('Verify Token API Error:', error);
//       throw error;
//     }
//   },

// };

// export default apiService;

/**
 * @deprecated This file is deprecated. Please use src/services/api/apiService.js instead.
 * See MIGRATION_GUIDE.md for migration instructions.
 * 
 * New services offer:
 * - Automatic retry logic
 * - Request deduplication
 * - Intelligent caching
 * - Better error handling
 * - Network monitoring
 * 
 * This file will be removed in a future release.
 */

// api/apiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'https://test.tallydekho.com/app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    // console.log(token);

    // console.log('➡️ API CALL:', config.url);
    // console.log('📦 Request Body:', config.data);
    // console.log('🔑 Token Found:', token ? 'YES ✅' : 'NO ❌');

    // Skip token for pairing
    if (config.url === '/pairing') {
      // console.log('⏭️ Skipping token for pairing request');
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('✅ Token attached to header');
    } else {
      // console.log('⚠️ No token available to attach');
    }

    return config;
  },
  error => Promise.reject(error),
);

// Handle responses uniformly
apiClient.interceptors.response.use(
  response => {
    // console.log('✅ API SUCCESS:', {
    //   url: response.config.url,
    //   status: response.status,
    //   data: response.data,
    // });
    return response.data; // ← your actual usable data
  },
  error => {
    // console.log('❌ API ERROR:', {
    //   url: error?.config?.url,
    //   status: error?.response?.status,
    //   data: error?.response?.data,
    //   message: error?.message,
    // });
    return Promise.reject(error);
  },
);

//  All API Methods (axios only)
const apiService = {
  // Get companies
  fetchCompanies: () => apiClient.get('/companies'),

  fetchPairingDetails :() => apiClient.get('/pairing-device'),

  // Get ledgers list
  fetchLedgers: body => apiClient.post('/ledgers', body),

  // Get ledger details
  fetchLedgerDetails: body => apiClient.post('/ledger', body),

  //  Stock Dashboard Summary (Use company GUID here)
  fetchStockSummary: companyGuid =>
    apiClient.post('/stock-dashboard', {companyGuid}),

  // Filters for stock list
  fetchStockFilters: companyGuid =>
    apiClient.post('/stock-filters', {companyGuid}),

  // Actual stock items list
  fetchStocks: body => apiClient.post('/stocks', body),

  // Pair device
  pairDevice: body => apiClient.post('/pairing', body),

  // Verify token
  verifyToken: token => apiClient.post('/verify', {token}),
};

export default apiService;
