import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tab,
  Tabs,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function AuthDialog({ open, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (activeTab === 0) {
        // Login
        await login(username, password);
      } else {
        // Signup
        await signup(username, password);
      }
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <DialogTitle sx={{ color: 'white' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: 'white',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'rgba(147, 51, 234, 0.8)',
            },
          }}
        >
          <Tab label="Connexion" />
          <Tab label="Inscription" />
        </Tabs>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nom d'utilisateur"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
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
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
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
          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: 'rgba(147, 51, 234, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(147, 51, 234, 1)',
            },
          }}
        >
          {activeTab === 0 ? 'Se connecter' : 'S\'inscrire'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 