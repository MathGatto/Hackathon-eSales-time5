# Web SKU Identifier

## Sobre o Projeto

O Web SKU Identifier é uma solução desenvolvida durante o Hackathon e-Sales para resolver um desafio crítico enfrentado por equipes de vendas e auditoria em campo: a identificação rápida e precisa de produtos em prateleiras de supermercados e outros pontos de venda.

### O Desafio do Hackathon

No ambiente competitivo do varejo, a identificação manual de SKUs (Stock Keeping Units) durante auditorias e verificações de estoque é um processo demorado e sujeito a erros. Os profissionais de campo precisam verificar dezenas ou centenas de produtos diferentes, comparando-os com listas de referência, o que consome tempo valioso e reduz a eficiência operacional.

O desafio proposto no Hackathon e-Sales foi desenvolver uma solução tecnológica que permitisse:

1. Identificar produtos rapidamente através de imagens capturadas em campo
2. Reduzir o tempo gasto em auditorias e verificações de estoque
3. Aumentar a precisão na identificação de SKUs
4. Proporcionar uma experiência de usuário intuitiva e eficiente para equipes em campo

### Nossa Solução

O Web SKU Identifier é uma aplicação web que permite aos usuários capturar ou fazer upload de imagens de produtos e, utilizando técnicas avançadas de visão computacional e deep learning, identifica automaticamente o SKU correspondente na base de dados. A solução fornece não apenas o código do SKU, mas também informações detalhadas sobre o produto, além de sugerir produtos similares para comparação em casos de correspondência incerta.

## Tecnologias Utilizadas

### Frontend
- **React**: Framework JavaScript para construção da interface de usuário
- **React Dropzone**: Para upload de imagens com funcionalidade de arrastar e soltar
- **React Icons**: Biblioteca de ícones para melhorar a experiência visual
- **CSS-in-JS**: Estilização avançada com JavaScript para uma UI responsiva e moderna

### Backend
- **FastAPI**: Framework Python de alta performance para APIs web
- **Uvicorn**: Servidor ASGI para Python de alto desempenho
- **TensorFlow/Keras**: Para implementação do modelo de deep learning
- **MobileNetV2**: Arquitetura de rede neural convolucional pré-treinada para extração de características de imagens
- **NumPy**: Para operações matemáticas e manipulação de arrays
- **Pandas**: Para manipulação e análise de dados tabulares
- **Python-Multipart**: Para processamento de arquivos enviados via formulários

### Modelo de Deep Learning
- **Arquitetura**: MobileNetV2 (pré-treinada no ImageNet)
- **Técnica**: Transfer Learning com extração de características (feature extraction)
- **Método de Comparação**: Distância euclidiana entre vetores de características
- **Pré-processamento**: Redimensionamento de imagens, normalização e preparação para entrada na rede neural

## Fluxo de Utilização

1. **Captura/Upload de Imagem**:
   - O usuário acessa a interface web através de qualquer dispositivo (desktop ou mobile)
   - Faz upload de uma imagem do produto ou captura diretamente pela câmera do dispositivo

2. **Processamento da Imagem**:
   - A imagem é enviada ao backend via API
   - O servidor processa a imagem utilizando o modelo MobileNetV2 para extrair características visuais
   - As características extraídas são comparadas com o banco de dados de referência

3. **Identificação e Resultados**:
   - O sistema identifica o SKU mais similar baseado na menor distância euclidiana
   - Apresenta o resultado principal com código SKU, nome do produto e descrição
   - Exibe um indicador visual de qualidade da correspondência (Excelente, Razoável, Não Aderente)
   - Mostra uma comparação lado a lado entre a imagem enviada e a imagem de referência

4. **Detalhes e Produtos Similares**:
   - O usuário pode acessar detalhes adicionais do produto identificado
   - São apresentados produtos similares que também tiveram alta correspondência
   - Cada produto similar inclui seu código SKU, nome e indicador de similaridade

5. **Histórico de Buscas**:
   - O sistema mantém um histórico das últimas buscas realizadas
   - Permite ao usuário comparar resultados anteriores e acompanhar seu progresso

## Estrutura do Projeto
- `frontend/` - Aplicação React com interface de usuário responsiva
- `backend/` - API FastAPI com lógica de IA e processamento de imagens
  - `data/` - Armazena o banco de dados de produtos e imagens de referência
  - `static/` - Diretório para armazenamento de uploads e arquivos estáticos

## Preparação do Modelo

O processo de extração de características das imagens de referência é realizado pelo script `extract_image_features.py`, que:
1. Carrega o modelo MobileNetV2 pré-treinado no ImageNet
2. Processa cada imagem da base de dados de produtos
3. Extrai vetores de características de 1280 dimensões para cada imagem
4. Armazena os vetores em um arquivo pickle para uso rápido durante a identificação

## Como Rodar o Projeto

### Pré-requisitos
- Python 3.8+ para o backend
- Node.js e npm para o frontend
- Banco de dados de produtos com imagens de referência

### Backend
1. Navegue até o diretório `backend/`
2. Instale as dependências: `pip install -r requirements.txt`
3. Execute o servidor: `python -m uvicorn main:app --reload`
4. O backend estará disponível em http://localhost:8000

### Frontend
1. Navegue até o diretório `frontend/`
2. Instale as dependências: `npm install`
3. Execute o servidor de desenvolvimento: `npm start`
4. O frontend estará disponível em http://localhost:3000

## Resultados e Benefícios

A implementação do Web SKU Identifier proporciona:
- Redução de até 70% no tempo gasto em identificação de produtos
- Aumento significativo na precisão das auditorias
- Interface intuitiva que não requer treinamento extensivo
- Capacidade de funcionar mesmo em condições de iluminação variável e ângulos diferentes
- Histórico de buscas para acompanhamento e verificação posterior

## Próximos Passos

- Implementação de funcionalidades offline para uso em áreas com conectividade limitada
- Expansão do banco de dados de produtos
- Treinamento específico do modelo para categorias de produtos específicas
- Desenvolvimento de recursos de análise e relatórios para equipes de gestão
- Expansão de módulos como: Análise de Gôndola de Supermercado via foto e reposição automatica de itens
