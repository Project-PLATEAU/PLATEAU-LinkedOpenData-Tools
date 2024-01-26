import logo from "../assets/logo.webp";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main id="main" className="home">
      <div className="logo">
        <img src={logo} alt="Logo:PLATEAU by MLIT" className="logo__image" />
      </div>
      <h1 className="title">PLATEAU Linked Open Data</h1>
      <Link to="/about" className="link-button">
        What&apos;s PLATEAU Linked Open Data
      </Link>
    </main>
  );
};

export default Home;
