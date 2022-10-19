import React, {useContext, useEffect, useState} from 'react';
import Select from 'react-select';
import Creatable, {useCreatable} from 'react-select/creatable';
import axios from "axios";
import {ShowAppDialogContext} from "../components/contexts/contexts";


export default function AdvancedSearchComponent(props) {
    const [defaultValue, setDefaultValue] = useState({});
    const {advancedSelectValue, setAdvancedSelectValue, setDeducableFromSelect} = useContext(ShowAppDialogContext);
    useEffect(() => {
        if (props.dv && props.options) {
            let temp = props.options.filter(option =>
                option.label === props.dv);
            if (temp.length) {
                setDefaultValue({label: temp[0]["label"], value: temp[0]["label"]});
                setAdvancedSelectValue({label: temp[0]["label"], value: temp[0]["label"]});
            }
        }
    }, [props]);

    const renderValue = (value) => {
      let form_data = {Name: value.label};
      if (!props.options.find((obj) => obj.label === value.label)) {
        axios.post("http://127.0.0.1:9000/api/items", [form_data]).then((response) => {
            console.log(response.data.info);
        });
      }else{
          /*axios.get("http://127.0.0.1:9000/api/getAvailableStocks?Description="+value.label ).then((response) => {
            console.log(response.data.info);
            setDeducableFromSelect(response.data.info[0]);
        });*/
      }
    };


    return (
        <>
            <Creatable
                className={"_select"}
                options={props.options}
                onChange={e => {
                    setDefaultValue({label: e.label, value: e.label})
                  renderValue({label: e.label, value: e.label})
                    setAdvancedSelectValue({label: e.label, value: e.label})
                }}
                value={defaultValue}
            />
        </>

    )
}