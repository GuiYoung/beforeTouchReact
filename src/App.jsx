import {useState} from "react";
import {sculptureList} from "./data";
import {CheckLocation} from "./utils";
import axios from "axios";

// function CheckButton(){
//     function handleCheckClick(e){
//         CheckPostion
//     }
// }

let okData;


function DataArea(){
    const [data,setData] = useState("");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let latitude = position.coords.latitude
                let longitude = position.coords.longitude
                console.log(latitude)
                console.log(longitude)
                console.log(position.coords.accuracy)
                axios.get('http://localhost:9001/api/v1/info/uploadInfo', {
                    params: {
                        latitude: latitude,
                        longitude: longitude,
                    }
                }).then(function (resp){
                    let wr = resp.data
                    setData(JSON.stringify(wr))
                    okData={}
                    okData.city=wr.addrInfo.city
                    okData.direction=wr.addrInfo.direction
                    okData.distance=wr.addrInfo.distance
                    okData.district=wr.addrInfo.district
                    okData.province=wr.addrInfo.province
                    okData.street=wr.addrInfo.street
                    okData.street_number=wr.addrInfo.street_number
                    okData.ip=wr.addrInfo.ip
                    okData.latitude=latitude
                    okData.longitude=longitude
                    okData.unit_name=wr.addrInfo.unit_name
                }).catch()
            }, function (error){console.log({"error":error})},{enableHighAccuracy: true})
        } else {
            console.log('你的浏览器不支持当前地理位置信息获取')
        }
    return (
        <>
            <ul >{data}</ul>
        </>
    );
}

export default function APP(){
    const [showData,setShowData] = useState(true)
    function handleUploadClick(e){
        setShowData(!showData)
    }
    function handleOKClick(e){
        setShowData(!showData)
        okData.isValid = true
        CheckLocation(okData)
    }
    function handleNotOKClick(e){
        setShowData(!showData)
        okData.isValid = false
        CheckLocation(okData)
    }

    return (
        <>
            {showData && <button onClick={handleUploadClick}>upload</button>}
            {!showData && <DataArea/>}
            {!showData && <button onClick={handleOKClick}>OK</button>}
            {!showData && <button onClick={handleNotOKClick}>NotOK</button>}
        </>
    )
}
