import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiCamera, FiCheckCircle, FiAlertTriangle, FiRefreshCw, FiInfo, FiClock, FiList, FiBarChart2 } from "react-icons/fi";

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
    maxWidth: "600px",
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    maxWidth: "500px"
  },
  previewImage: {
    width: "100%",
    height: "250px",
    objectFit: "contain",
    backgroundColor: (isDark) => isDark ? "#374151" : "#fff",
    border: (isDark) => `1px solid ${isDark ? "#6b7280" : "#d1d5db"}`,
    padding: "8px"
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
    marginBottom: "1rem",
    position: "relative"
  },
  processingTime: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    right: 0,
    fontSize: "0.75rem",
    color: "#9ca3af"
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
  referenceImageContainer: {
    marginTop: "1rem",
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem"
  },
  referenceImage: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "contain",
    borderRadius: "0.375rem",
    border: "1px solid #e5e7eb"
  },
  referenceImageLabel: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "0.25rem"
  },
  comparisonContainer: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    marginBottom: "1rem"
  },
  imageColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  imageTitle: {
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    textAlign: "center"
  },
  comparisonImage: {
    width: "100%",
    height: "150px",
    objectFit: "contain",
    borderRadius: "0.375rem",
    border: "1px solid #e5e7eb"
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
    color: value < 30 ? "#10b981" : value < 50 ? "#f59e0b" : value < 70 ? "#f97316" : "#ef4444",
    fontWeight: "500"
  }),
  matchQualityContainer: {
    display: "flex",
    alignItems: "center"
  },
  actionButtons: {
    display: "flex",
    marginTop: "1.25rem"
  },
  detailedView: {
    marginTop: "1.5rem",
    borderTop: "1px solid",
    borderTopColor: (isDark) => isDark ? "#374151" : "#e5e7eb",
    paddingTop: "1.25rem"
  },
  sectionTitle: (isDark) => ({
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    color: isDark ? "#fff" : "#111827",
    display: "flex",
    alignItems: "center"
  }),
  descriptionSection: {
    marginBottom: "1.5rem"
  },
  descriptionText: (isDark) => ({
    fontSize: "0.875rem",
    lineHeight: "1.5",
    color: isDark ? "#d1d5db" : "#4b5563",
    whiteSpace: "pre-line"
  }),
  similarProductsSection: {
    marginBottom: "1rem"
  },
  similarProductsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },
  similarProductItem: (isDark) => ({
    padding: "0.75rem",
    borderRadius: "0.375rem",
    backgroundColor: isDark ? "#1f2937" : "#f9fafb",
    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
    marginBottom: "0.5rem"
  }),
  similarProductHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
    alignItems: "center"
  },
  similarProductSku: {
    fontWeight: "500",
    fontSize: "0.875rem"
  },
  similarProductImage: {
    width: "100%",
    height: "120px",
    objectFit: "contain",
    borderRadius: "0.25rem",
    marginTop: "0.5rem",
    backgroundColor: "#f3f4f6"
  },
  similarProductDistance: (value) => ({
    color: value < 10 ? "#10b981" : value < 30 ? "#f59e0b" : "#ef4444",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center"
  }),
  similarProductName: {
    fontSize: "0.875rem",
    color: "#6b7280"
  },
  historyContainer: (isDark) => ({
    marginTop: "2rem",
    padding: "1.25rem",
    borderRadius: "0.5rem",
    backgroundColor: isDark ? "#1f2937" : "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`
  }),
  historyHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem"
  },
  historyTitle: (isDark) => ({
    fontSize: "1.125rem",
    fontWeight: "600",
    color: isDark ? "#fff" : "#111827"
  }),
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },
  historyItem: (isDark) => ({
    display: "flex",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    backgroundColor: isDark ? "#111827" : "#f9fafb",
    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`
  }),
  historyItemPreview: {
    width: "60px",
    height: "60px",
    borderRadius: "0.25rem",
    overflow: "hidden",
    marginRight: "0.75rem",
    flexShrink: 0
  },
  historyItemImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  historyItemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  historyItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.25rem"
  },
  historyItemSku: {
    fontWeight: "500",
    fontSize: "0.875rem"
  },
  historyItemTime: {
    fontSize: "0.75rem",
    color: "#9ca3af"
  },
  historyItemProduct: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "0.25rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  historyItemQuality: {
    display: "flex",
    alignItems: "center"
  },
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
  const [produto, setProduto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [produtosSimilares, setProdutosSimilares] = useState([]);
  const [processamentoMs, setProcessamentoMs] = useState(null);
  const [historicoBuscas, setHistoricoBuscas] = useState([]);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Carrega o modo escuro das preferências do usuário
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      // Verifica se o usuário prefere o tema escuro no sistema
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);

  // Salva o modo escuro nas preferências do usuário
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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
      setProduto("");
      setDescricao("");
      setProdutosSimilares([]);
      setProcessamentoMs(null);
      setShowDetailedView(false);
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
    setProduto("");
    setDescricao("");
    setProdutosSimilares([]);
    setProcessamentoMs(null);
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
        // Atualiza os estados com os dados recebidos
        setSku(data.sku);
        setImgName(data.img_name);
        setDistancia(data.distancia);
        setProduto(data.produto || "");
        setDescricao(data.descricao || "");
        setProdutosSimilares(data.produtos_similares || []);
        setProcessamentoMs(data.processamento_ms || null);
        
        // Adiciona ao histórico de buscas
        const novaBusca = {
          id: Date.now(),
          sku: data.sku,
          produto: data.produto || "",
          distancia: data.distancia,
          timestamp: new Date().toLocaleTimeString(),
          preview: preview
        };
        
        setHistoricoBuscas(prev => {
          // Mantém apenas as 5 buscas mais recentes
          const novoHistorico = [novaBusca, ...prev].slice(0, 5);
          return novoHistorico;
        });
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
    setProduto("");
    setDescricao("");
    setProdutosSimilares([]);
    setProcessamentoMs(null);
    setShowDetailedView(false);
  };
  
  // Função para alternar entre visão resumida e detalhada
  const toggleDetailView = () => {
    setShowDetailedView(!showDetailedView);
  };
  
  // Função para classificar a qualidade da correspondência
  const getMatchQuality = (distance) => {
    if (distance < 10) return { text: "Excelente", color: "#10b981", emoji: "✅" };
    if (distance < 30) return { text: "Razoável", color: "#f59e0b", emoji: "⚠️" };
    return { text: "Não Aderente", color: "#ef4444", emoji: "❌" };
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
              
              {processamentoMs && (
                <div style={styles.processingTime}>
                  <FiClock size={14} style={{ marginRight: '4px' }} />
                  <span>{processamentoMs}ms</span>
                </div>
              )}
            </div>
            
            <div style={styles.resultContent}>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel(darkMode)}>SKU:</span>
                <span style={styles.resultValue(darkMode)}>{sku}</span>
              </div>
              
              {produto && (
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel(darkMode)}>Produto:</span>
                  <span style={styles.resultValue(darkMode)}>{produto}</span>
                </div>
              )}
              
              <div style={styles.resultRow}>
                <span style={styles.resultLabel(darkMode)}>Correspondência:</span>
                <span style={styles.resultValue(darkMode)}>
                  {distancia !== null ? (
                    <div style={styles.matchQualityContainer}>
                      <span style={styles.similarityValue(distancia)}>
                        {distancia.toFixed(2)}
                      </span>
                      <span style={{
                        marginLeft: '8px',
                        color: getMatchQuality(distancia).color,
                        fontWeight: '600',
                        fontSize: '1rem',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        backgroundColor: `${getMatchQuality(distancia).color}20`,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{ marginRight: '6px', fontSize: '1.25rem' }}>{getMatchQuality(distancia).emoji}</span>
                        {getMatchQuality(distancia).text}
                      </span>
                    </div>
                  ) : "-"}
                </span>
              </div>
              
              {/* Imagem de referência do SKU */}
              {imgName && (
                <div style={styles.comparisonContainer}>
                  <div style={styles.imageColumn}>
                    <div style={styles.imageTitle}>Sua imagem</div>
                    <img 
                      src={preview} 
                      alt="Imagem enviada" 
                      style={styles.comparisonImage} 
                    />
                  </div>
                  <div style={styles.imageColumn}>
                    <div style={styles.imageTitle}>Imagem de referência</div>
                    <img 
                      src={`http://localhost:8000/reference-image/${imgName}`} 
                      alt="Imagem de referência" 
                      style={styles.comparisonImage} 
                    />
                  </div>
                </div>
              )}
              
              <div style={styles.actionButtons}>
                <button 
                  onClick={toggleDetailView}
                  style={{...styles.button(darkMode, false, false), marginRight: '8px', flex: 1}}
                >
                  <FiInfo style={{ marginRight: '0.5rem' }} />
                  {showDetailedView ? "Ver resumo" : "Ver detalhes"}
                </button>
                
                <button 
                  onClick={resetForm}
                  style={{...styles.button(darkMode, false, false), flex: 1}}
                >
                  <FiRefreshCw style={{ marginRight: '0.5rem' }} />
                  Nova busca
                </button>
              </div>
            </div>
            
            {/* Visão detalhada */}
            {showDetailedView && (
              <div style={styles.detailedView}>
                {descricao && (
                  <div style={styles.descriptionSection}>
                    <h4 style={styles.sectionTitle(darkMode)}>Descrição</h4>
                    <p style={styles.descriptionText(darkMode)}>{descricao}</p>
                  </div>
                )}
                
                {produtosSimilares && produtosSimilares.length > 0 && (
                  <div style={styles.similarProductsSection}>
                    <h4 style={styles.sectionTitle(darkMode)}>
                      <FiBarChart2 style={{ marginRight: '0.5rem' }} />
                      Produtos similares
                    </h4>
                    <div style={styles.similarProductsList}>
                      {produtosSimilares.map((produto, index) => (
                        <div key={index} style={styles.similarProductItem(darkMode)}>
                          <div style={styles.similarProductHeader}>
                            <span style={styles.similarProductSku}>{produto.sku}</span>
                            <span style={{
                              ...styles.similarProductDistance(produto.distancia),
                              backgroundColor: `${getMatchQuality(produto.distancia).color}15`,
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}>
                              <span style={{ marginRight: '4px', fontSize: '1rem' }}>
                                {produto.distancia < 10 ? "✅" : produto.distancia < 30 ? "⚠️" : "❌"}
                              </span>
                              <span style={{ marginRight: '4px' }}>{produto.distancia.toFixed(2)}</span>
                              <span style={{ fontSize: '0.7rem' }}>({getMatchQuality(produto.distancia).text})</span>
                            </span>
                          </div>
                          <p style={styles.similarProductName}>{produto.produto}</p>
                          {produto.img_name && (
                            <img 
                              src={`http://localhost:8000/reference-image/${produto.img_name}`} 
                              alt={`Imagem de ${produto.sku}`} 
                              style={styles.similarProductImage} 
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Histórico de buscas */}
        {historicoBuscas.length > 0 && !preview && (
          <div style={styles.historyContainer(darkMode)}>
            <div style={styles.historyHeader}>
              <FiList style={{ marginRight: '0.5rem' }} />
              <h3 style={styles.historyTitle(darkMode)}>Histórico de buscas</h3>
            </div>
            
            <div style={styles.historyList}>
              {historicoBuscas.map((busca) => (
                <div key={busca.id} style={styles.historyItem(darkMode)}>
                  <div style={styles.historyItemPreview}>
                    <img 
                      src={busca.preview} 
                      alt="Imagem" 
                      style={styles.historyItemImage} 
                    />
                  </div>
                  <div style={styles.historyItemInfo}>
                    <div style={styles.historyItemHeader}>
                      <span style={styles.historyItemSku}>{busca.sku}</span>
                      <span style={styles.historyItemTime}>{busca.timestamp}</span>
                    </div>
                    <p style={styles.historyItemProduct}>{busca.produto}</p>
                    <div style={styles.historyItemQuality}>
                      <span style={styles.similarityValue(busca.distancia)}>
                        {busca.distancia.toFixed(2)}
                      </span>
                      <span style={{
                        marginLeft: '8px',
                        color: getMatchQuality(busca.distancia).color,
                        fontSize: '0.75rem'
                      }}>
                        {getMatchQuality(busca.distancia).text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
