import { useFormik } from 'formik';
import {useEffect, useState} from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../sections/@dashboard/products';
//
import PRODUCTS from '../_mocks_/products';
import axios from "axios";
import {getRole, getUser} from "../utils/common";

// ----------------------------------------------------------------------

export default function DisplayProjects() {
  const [listUpdate, setList] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);

  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => {
      setOpenFilter(false);
    }
  });

  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };

  useEffect(() => {

        if (getRole()==="Super Admin") {
            axios.get("http://127.0.0.1:9000/api/projects/").then((response) => {
                console.log(response.data.info)
                setList(response.data.info);
            })
        }
    }, []);

  return (
    <Page title="Dashboard: Display Projects | NCPB">
      <Box ml={1} mr={1}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Current Projects
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={listUpdate} />
        <ProductCartWidget />
      </Box>
    </Page>
  );
}
