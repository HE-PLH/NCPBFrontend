import React, {useEffect, useState} from "react";
import axios from "axios";
import AdvancedSearchComponent from "../../pages/advanced-select-master";

export default function SuppliesItemName(props) {
    const [cmp, setCmp] = useState([]);
    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/items").then((apId) => {
            let temp = apId.data.info;
            for (let i = 0; i < temp.length; i++) {
                temp[i].label = temp[i].Name;
            }
            setCmp(temp)
        })
    }, [props]);


    return (
        <>
            <AdvancedSearchComponent setCMP={setCmp} options={cmp} dv={props.dv?props.dv.Name:""}/>
            </>)
            }



            /*
            * {props.dv ? <>
                    <option>Select {"Name"}</option>
                    {cmp.map((val, index) => {
                        if (val.Name === props.dv.Name) {
                            return <option key={index} selected value={val.Id}>{val.Id + " -- " + val.Name}</option>;
                        } else {
                            return <option key={index} value={val.Id}>{val.Id + " -- " + val.Name}</option>;
                        }
                    })}
                </> :

                <>
                    <option selected>Select {"Name"}</option>
                    {cmp.map((val, index) => {
                        return <option key={index} value={val.Id}>{val.Id + " -- " + val.Name}</option>;
                    })}
                </>
                }
            * */