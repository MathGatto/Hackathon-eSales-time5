# SKU Recon – Informaçoes técnicas

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

