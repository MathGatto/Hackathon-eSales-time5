# SKU Recon – Identificação de SKU via Imagem com IA

## Introdução

Na operação logística, produtos sem etiquetas causam gargalos no reprocessamento, na redistribuição e no lançamento fiscal. A identificação manual é lenta, sujeita a erros e ineficiente em escala. Este MVP tem como objetivo criar uma solução que permita capturar ou fazer upload de uma imagem de um produto e, via IA, identificar automaticamente o SKU correspondente.

Além disso, a ferramenta poderá se integrar com o ERP/WMS da empresa para facilitar as etapas subsequentes da operação, como reprocessamento, redistribuição e lançamento fiscal. Pensando além, a mesma solução pode ser adaptada para identificar a quantidade de produtos em gôndolas de supermercado, auxiliando no controle de estoque e abastecimento.

![Resultado](happy.png "Optional title")

## 💰 Proposta comercial

O reconhecimento de SKUs é um problema recorrente e pode ser facilmente oferecido como um SaaS. Ofereceremos aos clientes várias opções de integração de seu banco de dados de produtos com nossos serviços:

1) Para clientes que já têm uma conta de vendas eletrônicas, oferecemos uma API gratuita para carregar imagens de até 100 produtos (em diferentes ângulos e qualidades) e um treinamento gratuito usando aprendizagem profunda. O reconhecedor de SKU treinado é disponibilizado imediatamente por meio de uma chamada de API. Os clientes podem usar a chamada de API, uma interface da Web ou um aplicativo móvel para digitalizar seus produtos e receber o SKU. Os planos corporativos incluem preços baseados em volume de digitalizações e aprimoramento e retreinamento regulares do reconhecedor com um preço definido por volume, custo de treinamento e intervalos de atualização.

2) Para outros clientes, oferecemos um serviço de nuvem que gerencia seu banco de dados de produtos. Os clientes podem fazer upload de uma descrição de seus produtos e imagens. Oferecemos diferentes níveis de serviço em função da qualidade dos dados. Os usuários podem fornecer descrições completas e imagens de qualidade variável (incluindo imagens panorâmicas ou digitalizações em 3D) ou apenas informações mais elementares, que serão processadas em nosso site.  Quanto aos clientes existentes, oferecemos um nível gratuito (“teaser”) com até 100 produtos e interfaces básicas, além de vários planos empresariais escalonáveis.

3) Oferecemos ainda soluções empresariais com integração total com os sistemas do cliente. Nessas soluções, integramos o reconhecimento de SKUs ao ERP do cliente, para alimentar automaticamente as SKUs digitalizadas diretamente nos processos de negócios do cliente. Nesse caso, os clientes podem, por exemplo, manter automaticamente o estoque de produtos digitalizados, gerar notas de devolução e assim por diante.

## 🧠 Uso de IA na solução

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
