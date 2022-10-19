import React, {useEffect, useState} from "react";
import axios from "axios";

const edittedUsers = (tbh) => {
        return tbh.filter((item) => {
            return item.Role !== "Super Admin"
        })
    };


export default function UserId(props) {
    const [cmp, setCmp] = useState([]);
    useEffect(() => {

        axios.get("http://127.0.0.1:9000/api/all-users").then((apId) => {
            console.log(apId.data.info)
            setCmp(edittedUsers(apId.data.info))
        })
    }, [props]);


    return (
        <>
            {props.dv ? <>
                    <option>Select {"User"}</option>
                    {cmp.map((val, index) => {
                        if (val.Id === props.dv.Id) {
                            return <option key={index} selected value={val.Id}>{val.Id + " -- "+ val.FirstName+" "+val.LastName}</option>;
                        } else {
                            return <option key={index} value={val.Id}>{val.Id + " -- "+ val.FirstName+" "+val.LastName}</option>;
                        }
                    })}
                </> :
                <>
                    <option selected>Select {"User"}</option>
                    {cmp.map((val, index) => {
                        return <option key={index} value={val.Id}>{val.Id + " -- "+ val.FirstName+" "+val.LastName}</option>;
                    })}
                </>
                }

            </>
    )
}