import React, { useState } from 'react';
import { RoleContext } from './contexts';
import { ShowAppDialogContext } from './contexts';

export function RoleContextProvider(props) {
    const [role, setRole] = useState('Tenant');
    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {props.children}
        </RoleContext.Provider>
    );
}

export function ShowAppDialogContextProvider(props) {
    const [showAppDialog, setShowAppDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showCardDialog, setShowCardDialog] = useState(false);
    const [viewId, setViewId] = useState(0);
    const [jobCard, setJobCard] = useState({});
    const [credit, setCredit] = useState({});
    const [invoice, setInvoice] = useState({});
    const [delivery, setDelivery] = useState({});
    const [deducableFromSelect, setDeducableFromSelect] = useState({});
    const [advancedSelectValue, setAdvancedSelectValue] = useState("");
    const [uploadedImage, setUploadedImage] = useState("");
    const [uploadedThumbUrl, setUploadedThumbUrl] = useState("");

    const handleShowAppDialog = (value) => {
        if (value === undefined) {
            setShowAppDialog(!showAppDialog);
            setShowEditDialog(false)
        } else {
            setShowAppDialog(value);
            setShowEditDialog(false)
        }
    };
    const handleEditDialog = (value) => {
        if (value === undefined) {
            setShowEditDialog(!showEditDialog)
        } else {
            setShowEditDialog(value);
        }
    };
    const handleCardDialog = (value) => {
        if (value === undefined) {
            setShowCardDialog(!showCardDialog)
        } else {
            setShowCardDialog(value);
        }
    };
    return (
        <ShowAppDialogContext.Provider value={{ deducableFromSelect, setDeducableFromSelect, jobCard, setJobCard, showAppDialog, handleShowAppDialog, showCardDialog, handleCardDialog, credit, setCredit, delivery, setDelivery, advancedSelectValue, setAdvancedSelectValue, invoice, setInvoice, viewId, setViewId, showEditDialog, handleEditDialog, uploadedImage, setUploadedImage, uploadedThumbUrl, setUploadedThumbUrl }}>
            {props.children}
        </ShowAppDialogContext.Provider>
    );
}

