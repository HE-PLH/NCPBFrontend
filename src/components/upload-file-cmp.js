import React, {Component, useContext, useEffect, useState} from "react";
import UploadService from "../utils/upload-image-service";
import {IKContext, IKImage, IKUpload} from "imagekitio-react";
import {ShowAppDialogContext} from "./contexts/contexts";
import {Box, Card, Grid, Container, Typography, Avatar, Stack, Button} from '@mui/material';
import pCloudSdk from 'pcloud-sdk-js';

export default function UploadFile (props) {

    var access_token = false;
    var locationid = "";
    var client = false;
  const {uploadedImage, setUploadedImage, setUploadedThumbUrl} = useContext(ShowAppDialogContext);


  const clicked = ()=>{
      if (!client) {
        console.error('no token, click the button to get token.');
        pCloudSdk.oauth.initOauthToken({
        client_id: 'ywTpPR68Sz5',
        client_secret: '5Dhf71NSFTyquuMmlq89ShbLkjb7',
        redirect_uri: 'https://NCPB.netlify.app',
        receiveToken: function(token, id) {
          console.log(token, id);
          access_token = token;
          locationid = id || 1;
          client = pCloudSdk.createClient(token);
          client.remoteupload(el('urls').value, 0, {
        onBegin: function() {
          console.log('Upload started.');
        },
        onProgress: function(progress) {
          console.log(progress);
        },
        onFinish: function(uploadData) {
          console.log(uploadData);
        }
      });
        }
      });
      }


  }

    useEffect(()=>{
        // console.log(props.dv);
        /*setUploadedThumbUrl(props.dv.ThumbUrl);
        setUploadedImage(props.dv.Image);*/
    }, [props.dv]);

    return (
        <Button variant="contained" onClick={(e) => clicked(e)}>Add Item</Button>
    )
}

