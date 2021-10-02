import React from "react";
import {Button} from "shards-react";

export default function Notifications(){

  const host = process.env.HOST_MONITOREO || '127.0.0.1'
  const port = process.env.PORT_MONITOREO || ':3000'

  return (
    
    
        <Button size="sm" theme="white" onClick={()=>{window.open(`http://${host}${port}`)}}>
            <i className="material-icons">assessment</i> Monitoreo
        </Button>
  );

}