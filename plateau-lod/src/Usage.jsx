import './App.css'
import logo from './assets/logo.webp';

const Usage = () => {
  return (
    <main className="c-main document">
      <div className="logo">
        <img src={ logo } alt="Logo:PLATEAU by MLIT" className="logo__image"/>
      </div>

      <div className="c-main__result document__body">
        <h1>Usage</h1>
        <h2>H2 Level Caption</h2>
        <h3>H3 Level Caption</h3>
        <h4>H4 Level Caption</h4>
        <h5>H5 Level Caption</h5>
        <h6>H6 Level Caption</h6>

        <p>
          Tim Berners-Lee, the inventor of the Web and Linked Data initiator, suggested a 5-star deployment scheme for Open Data. Here, we give examples for each step of the stars and explain costs and benefits that come along with it.
        </p>
        <p>
          Webの発明者でありLinked Dataの創始者でもある
          <a href="https://www.w3.org/People/Berners-Lee/card#i">ティム・バーナーズ＝リー</a>
          は，オープンデータのための
          <a href="https://www.w3.org/DesignIssues/LinkedData.html">5つ星スキーム</a>
          を提案しています．ここでは，各段階の星の例と，それに伴うコストや利益について説明します．
        </p>

        <ul>
          <li>List item</li>
          <li>
            <a href="/hogehoge">List item</a>
          </li>
          <li>
            <a href="">Link Item</a>
          </li>
          <li><a href="https://info-lounge.jp/">High Light</a></li>
        </ul>

        <figure>
          <pre>
{`
PREFIX schema: <http://schema.org/>
PREFIX pv: <https://lod.geospatial.jp/vocabulary#>
PREFIX bldg: <https://lod.geospatial.jp/vocabulary/citygml/bldg#>

SELECT distinct ?building
WHERE {
    ?building a <https://lod.geospatial.jp/vocabulary#Building> ;
    pv:realEstateID/pv:landRealEstateID "4703001114477-0000-3" .
} LIMIT 100
`}
        </pre>
          <figcaption>fig.01 sample query</figcaption>
        </figure>

        <table>
          <thead>
          <tr>
            <th>TH table header</th>
            <th>TH table header</th>
            <th>TH table header</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th>TD table data</th>
            <td>TD table data</td>
            <td>TD table data</td>
          </tr>
          <tr>
            <th>TD table data</th>
            <td>TD table data</td>
            <td>TD table data</td>
          </tr>
          <tr>
            <th>TD table data</th>
            <td>TD table data</td>
            <td>TD table data</td>
          </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Usage
