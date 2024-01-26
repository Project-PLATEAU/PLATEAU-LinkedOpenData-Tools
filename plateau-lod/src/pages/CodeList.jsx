import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import logo from "../assets/logo.webp";

function downloadFile(content, fileName) {
  const element = document.createElement("a");
  const file = new Blob([content], {
    type: "text/plain",
  });
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element); // ダウンロードリンクをDOMに追加
  element.click(); // プログラム的にリンクをクリックしてダウンロードを実行
  document.body.removeChild(element); // 使用後にリンクを削除
}

const Codelist = () => {
  const [fileContent, setFileContent] = useState("");

  const params = useParams();
  // /src/assets/codelist/xxxxx.ttl
  const filepath = "/codelist/" + params.id + ".ttl";
  const exfilename = params.id + ".ttl";

  useEffect(() => {
    async function fetchData(filepath) {
      const response = await fetch(filepath);

      // .then(res => res.text())
      // .then(content => setFileContent(content))

      if (response.ok) {
        response.text().then((content) => {
          setFileContent(content);
          downloadFile(content, exfilename);
        });

        // const content = response.text()
        // setFileContent(content)
        // downloadFile(content, "example.txt")
      } else {
        setFileContent("Error");
      }
    }

    fetchData(filepath);
  }, [exfilename, filepath]);

  if (fileContent === "Error") {
    return (
      <main className="c-main document">
        <div className="logo">
          <img src={logo} alt="Logo:PLATEAU by MLIT" className="logo__image" />
        </div>

        <div className="c-main__result document__body">
          <h1>Error</h1>
          <pre>The file not found</pre>
        </div>
      </main>
    );
  } else {
    return (
      <main className="c-main document">
        <div className="logo">
          <img src={logo} alt="Logo:PLATEAU by MLIT" className="logo__image" />
        </div>

        <div className="c-main__result document__body">
          <h1>{params.id}</h1>
          <pre>{fileContent}</pre>
        </div>
      </main>
    );
  }
};

export default Codelist;
