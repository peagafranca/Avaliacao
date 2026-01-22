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

    formatarDataBR(inputDataAvaliacao.value);

    if (displayDataCarimbo) displayDataCarimbo.innerText = `${dia}/${mes}/${ano}`;
}

// Ouve as mudanças nos dois campos
inputEntrada.addEventListener('change', calcularDataAvaliacao);
selectAvaliacao.addEventListener('change', calcularDataAvaliacao);



function prepararImpressao() {
    // 1. Validação de Quesitos (Rádios)
    const totalPerguntas = 26; // Soma de todas as perguntas dos 5 quesitos
    const marcados = document.querySelectorAll('input[type="radio"].score-radio1:checked, \
                                               input[type="radio"].score-radio2:checked, \
                                               input[type="radio"].score-radio3:checked, \
                                               input[type="radio"].score-radio4:checked, \
                                               input[type="radio"].score-radio5:checked').length;

    if (marcados < totalPerguntas) {
        alert(`Atenção: Existem perguntas sem resposta! (${marcados} de ${totalPerguntas} preenchidas). Por favor, complete a avaliação antes de imprimir.`);
        return; // Interrompe a função aqui
    }

    // 2. Validação de Dados Básicos
    if (!document.getElementById('input-nomeservidor').value || !document.getElementById('dataavaliacao').value) {
        alert("Por favor, preencha o nome do servidor e a data da avaliação.");
        return;
    }

    // 3. Lógica de Ocultar Textareas Vazios (Sua lógica que já funciona)
    const textareas = document.querySelectorAll('textarea.info1');
    textareas.forEach(textarea => {
        const container = textarea.closest('.c-infoc');
        if (textarea.value.trim() === "") {
            if (container) container.classList.add('ocultar-na-impressao');
        } else {
            if (container) container.classList.remove('ocultar-na-impressao');
        }
    });

    // 4. Personalizar título do PDF e Imprimir
    const nomeServidor = document.getElementById('input-nomeservidor').value;
    const tituloOriginal = document.title;
    document.title = `AED - ${nomeServidor}`;
    
    window.print();
    
    document.title = tituloOriginal;
}

// Seleciona o elemento onde a data será exibida no carimbo
const displayDataCarimbo = document.getElementById('exibir-data');

// Função para formatar data ISO (AAAA-MM-DD) para BR (DD/MM/AAAA)
function formatarDataBR(dataISO) {
    if (!dataISO) return "00/00/2026";
    const [ano, mes, dia] = dataISO.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    
    // Atualiza ambos os spans de uma vez
    const d1 = document.getElementById('exibir-data');
    const d2 = document.getElementById('exibir-data2');
    
    if (d1) d1.innerText = dataFormatada;
    if (d2) d2.innerText = dataFormatada;
    
    return dataFormatada;
}

// IMPORTANTE: Atualize sua função calcularDataAvaliacao existente 
// Adicione esta linha no FINAL da função calcularDataAvaliacao:
// displayDataCarimbo.innerText = formatarDataBR(inputDataAvaliacao.value);

// Parte que escolhe o nome dos membros da CADSMEP
// Banco de dados dos membros por secretaria
// Banco de dados centralizado por secretaria
const DADOS_SECRETARIAS = {
    'SEMED': {
        membro: { nome: 'Alan Pimenta', mat: 'Matrícula 10/711.784-9', cargo: 'Membro da CADSMEP - SEMED' },
        secretario: { nome: 'Maria Virgínia Andrade Rocha Feitosa', mat: 'Matrícula 11/694.638-8', cargo: 'Secretária Municipal de Educação' }
    },
    'SEMAD': {
        membro: { nome: 'Maria da Paz Silva Oliveira', mat: 'Matrícula 11/687.990-2', cargo: 'Membro da CADSMEP - SEMAD' },
        secretario: { nome: 'Paulo Sergio da Silva Monteiro', mat: 'Matrícula 11/692.135-7', cargo: 'Secretário Municipal de Administração' }
    },
    'SEMOP': {
        membro: { nome: 'Ronaldo Ramos de Carvalho', mat: 'Matrícula 34/727.441-8', cargo: 'Membro da CADSMEP - SEMOP' },
        secretario: { nome: 'Fernando Vieira Bastos', mat: 'Matrícula 34/734.009-4', cargo: 'Secretário Municipal de Ordem Pública' }
    },
    'SEMAS': {
        membro: { nome: 'Pricilla Pereira Nunes', mat: 'Matrícula 11/701.199-2', cargo: 'Membro da CADSMEP - SEMAS' },
        secretario: { nome: 'Elaine Medeiros Fonseca da Silva', mat: 'Matrícula 60/734.021-9', cargo: 'Secretária Municipal de Assistência Social' }
    },
    'SEMUS': {
        membro: { nome: 'Denise Evangelista da Silva', mat: 'Matrícula 10/690.340-5', cargo: 'Membro da CADSMEP - SEMUS' },
        secretario: { nome: 'Luiz Carlos Nobre Cavalcanti', mat: 'Matrícula 60/734.016-9', cargo: 'Secretário Municipal de Saúde' }
    },
    'SEMAM': {
        membro: { nome: 'Tânia Mauricea Costa dos Santos', mat: 'Matrícula 12/684.273-6', cargo: 'Membro da CADSMEP - SEMAM' },
        secretario: { nome: 'Caio Carneiro Campos', mat: 'Matrícula 60/736.699-0', cargo: 'Secretário Municipal de Agricultura e Meio Ambiente' }
    }
    
};

// Elementos do Membro (3º carimbo)
const displayNomeMembro = document.getElementById('d-nome-membro');
const displayMatMembro = document.getElementById('d-matricula-membro');
const displayCargoMembro = document.getElementById('d-cargo-membro');

// Elementos do Secretário (4º carimbo)
const displayNomeSec = document.getElementById('d-nome-secretario');
const displayMatSec = document.getElementById('d-matricula-secretario');
const displayCargoSec = document.getElementById('d-cargo-secretario');
const displayDataSec = document.getElementById('exibir-data2');

// Escutador do Select de Secretaria
document.getElementById('secretaria').addEventListener('change', function() {
    const selecao = this.value;
    const dados = DADOS_SECRETARIAS[selecao];

    if (dados) {
        // Preenche Membro
        displayNomeMembro.innerText = dados.membro.nome;
        displayMatMembro.innerText = dados.membro.mat;
        displayCargoMembro.innerText = dados.membro.cargo;

        // Preenche Secretário
        displayNomeSec.innerText = dados.secretario.nome;
        displayMatSec.innerText = dados.secretario.mat;
        displayCargoSec.innerText = dados.secretario.cargo;
        
        // Sincroniza a data do carimbo do secretário com a data principal
        const dataPrincipal = document.getElementById('dataavaliacao').value;
        if (dataPrincipal) {
            const [ano, mes, dia] = dataPrincipal.split('-');
            displayDataSec.innerText = `${dia}/${mes}/${ano}`;
        }
    }
});

// Adicionar este gatilho para atualizar a data do carimbo 2 quando a data principal mudar
document.getElementById('dataavaliacao').addEventListener('change', function() {
    if (this.value) {
        const [ano, mes, dia] = this.value.split('-');
        const dataFormatada = `${dia}/${mes}/${ano}`;
        if (displayDataSec) displayDataSec.innerText = dataFormatada;
    }
});

// Quando você altera a data manualmente no calendário
inputDataAvaliacao.addEventListener('change', function() {
    formatarDataBR(this.value);
});