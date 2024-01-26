import {useState} from "react";
import {Link} from "react-router-dom";

const AppHeader = () => {
  const [isOpen, setIsOpen] = useState(false)

  const mobileMenuHandle = (() => {
    setIsOpen(!isOpen)
  })
  return (
    <header className="header">
      <Link to="/" className="header__link">PLATEAU as Linked Open Data</Link>

      <button
        onClick={mobileMenuHandle}
        type="button"
        className={isOpen ? 'header__hamburger show' : 'header__hamburger'}
        aria-controls="navigation"
        aria-haspopup="menu">
        <span/>
        <span/>
        <span/>
      </button>
      <nav
        id="navigation"
        className={isOpen ? 'header__navigation show' : 'header__navigation'}
        aria-label="グローバルメニュー">
        <Link to="/about" className="header__navigation__link">About PLATEAU Linked Open Data</Link>
        <Link to="/datamodel" className="header__navigation__link">Data Model</Link>
        <Link to="/codelists/" className="header__navigation__link">Code List</Link>
        <Link to="/sparql/" className="header__navigation__link">How to use SPARQL</Link>
        <Link to="http://3.115.24.167:8890/sparql" className="header__navigation__link">SPARQL Query Service</Link>
      </nav>
    </header>
  )
}

export default AppHeader
