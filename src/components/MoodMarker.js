import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export default function MoodMarker({ position, mood, comment, username }) {
  const { user } = useAuth();
  const icon = createCustomIcon(mood.color);

  return (
    <Marker position={position} icon={icon}>
      <Tooltip permanent={false}>
        <Typography variant="subtitle2" sx={{ color: mood.color }}>
          {mood.label}
          {user && username && (
            <Typography variant="caption" sx={{ color: 'black', display: 'block', mt: 0.5 }}>
              Par : {username}
            </Typography>
          )}
          {user && comment && (
            <Typography variant="body2" sx={{ color: 'black', mt: 0.5 }}>
              {comment}
            </Typography>
          )}
        </Typography>
      </Tooltip>
      <Popup>
        <Typography variant="subtitle1" sx={{ color: mood.color }}>
          {mood.label}
        </Typography>
        {user && username && (
          <Typography variant="caption" sx={{ color: 'black', display: 'block', mt: 0.5 }}>
            Par : {username}
          </Typography>
        )}
        {user && comment && (
          <Typography variant="body2" sx={{ color: 'black', mt: 1 }}>
            {comment}
          </Typography>
        )}
      </Popup>
    </Marker>
  );
} 