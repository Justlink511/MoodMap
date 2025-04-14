import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, IconButton } from '@mui/material';
import { SentimentVerySatisfied, SentimentSatisfied, SentimentNeutral, SentimentDissatisfied, SentimentVeryDissatisfied, AccountCircle, Logout } from '@mui/icons-material';
import MoodMarker from './MoodMarker';
import AuthDialog from './AuthDialog';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://votre-api-heroku.herokuapp.com/api'  // Remplacez par l'URL de votre API déployée
  : 'http://localhost:5000/api';

const moods = [
  { icon: SentimentVerySatisfied, label: 'Très heureux', color: '#4CAF50' },
  { icon: SentimentSatisfied, label: 'Heureux', color: '#8BC34A' },
  { icon: SentimentNeutral, label: 'Neutre', color: '#FFC107' },
  { icon: SentimentDissatisfied, label: 'Triste', color: '#FF9800' },
  { icon: SentimentVeryDissatisfied, label: 'Très triste', color: '#F44336' },
];

function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

function SetViewOnUserLocation() {
  const map = useMap();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
        },
        (error) => {
          console.log("Erreur de géolocalisation:", error);
        }
      );
    }
  }, [map]);

  return null;
}

export default function Map() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [open, setOpen] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [comment, setComment] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, token, logout } = useAuth();

  // Charger les marqueurs au démarrage
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch(`${API_URL}/markers`);
        const data = await response.json();
        console.log('Données reçues du serveur:', data);
        // S'assurer que data est un tableau
        const markersArray = Array.isArray(data) ? data : [];
        console.log('Marqueurs traités:', markersArray);
        setMarkers(markersArray);
      } catch (error) {
        console.error('Erreur lors du chargement des marqueurs:', error);
        setMarkers([]); // En cas d'erreur, initialiser avec un tableau vide
      } finally {
        setLoading(false);
      }
    };

    fetchMarkers();
    // Rafraîchir les marqueurs toutes les minutes
    const interval = setInterval(fetchMarkers, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLocationSelect = (latlng) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    setSelectedLocation(latlng);
    setOpen(true);
    setComment('');
    setSelectedMood(null);
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async () => {
    if (selectedLocation && selectedMood) {
      const newMarker = {
        position: {
          lat: parseFloat(selectedLocation.lat),
          lng: parseFloat(selectedLocation.lng)
        },
        mood: {
          label: selectedMood.label,
          color: selectedMood.color
        },
        comment: comment.trim()
      };

      console.log('Données envoyées au serveur:', JSON.stringify(newMarker, null, 2));

      try {
        const response = await fetch(`${API_URL}/markers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newMarker),
        });

        if (response.ok) {
          const savedMarker = await response.json();
          console.log('Marqueur sauvegardé:', savedMarker);
          setMarkers(prevMarkers => [...prevMarkers, savedMarker]);
          setOpen(false);
          setComment('');
          setSelectedMood(null);
        } else {
          const errorData = await response.json();
          console.error('Erreur lors de la sauvegarde du marqueur:', errorData);
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du marqueur:', error);
      }
    }
  };

  return (
    <>
      <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
       

        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          className="dark-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={handleLocationSelect} />
          <SetViewOnUserLocation />
          {Array.isArray(markers) && markers.map((marker, index) => (
            <MoodMarker
              key={index}
              position={[marker.position.lat, marker.position.lng]}
              mood={marker.mood}
              comment={marker.comment}
              username={marker.username}
            />
          ))}
        </MapContainer>
      </Box>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(26, 0, 51, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(147, 51, 234, 0.1)',
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Comment vous sentez-vous à cet endroit ?</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              {moods.map((mood, index) => {
                const Icon = mood.icon;
                return (
                  <Button
                    key={index}
                    onClick={() => handleMoodSelect(mood)}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      color: mood.color,
                      backgroundColor: selectedMood === mood ? `${mood.color}20` : 'transparent',
                      '&:hover': { backgroundColor: `${mood.color}20` },
                      transition: 'all 0.3s ease',
                      transform: selectedMood === mood ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <Icon sx={{ fontSize: 40 }} />
                    <Typography variant="caption" sx={{ color: 'white' }}>{mood.label}</Typography>
                  </Button>
                );
              })}
            </Box>
            <TextField
              label="Ajouter un commentaire (optionnel)"
              multiline
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(147, 51, 234, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(147, 51, 234, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(147, 51, 234, 0.8)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpen(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedMood}
            variant="contained"
            sx={{
              backgroundColor: 'rgba(147, 51, 234, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(147, 51, 234, 1)',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(147, 51, 234, 0.3)',
              },
            }}
          >
            Valider
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
} 