import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import {Avatar, Box, Button, Card, CardHeader, Grid, Link, Stack, Typography} from '@mui/material';
//
import { BaseOptionChart } from '../../../components/charts';
import Label from "../../../components/Label";
import {Link as RouterLink} from "react-router-dom";
import ColorPreview from "../../../components/ColorPreview";
import {fCurrency} from "../../../utils/formatNumber";
import React, {useEffect, useState} from "react";
import ShopProductCard from "../products/ProductCard";
import axios from "axios";

// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

const CHART_DATA = [
  { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
  { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
  { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] }
];

export default function AppCurrentSubject(props) {
  const [house, setHouse] = useState({});

  useEffect(()=>{
    axios.get(`https://rent-app-master.herokuapp.com/api/houses?Id=${props.HouseId}`)
            .then((response) => {
                setHouse(response.data.info[0])
            })
  }, [props.HouseId]);

  return (
    <Card>
      <CardHeader title="Current House" />
      <ShopProductCard product={house?house:{}}/>
    </Card>
  );
}
