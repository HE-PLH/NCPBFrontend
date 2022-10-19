import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Watermark.propTypes = {
  sx: PropTypes.object
};

export default function Watermark({ sx }) {
  return (
    <RouterLink to="/">
      <Box component="img" src="/static/logo.png" sx={{ position: "absolute", opacity: 0.4, width: 400, height: 30, ...sx }} />
    </RouterLink>
  );
}
