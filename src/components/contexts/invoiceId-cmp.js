import React, {useEffect, useState} from "react";
import axios from "axios";

export default function InvoiceId(props) {
    const [cmp, setCmp] = useState([]);
    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/invoice").then((apId) => {
            setCmp(apId.data.info)
        })
    }, [props]);


    return (
        <>
            {props.dv ? <>
                    <option>Select {"InvoiceId"}</option>
                    {cmp.map((val, index) => {
                        if (val.Id === props.dv.Id) {
                            return <option key={index} selected value={val.Id}>{val.Id + " -- " + val.LPONumber + " -- " + val.Date}</option>;
                        } else {
                            return <option key={index} value={val.Id}>{val.Id + " -- " + val.LPONumber + " -- " + val.Date}</option>;
                        }
                    })}
                </> :

                <>
                    <option selected>Select {"InvoiceId"}</option>
                    {cmp.map((val, index) => {
                        return <option key={index} value={val.Id}>{val.Id + " -- " + val.LPONumber + " -- " + val.Date}</option>;
                    })}
                </>
                }

            </>)
            }