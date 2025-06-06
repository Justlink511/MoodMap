const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Marker = require('./models/Marker');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [ 'https://justlink511.github.io']  // Remplacez par votre nom d'utilisateur GitHub
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Route pour récupérer tous les marqueurs
app.get('/api/markers', async (req, res) => {
  try {
    const markers = await Marker.find()
      .sort({ createdAt: -1 })
      .limit(100);
    console.log('Marqueurs envoyés au client:', markers);
    res.json(markers);
  } catch (error) {
    console.error('Erreur lors de la récupération des marqueurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour ajouter un marqueur (protégée)
app.post('/api/markers', auth, async (req, res) => {
  try {
    const { position, mood, comment } = req.body;
    console.log('Données reçues pour nouveau marqueur:', { position, mood, comment });
    
    // Validation des données
    if (!position || !position.lat || !position.lng || !mood || !mood.label || !mood.color) {
      return res.status(400).json({ message: 'Données invalides' });
    }

    // Créer le marqueur avec l'ID de l'utilisateur
    const marker = new Marker({
      position: {
        lat: parseFloat(position.lat),
        lng: parseFloat(position.lng)
      },
      mood: {
        label: mood.label,
        color: mood.color
      },
      comment: comment || '',
      username: req.user.username,
      userId: req.user._id
    });

    await marker.save();
    console.log('Nouveau marqueur sauvegardé:', marker);
    res.status(201).json(marker);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du marqueur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Nettoyage automatique des marqueurs plus vieux que 24h
const cleanupMarkers = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Marker.deleteMany({ createdAt: { $lt: twentyFourHoursAgo } });
    console.log('Nettoyage des marqueurs effectué');
  } catch (error) {
    console.error('Erreur lors du nettoyage des marqueurs:', error);
  }
};

// Exécuter le nettoyage toutes les heures
setInterval(cleanupMarkers, 60 * 60 * 1000);
cleanupMarkers(); // Exécuter immédiatement au démarrage

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 