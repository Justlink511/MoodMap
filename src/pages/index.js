import { useState, useEffect } from 'react';
import { Box, Container, Typography, IconButton, Button } from '@mui/material';
import dynamic from 'next/dynamic';
import AuthDialog from '../components/AuthDialog';
import { useAuth } from '../contexts/AuthContext';
import { AccountCircle, Logout } from '@mui/icons-material';

// Import dynamique de la carte pour éviter les problèmes de SSR
const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, token, logout } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a0033 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{
              color: 'white',
              textShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
              fontWeight: 'bold',
              mb: 4
            }}
          >
            Carte des Humeurs Mondiale
          </Typography>
          <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: 'white' }}>
                {user.username}
              </Typography>
              <IconButton
                onClick={logout}
                sx={{ color: 'white' }}
              >
                <Logout />
              </IconButton>
            </Box>
          ) : (
            <Button
              startIcon={<AccountCircle />}
              onClick={() => setAuthDialogOpen(true)}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(147, 51, 234, 0.3)',
                },
              }}
            >
              Se connecter
            </Button>
          )}
        </Box>
        <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
      />
          <Box 
            sx={{ 
              height: '80vh', 
              width: '100%', 
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.2)',
              border: '1px solid rgba(147, 51, 234, 0.1)'
            }}
          >
            <Map />
          </Box>
        </Box>
      </Container>
    </Box>
    
  );
} 