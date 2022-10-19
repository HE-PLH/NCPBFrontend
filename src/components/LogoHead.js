import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

LogoHead.propTypes = {
  sx: PropTypes.object
};

export default function LogoHead({ sx }) {
  return (
    <RouterLink to="/">
      <Box component="img" className={"logohead"} src="/static/ncpb_logo.jpg" sx={{ width:200, height: 30, ...sx }} />
    </RouterLink>
  );
}
