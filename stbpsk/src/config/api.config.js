const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://stbpsk.onrender.com'  // URL вашего сервера на Render
  : 'http://localhost:5000';

export default API_URL; 