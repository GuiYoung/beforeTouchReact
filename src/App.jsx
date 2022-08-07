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
    {value:'hospital',label:'hospital'},
    {value: 'hotel', label: 'hotel'},
    {value: 'shop', label: 'shop'}
]


function DataArea({venueType}){
    const selectedOptionRef = useRef(options[0]);
    const unitNameRef = useRef("");
    function handleUnitNameChange(e){
        okData.unit_name = e.target.value
    }

    function handleVenueTypeChange(e){
        selectedOptionRef.current = e.value
        okData.venueType = e.value
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
                axios.get('/beforetouchapi/uploadInfo', {
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
             <Select
                defaultValue={selectedOptionRef.current}
                onChange={handleVenueTypeChange}
                options={options}
            />
        </>
    );
}

export default function APP(){
    const [showData,setShowData] = useState(true)

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



    resp = (
        <>
            {!showData && <DataArea />}

            {showData && <button onClick={handleUploadClick}>upload</button>}
            {!showData && <button onClick={handleOKClick}>OK</button>}
            {!showData && <button onClick={handleNotOKClick}>NotOK</button>}
        </>
    );
    return resp;
}
