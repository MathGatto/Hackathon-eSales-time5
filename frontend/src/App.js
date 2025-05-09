import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiCamera, FiCheckCircle, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

// Estilos para garantir que a interface seja moderna
const styles = {
  container: (isDark) => ({
    minHeight: "100vh",
    backgroundColor: isDark ? "#1a202c" : "#f9fafb",
    color: isDark ? "#fff" : "#111827",
    transition: "background-color 0.3s, color 0.3s",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  }),
  innerContainer: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "2rem 1rem"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem"
  },
  logo: {
    height: "60px",
    maxWidth: "100%"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center"
  },
  title: (isDark) => ({
    fontSize: "1.75rem",
    fontWeight: "bold",
    color: isDark ? "#fff" : "#111827"
  }),
  themeToggle: (isDark) => ({
    padding: "0.5rem",
    borderRadius: "9999px",
    backgroundColor: "transparent",
    cursor: "pointer",
    border: "none",
    fontSize: "1.25rem",
    transition: "background-color 0.2s",
    ':hover': {
      backgroundColor: isDark ? "#374151" : "#e5e7eb"
    }
  }),
  dropzone: (isDark, isDragActive) => ({
    border: `2px dashed ${isDragActive ? "#3b82f6" : isDark ? "#4b5563" : "#d1d5db"}`,
    borderRadius: "0.5rem",
    padding: "2rem",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: isDragActive ? (isDark ? "rgba(37, 99, 235, 0.1)" : "rgba(219, 234, 254, 0.8)") : "transparent",
    transition: "border-color 0.2s, background-color 0.2s",
    color: isDark ? "#9ca3af" : "#6b7280"
  }),
  iconContainer: {
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "center"
  },
  icon: (isDark) => ({
    width: "3rem",
    height: "3rem",
    color: isDark ? "#9ca3af" : "#6b7280"
  }),
  dropzoneText: {
    fontSize: "1.125rem",
    marginBottom: "0.5rem"
  },
  dropzoneSubtext: {
    fontSize: "0.875rem",
    marginBottom: "1rem"
  },
  button: (isDark, isPrimary, isDisabled) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: isPrimary ? "0.75rem 1.5rem" : "0.5rem 1rem",
    borderRadius: "0.375rem",
    fontWeight: "500",
    backgroundColor: isDisabled ? "#9ca3af" : isPrimary ? "#3b82f6" : isDark ? "#374151" : "#e5e7eb",
    color: isPrimary ? "#fff" : isDark ? "#e5e7eb" : "#111827",
    cursor: isDisabled ? "not-allowed" : "pointer",
    border: "none",
    transition: "background-color 0.2s",
    width: isPrimary === "full" ? "100%" : "auto",
    ':hover': {
      backgroundColor: isDisabled ? "#9ca3af" : isPrimary ? "#2563eb" : isDark ? "#4b5563" : "#d1d5db"
    }
  }),
  previewContainer: {
    marginBottom: "1.5rem"
  },
  previewImageContainer: {
    position: "relative",
    borderRadius: "0.5rem",
    overflow: "hidden",
    border: (isDark) => `1px solid ${isDark ? "#4b5563" : "#e5e7eb"}`,
  },
  previewImage: {
    width: "100%",
    height: "250px",
    objectFit: "contain",
    backgroundColor: (isDark) => isDark ? "#374151" : "#fff"
  },
  resetButton: (isDark) => ({
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    padding: "0.5rem",
    borderRadius: "9999px",
    backgroundColor: isDark ? "#374151" : "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "none",
    cursor: "pointer",
    color: isDark ? "#e5e7eb" : "#4b5563",
    transition: "background-color 0.2s",
    ':hover': {
      backgroundColor: isDark ? "#4b5563" : "#f3f4f6"
    }
  }),
  spinner: {
    display: "flex",
    justifyContent: "center",
    margin: "1.5rem 0"
  },
  spinnerInner: {
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px",
    borderTop: "2px solid #3b82f6",
    borderRight: "2px solid transparent",
    borderBottom: "2px solid #3b82f6",
    borderLeft: "2px solid transparent",
    animation: "spin 1s linear infinite"
  },
  errorContainer: (isDark) => ({
    marginTop: "1.5rem",
    padding: "1rem",
    borderRadius: "0.375rem",
    backgroundColor: isDark ? "rgba(220, 38, 38, 0.1)" : "#fee2e2",
    border: `1px solid ${isDark ? "#b91c1c" : "#fca5a5"}`,
    color: isDark ? "#fca5a5" : "#b91c1c"
  }),
  errorContent: {
    display: "flex",
    alignItems: "center"
  },
  resultContainer: (isDark) => ({
    marginTop: "1.5rem",
    padding: "1.25rem",
    borderRadius: "0.5rem",
    backgroundColor: isDark ? "#1f2937" : "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`
  }),
  resultHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem"
  },
  resultTitle: (isDark) => ({
    fontSize: "1.125rem",
    fontWeight: "600",
    marginLeft: "0.5rem",
    color: isDark ? "#fff" : "#111827"
  }),
  resultContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },
  resultRow: {
    display: "flex"
  },
  resultLabel: (isDark) => ({
    width: "33%",
    color: isDark ? "#9ca3af" : "#6b7280"
  }),
  resultValue: (isDark) => ({
    width: "67%",
    fontWeight: "500",
    color: isDark ? "#fff" : "#111827",
    wordBreak: "break-all"
  }),
  similarityValue: (value) => ({
    color: value < 30 ? "#10b981" : value < 50 ? "#f59e0b" : "#ef4444",
    fontWeight: "500"
  }),
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
};

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sku, setSku] = useState("");
  const [imgName, setImgName] = useState("");
  const [distancia, setDistancia] = useState(null);
  const [erro, setErro] = useState("");
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Função para lidar com o drag & drop
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      // Limpar resultados anteriores
      setSku("");
      setImgName("");
      setDistancia(null);
      setErro("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    // Limpar resultados anteriores
    setErro("");
    setSku("");
    setImgName("");
    setDistancia(null);
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
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
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setSku("");
    setImgName("");
    setDistancia(null);
    setErro("");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Adiciona estilos globais para animação do spinner
  if (!document.getElementById('spinnerStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'spinnerStyles';
    styleSheet.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  return (
    <div style={styles.container(darkMode)}>
      <div style={styles.innerContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img 
              src={darkMode ? "/images/logo-white.svg" : "/images/logo.svg"} 
              alt="SKU RECON" 
              style={styles.logo} 
            />
          </div>
          <button 
            onClick={toggleDarkMode}
            style={styles.themeToggle(darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Upload Area */}
        {!preview ? (
          <div 
            {...getRootProps()} 
            style={styles.dropzone(darkMode, isDragActive)}
          >
            <input {...getInputProps()} />
            <div style={styles.iconContainer}>
              <FiUpload style={styles.icon(darkMode)} />
            </div>
            <p style={styles.dropzoneText}>Arraste uma imagem aqui</p>
            <p style={styles.dropzoneSubtext}>ou</p>
            <button style={styles.button(darkMode, true, false)}>
              <FiCamera style={{ marginRight: '0.5rem' }} />
              Escolher arquivo
            </button>
          </div>
        ) : (
          <div style={styles.previewContainer}>
            {/* Preview da imagem */}
            <div style={styles.previewImageContainer}>
              <img 
                src={preview} 
                alt="Preview" 
                style={styles.previewImage}
              />
              <button 
                onClick={resetForm}
                style={styles.resetButton(darkMode)}
                title="Nova busca"
              >
                <FiRefreshCw />
              </button>
            </div>

            {/* Botão de envio */}
            <button 
              onClick={handleUpload} 
              disabled={isProcessing}
              style={styles.button(darkMode, "full", isProcessing)}
            >
              {isProcessing ? 'Processando...' : 'Identificar SKU'}
            </button>
          </div>
        )}

        {/* Spinner durante processamento */}
        {isProcessing && (
          <div style={styles.spinner}>
            <div style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "9999px",
              borderTop: "2px solid #3b82f6",
              borderRight: "2px solid transparent",
              borderBottom: "2px solid #3b82f6",
              borderLeft: "2px solid transparent",
              animation: "spin 1s linear infinite"
            }}></div>
          </div>
        )}

        {/* Mensagem de erro */}
        {erro && (
          <div style={styles.errorContainer(darkMode)}>
            <div style={styles.errorContent}>
              <FiAlertTriangle style={{ marginRight: '0.5rem' }} />
              <span>{erro}</span>
            </div>
          </div>
        )}

        {/* Resultado */}
        {sku && (
          <div style={styles.resultContainer(darkMode)}>
            <div style={styles.resultHeader}>
              <FiCheckCircle style={{ color: '#10b981' }} />
              <h3 style={styles.resultTitle(darkMode)}>Resultado</h3>
            </div>
            
            <div style={styles.resultContent}>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel(darkMode)}>SKU:</span>
                <span style={styles.resultValue(darkMode)}>{sku}</span>
              </div>
              
              <div style={styles.resultRow}>
                <span style={styles.resultLabel(darkMode)}>Imagem ref:</span>
                <span style={styles.resultValue(darkMode)}>{imgName}</span>
              </div>
              
              <div style={styles.resultRow}>
                <span style={styles.resultLabel(darkMode)}>Similaridade:</span>
                <span style={styles.resultValue(darkMode)}>
                  {distancia !== null ? (
                    <span style={styles.similarityValue(distancia)}>
                      {distancia.toFixed(2)}
                    </span>
                  ) : "-"}
                </span>
              </div>
            </div>
            
            <button 
              onClick={resetForm}
              style={{...styles.button(darkMode, false, false), marginTop: '1.25rem', width: '100%'}}
            >
              <FiRefreshCw style={{ marginRight: '0.5rem' }} />
              Nova busca
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
