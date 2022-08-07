import axios from "axios"

export function CheckLocation(okData){
    axios.post(`/beforetouchapi/checkLocation`,okData).then(function (resp){console.log(resp)})
}

