import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';
import { useParams } from 'react-router-dom';
import logo from './assets/logo.webp';

const App = () => {
  const [dataType, setDataType] = useState('')
  const [bldgData, setBldgData] = useState({})
  const [buildingId, setBuildingId] = useState('')
  const [measuredHeight, setMeasuredHeight] = useState({})
  const [location, setLocation] = useState({})
  const [realEstate, setRealEstate] = useState({})
  const [surveyYear, setSurveyYear] = useState('')
  const [lod1HeightType, setLod1HeightType] = useState('')
  const [paths, setPaths] = useState([])
  const [center, setCenter] = useState({})
  const [canDisplayMap, setCanDisplayMap] = useState(false)
  const params = useParams();

  const getPaths = (foots) => {
    const path = []
    for (let i = 0; i < foots.length; i = i+ 3) {
      const lat = foots[i]
      const lng = foots[i+1]
      path.push({ lat: lat, lng: lng})
    }
    return path
  }

  const container = {
    width: "100%",
    height: "200px"
  };

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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAP_KEY,
  });

  const getBuildingById = async (gmlId) => {
    const id = gmlId.replace('#realEstateID', '')
    try {
      const res = await axios.get(import.meta.env.VITE_PROXY + '/resource/' + id, {
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
    // console.log(bldgData)
    setDataType(bldgData['@type'] || '')
    setBuildingId(bldgData['@id'] || '')
    if (bldgData['pv:measuredHeight']) {
      const mH = {
        '@type': bldgData['pv:measuredHeight']['@type'] || null,
        'schema:unitCode': bldgData['pv:measuredHeight']['schema:unitCode'] || null,
        'schema:value': bldgData['pv:measuredHeight']['schema:value'] || null
      }
      setMeasuredHeight(bldgData['pv:measuredHeight'] ? mH : null)
    }
    if (bldgData['pv:location']) {
      const loc = {
        '@type': bldgData['pv:location']['@type'] || null,
        'pv:standardAreaCode': bldgData['pv:location']['pv:standardAreaCode'] || null,
        'schema:address': bldgData['pv:location']['schema:address'] || null
      }
      setLocation(bldgData['pv:location'] ? loc : null)
    }
    if (bldgData['pv:realEstateID']) {
      const estate = {
        '@type': bldgData['pv:realEstateID']['@type'] || null,
        'pv:standardAreaCode': bldgData['pv:realEstateID']['pv:standardAreaCode'] || null,
        'schema:address': bldgData['pv:realEstateID']['schema:address'] || null
      }
      if (bldgData['pv:realEstateID']['pv:buildingRealEstateID']) {
        estate['pv:buildingRealEstateID'] = bldgData['pv:realEstateID']['pv:buildingRealEstateID']
        if (bldgData['pv:realEstateID']['pv:unitRealEstateNumber']) {
          estate['pv:unitRealEstateNumber'] = bldgData['pv:realEstateID']['pv:unitRealEstateNumber']
          estate['pv:unitRealEstate'] = bldgData['pv:realEstateID']['pv:unitRealEstate']
        }
        if (bldgData['pv:realEstateID']['pv:landRealEstateNumber']) {
          estate['pv:landRealEstateNumber'] = bldgData['pv:realEstateID']['pv:landRealEstateNumber']
          estate['pv:landRealEstateID'] = bldgData['pv:realEstateID']['pv:landRealEstateID']
        }
      }
      setRealEstate(bldgData['pv:realEstateID'] ? estate : null)
    }
    setSurveyYear(bldgData['pv:surveyYear'] || '')
    setLod1HeightType(bldgData['pv:lod1HeightType'] || '')
    setCenter(bldgData['schema:geo'] && bldgData['schema:geo']['schema:latitude'] && bldgData['schema:geo']['schema:longitude'] ?
      {lat: bldgData['schema:geo']['schema:latitude'], lng: bldgData['schema:geo']['schema:longitude']} :
      {lat: null, lng: null})
    setCanDisplayMap(bldgData['schema:geo'] || bldgData['schema:geo'])
    if (bldgData["pv:lod0RoofEdge"]) {
      const paths = getPaths(bldgData["pv:lod0RoofEdge"])
      setPaths(paths)
    }
  },[bldgData])

  let estate = null
  let unitEstate = null
  let unitEstateIds = null
  let landEstate = null
  let landEstateIds = null

  if (realEstate && realEstate['pv:unitRealEstateNumber']) {
    unitEstate = (
      <div className="data-section__content__inner">
        <p className="data-section__content__heading">pv:unitRealEstateNumber</p>
        <p className="data-section__content__data">{realEstate['pv:unitRealEstateNumber']}</p>
        {unitEstateIds}
      </div>
    )
    unitEstateIds = (
      <div className="data-section__content__inner">
        <p className="data-section__content__heading">pv:unitRealEstateID</p>
        <div className="data-section__content__data">
          {
            realEstate['pv:unitRealEstateID'].map((v, i) => {
              return (<p key={i}>{v}</p>)
            })
          }
        </div>
      </div>
    )
  }
  if (realEstate && realEstate['pv:landRealEstateNumber']) {
    landEstate = (
      <div className="data-section__content__inner">
        <p className="data-section__content__heading">pv:landRealEstateNumber</p>
        <p className="data-section__content__data">{realEstate['pv:landRealEstateNumber']}</p>
      </div>
    )
    landEstateIds = (
      <div className="data-section__content__inner">
        <p className="data-section__content__heading">pv:landRealEstateID</p>
        <div className="data-section__content__data">
          {
            realEstate['pv:landRealEstateID'].map((v, i) => {
              return (<p key={i}>{v}</p>)
            })
          }
        </div>
      </div>
    )
  }
  if (realEstate && realEstate['pv:buildingRealEstateID']) {
    estate = <div className="data-section__box">
      <p className="data-section__heading">pv:realEstateID</p>
      <div className="data-section__content">
        <p className="icon">{realEstate['@type']}</p>
        <div className="data-section__content__inner">
          <p className="data-section__content__heading">pv:buildingRealEstateID</p>
          <p className="data-section__content__data">{realEstate['pv:buildingRealEstateID']}</p>
        </div>
        {unitEstate}
        {unitEstateIds}
        {landEstate}
        {landEstateIds}
      </div>
    </div>
  }


  return (
    <main className="c-main resource">
      <div className="logo">
        <img src={ logo } alt="Logo:PLATEAU by MLIT" className="logo__image"/>
      </div>

      <div id="result" className="c-main__result">
      {bldgData && Object.keys(bldgData).length > 0 ?
        <div>
          <p className="icon">{dataType}</p>
          <h1 className="title">{buildingId}</h1>
          <div className="map">
            { isLoaded && canDisplayMap && (
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
            )}
          </div>
          <div className="data-section">
            <div className="data-section__box">
              <p className="data-section__heading">pv:measuredHeight</p>
              <div className="data-section__content">
                <p className="icon">{measuredHeight['@type']}</p>
                <div className="data-section__content__inner">
                  <p className="data-section__content__heading">pv:measuredHeight</p>
                  <p className="data-section__content__data">{measuredHeight['schema:unitCode']}</p>
                </div>
                <div className="data-section__content__inner">
                  <p className="data-section__content__heading">schema:value</p>
                  <p className="data-section__content__data">{measuredHeight['schema:value']}</p>
                </div>
              </div>
            </div>

            <div className="data-section__box">
              <p className="data-section__heading">pv:location</p>
              <div className="data-section__content">
                <p className="icon">{location['@type']}</p>
                <div className="data-section__content__inner">
                  <p className="data-section__content__heading">pv:standardAreaCode</p>
                  <p className="data-section__content__data">{location['pv:standardAreaCode']}</p>
                </div>
                <div className="data-section__content__inner">
                  <p className="data-section__content__heading">schema:address</p>
                  <p className="data-section__content__data">{location['schema:address']}</p>
                </div>
              </div>
            </div>

            {estate}

            <div className="data-section__box">
              <p className="data-section__heading no-border">pv:surveyYear</p>
              <p className="data-section__content">{surveyYear}</p>
            </div>

            <div className="data-section__box">
              <p className="data-section__heading no-border">pv:lod1HeightType</p>
              <p className="data-section__content">{lod1HeightType}</p>
            </div>
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
