import React, {useEffect, useState} from "react";
import axios from "axios";

export default function SiteId(props) {
    const [cmp, setCmp] = useState([]);
    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/Logs").then((apId) => {
            setCmp(apId.data.info)
        })
    }, [props]);


    return (
        <>
            {props.dv ? <>
                    <option>Select {"LogsType"}</option>
                    {cmp.map((val, index) => {
                        if (val.Id === props.dv.Id) {
                            return <option key={index} selected value={val.Id}>{val.Id + " -- " + val.Name}</option>;
                        } else {
                            return <option key={index} value={val.Id}>{val.Id + " -- " + val.Name}</option>;
                        }
                    })}
                </> :

                <>
                    <option selected>Select {"LogsType"}</option>
                    {cmp.map((val, index) => {
                        return <option key={index} value={val.Id}>{val.Id + " -- " + val.Name}</option>;
                    })}
                </>
                }

            </>)
            }