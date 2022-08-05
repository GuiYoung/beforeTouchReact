import axios from "axios"

export function CheckLocation(okData){
    axios.post(`http://localhost:9001/api/v1/info/checkLocation`,okData).then(function (resp){console.log(resp)})
}

