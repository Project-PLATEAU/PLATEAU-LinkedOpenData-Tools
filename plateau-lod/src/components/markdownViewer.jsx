import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownViewer(props) {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(props.filepath)
      .then((response) => response.text())
      .then((text) => setMarkdown(text))
      .catch((error) => console.error("Error fetching markdown:", error));
  }, [props.filepath]);

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>;
}

// PropTypes を使用した型チェックの定義
MarkdownViewer.propTypes = {
  filepath: PropTypes.string.isRequired,
};

export default MarkdownViewer;
