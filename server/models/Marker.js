const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
  position: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  mood: {
    label: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  comment: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Suppression automatique après 24h
  }
});

module.exports = mongoose.model('Marker', markerSchema); 