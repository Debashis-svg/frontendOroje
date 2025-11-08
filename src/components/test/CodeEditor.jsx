import React from "react";
import Editor from "@monaco-editor/react";
import Spinner from "../common/Spinner";

export default function CodeEditor({ code, setCode, language }) {
  const mapLanguage = (lang) => {
    switch (lang) {
      case "python":
        return "python";
      case "java":
        return "java";
      case "javascript":
        return "javascript";
      case "cpp":
      default:
        return "cpp";
    }
  };

  const monacoLanguage = mapLanguage(language);

  return (
    <div className="bg-gray-800 rounded-md border border-gray-700 overflow-hidden flex flex-col flex-grow">
      <div className="p-2 bg-gray-700 text-gray-300 text-sm border-b border-gray-600">
        Language: {language.toUpperCase()}
      </div>
      <Editor
        height="500px"
        language={monacoLanguage}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
        loading={<Spinner />}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
