import axios from "axios"

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

export async function GetIP(){
    let ip
    await axios.get(`http://ip-api.com/json`).then(function (resp){
        ip=resp.data.query
    }).catch(function (error){
        console.log(error)
    })
    return ip
}

export function CheckLocation(okData){
    axios.post(`http://localhost:9001/api/v1/info/checkLocation`,okData).then(function (resp){console.log(resp)})
}

