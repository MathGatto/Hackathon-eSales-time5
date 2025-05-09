import React, { useRef, useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sku, setSku] = useState("");
  const [imgName, setImgName] = useState("");
  const [distancia, setDistancia] = useState(null);
  const [erro, setErro] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    setErro("");
    setSku("");
    setImgName("");
    setDistancia(null);
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch("http://localhost:8000/upload-image/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.erro) {
        setErro(data.erro);
      } else {
        setSku(data.sku);
        setImgName(data.img_name);
        setDistancia(data.distancia);
      }
    } catch (e) {
      setErro("Erro ao conectar com o backend.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Identificador de SKU</h2>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {preview && (
        <div>
          <img src={preview} alt="preview" style={{ width: "100%", marginTop: 10 }} />
        </div>
      )}
      <button onClick={handleUpload} style={{ marginTop: 20 }}>
        Enviar
      </button>
      {erro && (
        <div style={{ marginTop: 20, color: 'red' }}>
          <strong>Erro:</strong> {erro}
        </div>
      )}
      {sku && (
        <div style={{ marginTop: 20, background: '#f5f5f5', padding: 10, borderRadius: 8 }}>
          <strong>SKU identificado:</strong> {sku}<br />
          <strong>Nome da imagem de referência:</strong> {imgName}<br />
          <strong>Distância (similaridade):</strong> {distancia !== null ? distancia.toFixed(4) : "-"}
        </div>
      )}
    </div>
  );
}

export default App;
