import logo from "../assets/logo.webp";
import MarkdownViewer from "../components/MarkdownViewer.jsx";

function Codelists() {
  return (
    <main className="c-main document">
      <div className="logo">
        <img src={logo} alt="Logo:PLATEAU by MLIT" className="logo__image" />
      </div>

      <div className="c-main__result document__body">
        <MarkdownViewer filepath="/md/codelists.md" />
      </div>
    </main>
  );
}

export default Codelists;
