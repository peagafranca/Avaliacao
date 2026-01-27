# Avaliacao de Estágio Probatório - Nova Iguaçu
Sistema de Avaliação de Estágio Probatório da CADSMEP

Este projeto visa substituir o processo baseado em planilhas Excel por uma aplicação web moderna, eliminando erros de fórmulas e desconfigurações de layout e facilitando a elaboração e impressão das avaliações dos servidores em estágio probatório da Prefeitura Municipal de Nova Iguaçu.

Este site não guarda nenhum tipo de informação em qualquer banco de dados, os dados inseridos apenas geram o layout para impressão do formulário de desempenho de estágio probatório. Assinaturas seguem de forma manual.

As principais mudanças do Excel para o formulário web são:

✅ Formulário dinâmico de avaliação.
✅ Interface mais clara e objetiva.
✅ Validação de campos obrigatórios.
✅ Escolha de apenas uma nota por pergunta. 
✅ Preenchimento automático da data da avaliação de acordo com a data de exercício e qual avaliação.
✅ Preenchimento automático do carimbo para assinatura da chefia.
✅ Preenchimento automático do carimbo para o responsável pelo órgão e membros da comissão de acordo com a Secretaria indicada.
✅ Indicação automática de Apto, Apto com restrição ou Inapto de acordo com a nota da avaliação.
✅ Interface responsiva (funciona no PC e celular).

## 🚀 Diferenciais da Ferramenta

- **Privacidade Total:** A aplicação não possui banco de dados. Todas as informações inseridas permanecem apenas na memória do navegador do usuário durante o uso.
- **Cálculos Automatizados:** As médias e pontuações são calculadas via JavaScript, impedindo erros manuais.
- **Layout de Impressão (Print-Ready):** CSS otimizado para gerar um documento PDF ou impresso perfeitamente formatado em folha A4.
- **Interface Responsiva:** Pode ser acessada de computadores ou dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica do formulário.
- **CSS3:** Estilização com foco em `media queries` para impressão (`@media print`).
- **JavaScript (Vanilla):** Lógica de cálculos, validação de campos e manipulação de DOM.

## 📂 Como funciona a persistência?

Conforme definido no projeto, **não há persistência em servidor**. 
1. O usuário preenche os dados.
2. O sistema processa as notas e gera o parecer visual.
3. O usuário utiliza a função de impressão do navegador através de botão GERAR AVALIAÇÃO para gerar o documento físico ou PDF.
4. Ao fechar a aba, os dados são limpos, garantindo a conformidade com as boas práticas de segurança da informação.

## 🔧 Instalação e Execução

Como é uma aplicação estática (Front-end puro), não requer instalação de dependências:

1. Clone o repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` em qualquer navegador moderno.

---
**Desenvolvido por:** Phelipe Peixoto da Silva França  
*Servidor Público - SEMAD | Estudante de Análise e Desenvolvimento de Sistemas (Estácio)*

