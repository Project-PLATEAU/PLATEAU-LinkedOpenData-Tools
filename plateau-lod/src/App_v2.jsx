import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';
import { useParams } from 'react-router-dom';
import logo from './assets/logo.webp';

import PredicateBox from "./components/predicate-box.jsx";
import ContextList from "./components/context-list.jsx";


const App = () => {
    
    const [bldgData, setBldgData] = useState({})
    const [canDisplayMap, setCanDisplayMap] = useState(false)
    const [center, setCenter] = useState({})
    const [paths, setPaths] = useState([])
    
    const params = useParams();

    const container = {
        width: "100%",
        height: "200px"
    };
    
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAP_KEY,
    });
    
    const mapOptionsUnZoom = {
        fullscreenControl: false,
        mapTypeControl: false,
        mapType: 'terrain',
        streetViewControl: false,
        zoomControl: false,
        gestureHandling: 'greedy',
    };
    
    const polyOpt = {
        fillOpacity: 0.3,
        strokeOpacity: 1,
        strokeWeight: 1,
        draggable: false,
        geodesic: false,
        editable: false,
        zIndex: 1,
        fillColor: 'yellow',
        strokeColor: 'orange',
    }

    // LOD0を取得している
    const getPaths = (foots) => {
        
        const cordinateArray = foots.split(", ")
        
        const path = []
        cordinateArray.forEach(elm => {
            // { lat: lat, lng: lng}
            path.push({ lat: Number(elm.split(' ')[0]),lng:  Number(elm.split(' ')[1])})
        })
        return path
    }
    
    // 建物の中央座標
    const getCenter = (cordinate) => {
        return {lat: cordinate['schema:latitude']['@value'], lng: cordinate['schema:longitude']['@value']}
    }

    // 建物データ取得
    const getBuildingById = async (gmlId) => {
        // const id = gmlId.replace('#realEstateID', '')
        // const jsonPath = "../samplejson-ld/bldg_7b561f02-8a48-40b4-87fe-268b6a2f2ecb.jsonld"
        const jsonPath = import.meta.env.VITE_PROXY + '/resource/' + gmlId
        
        // console.log(jsonPath)
        try {
            const res = await axios.get(jsonPath, {
            headers: {'Accept': 'application/json'},
            data: {}
            })
            return res.data
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const getBuilding = async () => {
            await getBuildingById(params.id).then((data) => {
                setBldgData((data))
            })
        }
        getBuilding();
    }, [params.id]);
    
    useEffect(() => {
        
        if (bldgData['schema:geo']) {
            setCanDisplayMap(bldgData['schema:geo'] || bldgData['schema:geo']);
            setCenter(getCenter(bldgData['schema:geo']))
            
        }
        if (bldgData["pv:loof0FootPrint"]) {
            const paths = getPaths(bldgData["pv:loof0FootPrint"])
            setPaths(paths)
        }
    
    },[bldgData])

    ///////////////////
    // html template //
    ///////////////////
    
    return (
        <main className="c-main resource">
        <div className="logo">
            <img src={ logo } alt="Logo:PLATEAU by MLIT" className="logo__image"/>
        </div>

        <div id="result" className="c-main__result">
            { bldgData && Object.keys(bldgData).length > 0 ?
                <div>
                    <p className="icon">{bldgData['@type']}</p>
                    <h1 className="title">{bldgData['@id']}</h1>
                    
                    
                    { isLoaded && canDisplayMap && (
                        <div className="map">
                            <GoogleMap
                                mapContainerStyle={container}
                                center={{ lat: center.lat, lng: center.lng}}
                                zoom={19}
                                options={mapOptionsUnZoom}
                            >
                                <Polygon
                                paths={paths}
                                options={polyOpt}
                                />
                            </GoogleMap>
                        </div>
                    )}
                    
                    
                    <div className="data-section">
                        {bldgData['@context'] && 
                        <div className="context-section">
                            <h2>PREFIX</h2>
                            <div><ContextList context={bldgData['@context']} /></div>
                        </div>
                        }
                        <>
                            {Object.keys(bldgData).map((item, index) => (
                                <PredicateBox key={index} predicate={item} value={bldgData[item]} context={bldgData['@context']} />
                            ))}
                        </>
                    </div>
                </div>
                :
                <div className="loading">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>loading</title>
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                    </svg>
                </div>
            }
        </div>
        </main>
    )
}

export default App
