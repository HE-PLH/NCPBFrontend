import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { LoginForm } from '../sections/authentication/login';
import AuthSocial from '../sections/authentication/AuthSocial';
import Products from './../pages/Products';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Home() {
  return (
    <RootStyle title="Login | NCPB">
      <AuthLayout>
        Don’t have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          Get started
        </Link>
      </AuthLayout>
      <SectionStyle sx={{ display: { xs: 'none', md: 'block', background: 'url(https://ik.imagekit.io/patricode/apartment-home1_6MylssVJG.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1649269938189)', backgroundSize: '100% 100%' } }}>
        <img src="https://ik.imagekit.io/patricode/apartment-home2_6sL6GXsw7.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1650102818810" alt="login" />
        <img src="https://ik.imagekit.io/patricode/apartment-home_qInCNFuL0.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1649269364763" alt="login" />
        <img src="https://ik.imagekit.io/patricode/apartment-home3_jH6UAnLF1.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1650102817775" alt="login" />
      </SectionStyle>

      <Card>
        <Typography variant="h3" sx={{ mb: 5, marginLeft: 2 }}>
         Rent Management System</Typography>
      <Products/>
      </Card>
      {/*<Box ml={1} mr={1} maxWidth="sm">
        <ContentStyle>

          <Typography
            variant="subtitle1"
            align="left"
            sx={{
              mt: 3,
              display: { sm: 'none' }
            }}
          >
            Don’t have an account?&nbsp;
            <Link variant="subtitle2" component={RouterLink} to="register" underline="hover">
              Get started
            </Link>
          </Typography>
        </ContentStyle>
      </Box>*/}
    </RootStyle>
  );
}
