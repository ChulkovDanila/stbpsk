const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    default: '+7'
  },
  deliveryCities: {
    type: [String],
    default: []
  },
  // Здесь будут добавляться другие поля по мере необходимости
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', contentSchema); 