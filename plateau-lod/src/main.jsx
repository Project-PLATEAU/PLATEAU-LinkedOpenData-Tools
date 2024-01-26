import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App_v2.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Datamodel from "./pages/DataModel.jsx";
import Codelists from "./pages/CodeLists.jsx";
import Sparql from "./pages/Sparql.jsx";
import Codelist from "./pages/CodeList.jsx";

import "./index.css";
import AppHeader from "./components/AppHeader.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <AppHeader />
    <Routes>
      <Route path={`/`} element={<Home />} />
      <Route path={`/view/:id`} element={<App />} />
      <Route path={`/about`} element={<About />} />
      <Route path={`/datamodel`} element={<Datamodel />} />
      <Route path={`/codelists/`} element={<Codelists />} />
      <Route path={`/SPARQL`} element={<Sparql />} />
      <Route path={`/codelist/:id`} element={<Codelist />} />
    </Routes>
  </BrowserRouter>
);
