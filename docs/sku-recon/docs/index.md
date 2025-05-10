# SKU Recon – Identificação de SKU via Imagem com IA

## Commands

Na operação logística, produtos sem etiquetas causam gargalos no reprocessamento, na redistribuição e no lançamento fiscal. A identificação manual é lenta, sujeita a erros e ineficiente em escala. Este MVP tem como objetivo criar uma solução que permita capturar ou fazer upload de uma imagem de um produto e, via IA, identificar automaticamente o SKU correspondente.

Além disso, a ferramenta poderá se integrar com o ERP/WMS da empresa para facilitar as etapas subsequentes da operação, como reprocessamento, redistribuição e lançamento fiscal. Pensando além, a mesma solução pode ser adaptada para identificar a quantidade de produtos em gôndolas de supermercado, auxiliando no controle de estoque e abastecimento.

## 🧰 Stack Utilizada

- Frontend: React + Tailwind CSS (portal web para upload/captura de imagem)
- Backend/IA: Python com TensorFlow (reconhecimento de imagem e extração de features)
- Biblioteca de Deep Learning: TensorFlow utilizando o modelo MobileNetV2
- Tratamento de Dados: Pandas (tratamento de DataFrames no backend)
- Orquestração: Windsurf (execução e comando via prompts de IA)
- Banco de Dados: Supabase (armazenamento de SKUs e logs de uso)
- Integrações: n8n (integração com Supabase e simulação de ERP/WMS)

##  🔄 Fluxo da Solução (Workflow)

1. Usuário acessa o portal (React) e faz o upload ou captura de uma imagem.
2. A imagem é enviada ao backend (Python), onde é processada por um script com TensorFlow.
3. O script utiliza a arquitetura MobileNetV2 para extrair automaticamente as features (características visuais) da imagem.
4. As features extraídas são comparadas com um banco de dados de imagens previamente treinadas.
5. O SKU Recon identifica a imagem mais similar com base no nível de similaridade entre as features.
6. O sistema retorna 3 informações ao frontend:
7. Número do SKU correspondente à imagem enviada
8. Nome do arquivo da imagem encontrada como mais similar
9. Nível de similaridade (de 0 a 100; quanto mais próximo de 0, mais similar é a imagem)
10. As informações são enviadas via webhook ao n8n.
11. O n8n busca informações adicionais no Supabase e envia os dados para um endpoint simulado do ERP/WMS.
12. O n8n registra um log da operação (SKU, status, data/hora) no Supabase.

## 🧠 Uso de IA

### Modelo Utilizado

- Modelo Base: MobileNetV2 (via TensorFlow)
- Entrada Esperada: Imagem RGB redimensionada para 224x224 pixels
- Saída: Vetor de features da imagem

### Processo de Identificação

- O script compara os vetores de features da imagem enviada com os vetores do banco treinado
- Calcula-se a similaridade entre os vetores
- Retorna o SKU da imagem com maior similaridade

### Resposta da API

- Número do SKU identificado
- Nome do arquivo da imagem correspondente
- Porcentagem de similaridade visual

## 🚧 Limitações e Próximos Passos

### Limitações

- Acurácia limitada pela quantidade e diversidade de imagens no banco de dados
- Comparação feita com base apenas em similaridade visual (não há validação semântica)
- Backend ainda não escalado para múltiplas requisições simultâneas
- Integrações ainda são simuladas (ERP/WMS)

### Próximos Passos

- Ampliar o dataset de imagens e incluir mais variações por SKU
- Implementar autenticação e segurança na API
- Integrar com sistemas ERP/WMS reais
- Permitir detecção de múltiplos SKUs em uma única imagem
- Adicionar dashboard para visualização de uso e acurácia
