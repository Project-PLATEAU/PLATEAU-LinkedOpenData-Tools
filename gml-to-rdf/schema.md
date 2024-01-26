# pv:Building

## Objects

- [`bldg:Class`](#reference-bldgclass)
- [`bldg:MeasuredHeight`](#reference-bldgmeasuredheight)
- [`pv:center`](#reference-pvcenter)
- [`pv:location`](#reference-pvlocation)
- [`pv:realEstateID`](#reference-pvrealestateid)
- [`schema:Identifier`](#reference-schemaidentifier)
- [`uro:BuildingDataQualityAttribute`](#reference-urobuildingdataqualityattribute)
- [`uro:BuildingDetailAttribute`](#reference-urobuildingdetailattribute)
- [`uro:BuildingDisasterRiskAttribute`](#reference-urobuildingdisasterriskattribute)
- [`uro:BuildingIDAttribute`](#reference-urobuildingidattribute)
- [`pv:Building`](#reference-welcome) (root object)

---

<a name="reference-bldgclass"></a>

### bldg:Class

**`bldg:Class` Properties**

|         | Type     | Description            | Required     |
| ------- | -------- | ---------------------- | ------------ |
| **@id** | `string` | 建物オブジェクトの URI | &#10003; Yes |

Additional properties are not allowed.

#### bldg:Class.@id

- **Type**: `string`
- **Required**: &#10003; Yes
- **Format**: uri

---

<a name="reference-bldgmeasuredheight"></a>

### bldg:MeasuredHeight

**`bldg:MeasuredHeight` Properties**

|                     | Type     | Description | Required     |
| ------------------- | -------- | ----------- | ------------ |
| **@type**           | `string` |             | &#10003; Yes |
| **schema:unitCode** | `string` |             | &#10003; Yes |
| **schema:value**    | `number` |             | &#10003; Yes |

Additional properties are not allowed.

#### bldg:MeasuredHeight.@type

- **Type**: `string`
- **Required**: &#10003; Yes

#### bldg:MeasuredHeight.schema:unitCode

- **Type**: `string`
- **Required**: &#10003; Yes

#### bldg:MeasuredHeight.schema:value

- **Type**: `number`
- **Required**: &#10003; Yes

---

<a name="reference-pvcenter"></a>

### pv:center

**`pv:center` Properties**

|                      | Type     | Description | Required     |
| -------------------- | -------- | ----------- | ------------ |
| **@type**            | `string` |             | &#10003; Yes |
| **schema:latitude**  | `number` |             | &#10003; Yes |
| **schema:longitude** | `number` |             | &#10003; Yes |
| **schema:elevation** | `number` |             | &#10003; Yes |

Additional properties are not allowed.

#### pv:center.@type

- **Type**: `string`
- **Required**: &#10003; Yes

#### pv:center.schema:latitude

- **Type**: `number`
- **Required**: &#10003; Yes

#### pv:center.schema:longitude

- **Type**: `number`
- **Required**: &#10003; Yes

#### pv:center.schema:elevation

- **Type**: `number`
- **Required**: &#10003; Yes

---

<a name="reference-pvlocation"></a>

### pv:location

**`pv:location` Properties**

|                         | Type     | Description | Required     |
| ----------------------- | -------- | ----------- | ------------ |
| **@type**               | `string` |             | &#10003; Yes |
| **pv:standardAreaCode** | `string` |             | &#10003; Yes |
| **schema:address**      | `string` |             | &#10003; Yes |

Additional properties are not allowed.

#### pv:location.@type

- **Type**: `string`
- **Required**: &#10003; Yes

#### pv:location.pv:standardAreaCode

- **Type**: `string`
- **Required**: &#10003; Yes

#### pv:location.schema:address

- **Type**: `string`
- **Required**: &#10003; Yes

---

<a name="reference-pvrealestateid"></a>

### pv:realEstateID

**`pv:realEstateID` Properties**

|                             | Type          | Description          | Required     |
| --------------------------- | ------------- | -------------------- | ------------ |
| **@type**                   | `string`      |                      | &#10003; Yes |
| **@id**                     | `string`      | 不動産 ID の URI     | &#10003; Yes |
| **pv:buildingRealEstateID** | `string`      | 建物不動産 ID        | &#10003; Yes |
| **pv:landRealEstateNumber** | `integer`     | 土地不動産 ID の個数 | &#10003; Yes |
| **pv:landRealEstateID**     | `string` `[]` | 土地不動産 ID        | &#10003; Yes |

Additional properties are not allowed.

#### pv:realEstateID.@type

- **Type**: `string`
- **Required**: &#10003; Yes

#### pv:realEstateID.@id

- **Type**: `string`
- **Required**: &#10003; Yes

#### pv:realEstateID.pv:buildingRealEstateID

- **Type**: `string`
- **Required**: &#10003; Yes

#### pv:realEstateID.pv:landRealEstateNumber

- **Type**: `integer`
- **Required**: &#10003; Yes

#### pv:realEstateID.pv:landRealEstateID

- **Type**: `string` `[]`
- **Required**: &#10003; Yes

---

<a name="reference-schemaidentifier"></a>

### schema:Identifier

**`schema:Identifier` Properties**

|                  | Type     | Description         | Required     |
| ---------------- | -------- | ------------------- | ------------ |
| **@type**        | `string` |                     | &#10003; Yes |
| **schema:name**  | `string` | ID の体系を表す名称 | &#10003; Yes |
| **schema:value** | `string` | 値                  | &#10003; Yes |

Additional properties are not allowed.

#### schema:Identifier.@type

- **Type**: `string`
- **Required**: &#10003; Yes

#### schema:Identifier.schema:name

- **Type**: `string`
- **Required**: &#10003; Yes

#### schema:Identifier.schema:value

- **Type**: `string`
- **Required**: &#10003; Yes

---

<a name="reference-urobuildingdataqualityattribute"></a>

### uro:BuildingDataQualityAttribute

**`uro:BuildingDataQualityAttribute` Properties**

|                         | Type         | Description | Required     |
| ----------------------- | ------------ | ----------- | ------------ |
| **@type**               | `string`     |             | &#10003; Yes |
| **uro:srcScale**        | `bldg:Class` |             | &#10003; Yes |
| **uro:geometrySrcDesc** | `bldg:Class` |             | &#10003; Yes |
| **uro:thematicSrcDesc** | `bldg:Class` |             | &#10003; Yes |
| **uro:lod1HeightType**  | `bldg:Class` |             | &#10003; Yes |

Additional properties are not allowed.

#### uro:BuildingDataQualityAttribute.@type

- **Type**: `string`
- **Required**: &#10003; Yes

#### uro:BuildingDataQualityAttribute.uro:srcScale

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

#### uro:BuildingDataQualityAttribute.uro:geometrySrcDesc

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

#### uro:BuildingDataQualityAttribute.uro:thematicSrcDesc

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

#### uro:BuildingDataQualityAttribute.uro:lod1HeightType

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

---

<a name="reference-urobuildingdetailattribute"></a>

### uro:BuildingDetailAttribute

**`uro:BuildingDetailAttribute` Properties**

|                    | Type         | Description | Required     |
| ------------------ | ------------ | ----------- | ------------ |
| **@type**          | `string`     |             | &#10003; Yes |
| **uro:orgUsage**   | `bldg:Class` |             | &#10003; Yes |
| **uro:surveyYear** | `integer`    |             | &#10003; Yes |

Additional properties are not allowed.

#### uro:BuildingDetailAttribute.@type

- **Type**: `string`
- **Required**: &#10003; Yes

#### uro:BuildingDetailAttribute.uro:orgUsage

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

#### uro:BuildingDetailAttribute.uro:surveyYear

- **Type**: `integer`
- **Required**: &#10003; Yes

---

<a name="reference-urobuildingdisasterriskattribute"></a>

### uro:BuildingDisasterRiskAttribute

**`uro:BuildingDisasterRiskAttribute` Properties**

|                     | Type         | Description | Required     |
| ------------------- | ------------ | ----------- | ------------ |
| **@type**           | `string`     |             | &#10003; Yes |
| **uro:description** | `bldg:Class` |             | &#10003; Yes |
| **uro:adminType**   | `bldg:Class` |             | &#10003; Yes |
| **uro:scale**       | `bldg:Class` |             | &#10003; Yes |

Additional properties are not allowed.

#### uro:BuildingDisasterRiskAttribute.@type

- **Type**: `string`
- **Required**: &#10003; Yes

#### uro:BuildingDisasterRiskAttribute.uro:description

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

#### uro:BuildingDisasterRiskAttribute.uro:adminType

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

#### uro:BuildingDisasterRiskAttribute.uro:scale

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

---

<a name="reference-urobuildingidattribute"></a>

### uro:BuildingIDAttribute

**`uro:BuildingIDAttribute` Properties**

|                    | Type         | Description | Required     |
| ------------------ | ------------ | ----------- | ------------ |
| **@type**          | `string`     |             | &#10003; Yes |
| **uro:buildingID** | `string`     |             | &#10003; Yes |
| **uro:prefecture** | `bldg:Class` |             | &#10003; Yes |
| **uro:city**       | `bldg:Class` |             | &#10003; Yes |

Additional properties are not allowed.

#### uro:BuildingIDAttribute.@type

- **Type**: `string`
- **Required**: &#10003; Yes

#### uro:BuildingIDAttribute.uro:buildingID

- **Type**: `string`
- **Required**: &#10003; Yes

#### uro:BuildingIDAttribute.uro:prefecture

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

#### uro:BuildingIDAttribute.uro:city

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

---

<a name="reference-welcome"></a>

### pv:Building

**`pv:Building` Properties**

|                                       | Type                                     | Description                               | Required     |
| ------------------------------------- | ---------------------------------------- | ----------------------------------------- | ------------ |
| **@type**                             | `string`                                 | 建物オブジェクトであることを示す          | &#10003; Yes |
| **@id**                               | `string`                                 | 建物オブジェクトの URI                    | &#10003; Yes |
| **core:creationDate**                 | `string`                                 |                                           | &#10003; Yes |
| **bldg:class**                        | `bldg:Class`                             |                                           | &#10003; Yes |
| **bldg:usage**                        | `bldg:Class`                             |                                           | &#10003; Yes |
| **bldg:yearOfConstruction**           | `integer`                                |                                           | &#10003; Yes |
| **bldg:measuredHeight**               | `bldg:MeasuredHeight`                    |                                           | &#10003; Yes |
| **bldg:storeysAboveGround**           | `integer`                                |                                           | &#10003; Yes |
| **bldg:storeysBelowGround**           | `integer`                                |                                           | &#10003; Yes |
| **uro:buildingDataQualityAttribute**  | `uro:BuildingDataQualityAttribute`       |                                           | &#10003; Yes |
| **uro:buildingDetailAttribute**       | `uro:BuildingDetailAttribute`            |                                           | &#10003; Yes |
| **uro:buildingDisasterRiskAttribute** | `uro:BuildingDisasterRiskAttribute` `[]` |                                           | &#10003; Yes |
| **uro:buildingIDAttribute**           | `uro:BuildingIDAttribute`                |                                           | &#10003; Yes |
| **pv:center**                         | `pv:center`                              | 建物オブジェクトの地図上での座標（WGS84） | &#10003; Yes |
| **pv:location**                       | `pv:location`                            | 建物オブジェクトの所在地                  | &#10003; Yes |
| **pv:lod0FootPrint**                  | `array` `[]`                             | 建物オブジェクトのルーフトップ形状        | &#10003; Yes |
| **schema:identifier**                 | `schema:Identifier`                      | 建物 ID                                   | &#10003; Yes |
| **pv:realEstateID**                   | `pv:realEstateID`                        | 不動産 ID                                 | &#10003; Yes |

Additional properties are not allowed.

#### pv:Building.@type

- **Type**: `string`
- **Required**: &#10003; Yes

#### pv:Building.@id

- **Type**: `string`
- **Required**: &#10003; Yes

#### pv:Building.core:creationDate

- **Type**: `string`
- **Required**: &#10003; Yes
- **Format**: date

#### pv:Building.bldg:class

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

#### pv:Building.bldg:usage

- **Type**: `bldg:Class`
- **Required**: &#10003; Yes

#### pv:Building.bldg:yearOfConstruction

- **Type**: `integer`
- **Required**: &#10003; Yes

#### pv:Building.bldg:measuredHeight

- **Type**: `bldg:MeasuredHeight`
- **Required**: &#10003; Yes

#### pv:Building.bldg:storeysAboveGround

- **Type**: `integer`
- **Required**: &#10003; Yes

#### pv:Building.bldg:storeysBelowGround

- **Type**: `integer`
- **Required**: &#10003; Yes

#### pv:Building.uro:buildingDataQualityAttribute

- **Type**: `uro:BuildingDataQualityAttribute`
- **Required**: &#10003; Yes

#### pv:Building.uro:buildingDetailAttribute

- **Type**: `uro:BuildingDetailAttribute`
- **Required**: &#10003; Yes

#### pv:Building.uro:buildingDisasterRiskAttribute

- **Type**: `uro:BuildingDisasterRiskAttribute` `[]`
- **Required**: &#10003; Yes

#### pv:Building.uro:buildingIDAttribute

- **Type**: `uro:BuildingIDAttribute`
- **Required**: &#10003; Yes

#### pv:Building.pv:center

- **Type**: `pv:center`
- **Required**: &#10003; Yesreal

#### pv:Building.pv:location

- **Type**: `pv:location`
- **Required**: &#10003; Yes

#### pv:Building.pv:lod0FootPrint

- **Type**: `array` `[]`
- **Required**: &#10003; Yes

#### pv:Building.schema:identifier

- **Type**: `schema:Identifier`
- **Required**: &#10003; Yes

#### pv:Building.pv:realEstateID

- **Type**: `pv:realEstateID`
- **Required**: &#10003; Yes
