import axios from "axios"

export function CheckLocation(okData){
    axios.post(`http://101.42.247.103:9001/api/v1/info/checkLocation`,okData).then(function (resp){console.log(resp)})
}

