import PropTypes from 'prop-types';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// material
import {Box, Card, Link, Typography, Stack, Avatar, Button} from '@mui/material';
import {styled} from '@mui/material/styles';
// utils
import {fCurrency} from '../../../utils/formatNumber';
//
import Label from '../../../components/Label';
import ColorPreview from '../../../components/ColorPreview';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {getToken} from "../../../utils/common";

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'Image',
    position: 'absolute',
    transition: 'transform .4s ease-in-out',
    '&:hover': {
        transform: "scale(1.5)"
    },
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
    product: PropTypes.object
};

export default function ShopProductCard({product}) {
    const navigate = useNavigate();
    // const { Name, Image, price, colors, status, priceSale } = product;
    const {Id, Name, Type, SiteId, Description, Price, Status, Image} = product;

    const [site, setSite] = useState([]);

    useEffect(() => {
        console.log(product)
        axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${SiteId}`)
            .then((response) => {
                setSite(response.data.info[0])
            })
    }, []);

    const houseClick = (e) => {
        getToken() ? navigate(`/listings/${Name}/${Id}`) : navigate(`/register`);
        console.log(product, site);
    };
    return (
        <Card>
            <Box sx={{pt: '100%', position: 'relative', overflow: 'hidden'}}>
                {Status && (
                    <Label
                        variant="filled"
                        color={(Status === 'Inactive' && 'error') || 'info'}
                        sx={{
                            zIndex: 9,
                            top: 16,
                            right: 16,
                            position: 'absolute',
                            textTransform: 'uppercase'
                        }}
                    >
                        {Status}
                    </Label>
                )}
                <ProductImgStyle onClick={houseClick} alt={Name} src={Image}/>
            </Box>

            <Stack spacing={1} sx={{p: 1}}>
                <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                        {Name}
                    </Typography>
                </Link>

                <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {site ?
                                <>
                                <Avatar alt={Type} src={site.ThumbUrl || ""}/>
                                <Typography variant="subtitle2" noWrap>
                                    {`${site.Name}, ${site.Location}`}
                                </Typography>
                                </>:null
                            }

                        </Stack>
                    </Typography>
                </Link>
                <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                        {Description}
                    </Typography>
                </Link>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <ColorPreview colors={[[
                        "#00AB55",
                        "#000000",
                        "#FFFFFF",
                        "#FFC0CB",
                        "#FF4842",
                        "#1890FF",
                        "#94D82D",
                        "#FFC107"
                    ]]}/>
                    <Typography variant="subtitle1">

                        &nbsp;
                        {fCurrency(Price)}
                    </Typography>
                </Stack>
            </Stack>
        </Card>
);
}
