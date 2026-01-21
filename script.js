// Configuração: [Perguntas, Valor Máximo por Pergunta, Peso, ID Pontos Obtidos, ID Total Linha, ID Texto Porcentagem]
const CONFIG_QUESITOS = {
    '1': { perguntas: 4, max: 7, peso: 4, ids: ['pts-assiduidade', 'total-assiduidade', 'total-obtido1'] },
    '2': { perguntas: 6, max: 7, peso: 4, ids: ['pts-disciplina', 'total-disciplina', 'total-obtido2'] },
    '3': { perguntas: 5, max: 7, peso: 2, ids: ['pts-iniciativa', 'total-iniciativa', 'total-obtido3'] },
    '4': { perguntas: 6, max: 7, peso: 5, ids: ['pts-produtividade', 'total-produtividade', 'total-obtido4'] },
    '5': { perguntas: 5, max: 7, peso: 5, ids: ['pts-responsabilidade', 'total-responsabilidade', 'total-obtido5'] }
};

const VALOR_MAXIMOGERAL = 735;
let resultadosGlobais = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };

// 1. Escuta todos os rádios
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        // Pega o número do quesito da classe (ex: score-radio3 -> 3)
        const quesitoNum = e.target.className.match(/\d+/)[0];
        atualizarLinhaETotal(quesitoNum);
    });
});

function atualizarLinhaETotal(num) {
    const conf = CONFIG_QUESITOS[num];
    const selecionados = document.querySelectorAll(`.score-radio${num}:checked`);
    
    let somaPontos = 0;
    selecionados.forEach(input => somaPontos += parseInt(input.value));

    const totalLinha = somaPontos * conf.peso;
    const porcentagemQuesito = (somaPontos / (conf.perguntas * conf.max)) * 100;

    // Salva para o cálculo geral
    resultadosGlobais[num] = totalLinha;

    // --- ATUALIZAÇÃO DA TABELA (IMAGEM) ---
    
    // 1. Coluna "Pontos Obtidos"
    document.getElementById(conf.ids[0]).innerText = somaPontos;
    
    // 2. Coluna "TOTAL" (Soma * Peso)
    document.getElementById(conf.ids[1]).innerText = totalLinha;
    
    // 3. Texto de porcentagem que fica acima dos rádios
    const displayPorcentagem = document.getElementById(conf.ids[2]);
    if(displayPorcentagem) {
        displayPorcentagem.innerText = `TOTAL OBTIDO: ${porcentagemQuesito.toFixed(0)}%`;
    }

    // Atualiza o rodapé da tabela
    atualizarResumoFinal();
}

function atualizarResumoFinal() {
    const totalGeral = Object.values(resultadosGlobais).reduce((a, b) => a + b, 0);
    const percentualGeral = (totalGeral / VALOR_MAXIMOGERAL) * 100;

    document.getElementById('total-geralpontos').innerText = totalGeral.toFixed(0);
    document.getElementById('percentual-total').innerText = `${percentualGeral.toFixed(0)}%`;

    const radioApto = document.getElementById('apto');
    const radioRestrito = document.getElementById('aptocomrestricoes');
    const radioInapto = document.getElementById('inapto');

    if (percentualGeral > 0) {
        if (percentualGeral < 70) {
            // ABAIXO DE 70%: Força Inapto (Vermelho)
            radioInapto.checked = true;
            radioInapto.disabled = false; // Garante que ele possa ser marcado
            radioApto.disabled = true;
            radioRestrito.disabled = true;
        } 
        else {
            // 70% OU MAIS: Libera opções de Apto
            radioApto.disabled = false;
            radioRestrito.disabled = false;
            radioInapto.disabled = true; // Impede marcar Inapto se a nota é boa

            if (!radioRestrito.checked) {
                radioApto.checked = true;
            }
        }
    }
}

const inputEntrada = document.getElementById('dataexercicioservidor');
const selectAvaliacao = document.getElementById('avaliacao-num');
const inputDataAvaliacao = document.getElementById('dataavaliacao');

function calcularDataAvaliacao() {
    const dataBaseStr = inputEntrada.value;
    const numAvaliacao = selectAvaliacao.value;

    // --- NOVA LÓGICA PARA ATUALIZAR O NÚMERO NA CONCLUSÃO ---
    const displayNumConclusao = document.getElementById('exibir-num-avaliacao');
    if (displayNumConclusao) {
        displayNumConclusao.innerText = numAvaliacao === "outro" ? "___" : numAvaliacao;
    }
    // -------------------------------------------------------


    if (!dataBaseStr || !numAvaliacao || numAvaliacao === "outro") return;

    // Criamos o objeto de data baseado na entrada em exercício
    let dataCalculada = new Date(dataBaseStr);
    
    // Ajuste para evitar erro de fuso horário ao criar a data
    dataCalculada.setMinutes(dataCalculada.getMinutes() + dataCalculada.getTimezoneOffset());

    if (numAvaliacao === "1") {
        // 1ª Avaliação: +4 meses
        dataCalculada.setMonth(dataCalculada.getMonth() + 4);
    } else {
        // Demais: 4 meses (da primeira) + 3 meses para cada avaliação adicional
        // Fórmula: 4 + ((N - 1) * 3)
        const mesesAdicionais = 4 + ((parseInt(numAvaliacao) - 1) * 3);
        dataCalculada.setMonth(dataCalculada.getMonth() + mesesAdicionais);
    }

    // Formata de volta para YYYY-MM-DD para o input
    const ano = dataCalculada.getFullYear();
    const mes = String(dataCalculada.getMonth() + 1).padStart(2, '0');
    const dia = String(dataCalculada.getDate()).padStart(2, '0');

    inputDataAvaliacao.value = `${ano}-${mes}-${dia}`;

    if (displayDataCarimbo) displayDataCarimbo.innerText = `${dia}/${mes}/${ano}`;
}

// Ouve as mudanças nos dois campos
inputEntrada.addEventListener('change', calcularDataAvaliacao);
selectAvaliacao.addEventListener('change', calcularDataAvaliacao);



function prepararImpressao() {
    // Seleciona todos os textareas que têm a classe 'info1'
    const textareas = document.querySelectorAll('textarea.info1');

    textareas.forEach(textarea => {
        // Verifica se o valor está vazio ou tem apenas espaços
        if (textarea.value.trim() === "") {
            textarea.closest('.c-infoc').classList.add('ocultar-na-impressao');
        } else {
            textarea.closest('.c-infoc').classList.remove('ocultar-na-impressao');
        }
    });

    // Chama o comando de impressão do sistema
    window.print();
}

// Seleciona o elemento onde a data será exibida no carimbo
const displayDataCarimbo = document.getElementById('exibir-data');

// Função para formatar data ISO (AAAA-MM-DD) para BR (DD/MM/AAAA)
function formatarDataBR(dataISO) {
    if (!dataISO) return "00/00/2026";
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Escuta mudanças manuais no campo de data
inputDataAvaliacao.addEventListener('change', function() {
    displayDataCarimbo.innerText = formatarDataBR(this.value);
});

// IMPORTANTE: Atualize sua função calcularDataAvaliacao existente 
// Adicione esta linha no FINAL da função calcularDataAvaliacao:
// displayDataCarimbo.innerText = formatarDataBR(inputDataAvaliacao.value);
