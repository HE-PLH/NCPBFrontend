import React, {useEffect, useState} from "react";
import Methods from "../utils/utilities";


export default function RegisterUserForm(props) {

  const [editing, setEditing] = useState(false);
  const [fieldList, setFieldList] = useState([]);
  const [elements, setElements] = useState([]);

  useEffect(() => {
     setFieldList(props.tableHead);
      console.log(props.defaultObject);
     setElements(Methods.getFields(props.tableHead, props.defaultObject))
  }, [props]);

  return (
    <div className="register-user-form">
        {elements.map(el=>el)}
    </div>
  );
}