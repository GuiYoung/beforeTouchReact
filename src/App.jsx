import {useState} from "react";
import {sculptureList} from "./data";
import {useRef} from "react";
import Select from 'react-select';
import {CheckLocation} from "./utils";
import axios from "axios";

let okData;

const options = [
    {value:'school',label:'school'},
    {value:'mall',label:'mall'},
    {value:'trafficHub',label:'trafficHub'},
    {value:'company',label:'company'},
]


function DataArea({venueType}){
    const unitNameRef = useRef("");
    function handleUnitNameChange(e){
        okData.unit_name = e.target.value
    }

    console.log(venueType)
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

                    unitNameRef.current = wr.addrInfo.unit_name
                    okData.unit_name = wr.addrInfo.unit_name

                    okData.venueType=venueType
                    console.log(unitNameRef.current)
                }).catch()
            }, function (error){console.log({"error":error})},{enableHighAccuracy: true})
        } else {
            console.log('你的浏览器不支持当前地理位置信息获取')
        }
    return (
        <>
            <ul >{data}</ul>
            <input id="unitNameInput" type="text" style={{width: '100%'}} defaultValue={unitNameRef.current} onChange={handleUnitNameChange}  />
        </>
    );
}

export default function APP(){
    const [showData,setShowData] = useState(true)
    const selectedOptionRef = useRef(options[0]);

    let resp = (
        <>
        </>
    );

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

    function handleVenueTypeChange(e){
        selectedOptionRef.current = e.value
    }

    resp = (
        <>
            {showData && <button onClick={handleUploadClick}>upload</button>}
            {!showData && <DataArea venueType={selectedOptionRef.current.value}/>}
            {!showData && <Select
                defaultValue={selectedOptionRef.current}
                onChange={handleVenueTypeChange}
                options={options}
            />}
            {!showData && <button onClick={handleOKClick}>OK</button>}
            {!showData && <button onClick={handleNotOKClick}>NotOK</button>}
        </>
    );
    return resp;
}
