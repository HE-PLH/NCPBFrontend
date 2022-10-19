import { faker } from '@faker-js/faker';
import PropTypes from 'prop-types';
// material
import { Box, Grid, Card, Paper, Typography, CardHeader, CardContent } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// component
import Iconify from '../../../components/Iconify';
import {useEffect, useState} from "react";
import axios from "axios";

// ----------------------------------------------------------------------

const SOCIALS = [
  {
    name: 'Invoice',
    items: [{"Name":"Paid", value: "60"}, {"Name":"Not Paid", value: "50"}],
    icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} height={32} />
  },
  {
    name: 'Google',
    items: [{"Name":"Paid", value: "60"}, {"Name":"Not Paid", value: "50"}],
    value: faker.datatype.number(),
    icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} height={32} />
  },
  {
    name: 'Linkedin',
    items: [{"Name":"Paid", value: "60"}, {"Name":"Not Paid", value: "50"}],
    value: faker.datatype.number(),
    icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} height={32} />
  },
  {
    name: 'Twitter',
    items: [{"Name":"Paid", value: "60"}, {"Name":"Not Paid", value: "50"}],
    value: faker.datatype.number(),
    icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} height={32} />
  }
];

// ----------------------------------------------------------------------

SiteItem.propTypes = {
  site: PropTypes.object
};

function SiteItem({ site }) {
  const { icon, value, name, items } = site;

  return (
    <Grid  item xs={12} sm={6} md={3}>
      <Box sx={{ mb: 0.5, display: "flex", alignItems: "center" }}>{icon}<Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {name}
        </Typography></Box>
      <Paper variant="outlined" sx={{ display: "flex", flexDirection: "column" }}>
        <ul>
          {items.map((_item)=>{
            return (
                <li><Box><Typography variant="body2" sx={{ color: 'text.secondary' }}>{_item.Name}: {_item.Value}</Typography></Box></li>
            )
          })}
        </ul>
      </Paper>
    </Grid>
  );
}

export default function SingleReportItem(props) {
  const [displayItems, setDisplayItems] = useState([]);

  useEffect(()=>{
    props.dates.startDate?
    axios.post("http://127.0.0.1:9000/api/getGeneralTableReport", {
                Start_date: (props.dates.startDate).toLocaleDateString(),
                End_date: (props.dates.endDate).toLocaleDateString()
            }).then((response)=>{

              let final = [];
      for (let i in response.data.info) {
        let temp={};
        temp.name = i;
        temp.items = response.data.info[i];
        final.push(temp);
      }
      console.log(final)
              setDisplayItems(final)
    }):""

  }, [props.dates]);

  return (
    <Card>
      <CardHeader title="Table Reports" />
      <CardContent>
        <Grid container spacing={2}>
          {displayItems.map((site) => (
            <SiteItem key={site.name} site={site} />
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
