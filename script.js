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

// 1. FUNÇÃO EXCLUSIVA PARA A DATA ATUAL (CARIMBO DO CHEFE)
function preencherDataHojeReal() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    
    // CRIANDO A VARIÁVEL QUE ESTAVA FALTANDO:
    const dataFormatada = `${dia}/${mes}/${ano}`;
    
    const el = document.getElementById('datadehoje');
    if (el) {
        el.innerText = dataFormatada;
    }
}

// 2. EXECUÇÃO AO CARREGAR A PÁGINA
window.addEventListener('load', preencherDataHojeReal);

// 1. Escuta todos os rádios
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
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

    resultadosGlobais[num] = totalLinha;

    document.getElementById(conf.ids[0]).innerText = somaPontos;
    document.getElementById(conf.ids[1]).innerText = totalLinha;
    
    const displayPorcentagem = document.getElementById(conf.ids[2]);
    if(displayPorcentagem) {
        displayPorcentagem.innerText = `TOTAL OBTIDO: ${porcentagemQuesito.toFixed(0)}%`;
    }

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
    const numAvaliacao = document.getElementById('avaliacao-num').value;

    const notaCorte = (numAvaliacao === "1") ? 50 : 70;

    if (percentualGeral > 0) {
        radioApto.disabled = false;
        radioRestrito.disabled = false;
        radioInapto.disabled = false;

        if (percentualGeral < notaCorte) {
            radioInapto.checked = true;
            radioApto.checked = false;
            radioRestrito.checked = false;
            radioApto.disabled = true;
            radioRestrito.disabled = true;
        } 
        else {
            radioInapto.disabled = true;
            if (radioInapto.checked) {
                radioInapto.checked = false;
                radioApto.checked = true;
            }
            if (!radioApto.checked && !radioRestrito.checked) {
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
    const displayNumConclusao = document.getElementById('exibir-num-avaliacao');

    if (displayNumConclusao) {
        displayNumConclusao.innerText = numAvaliacao === "outro" ? "___" : numAvaliacao;
    }

    if (numAvaliacao === "outro") {
        inputDataAvaliacao.readOnly = false;
        inputDataAvaliacao.style.backgroundColor = "#ffffff";
        inputDataAvaliacao.style.cursor = "text";
        return;
    } else {
        inputDataAvaliacao.readOnly = true;
        inputDataAvaliacao.style.backgroundColor = "#e9ecef";
        inputDataAvaliacao.style.cursor = "not-allowed";
    }

    if (!dataBaseStr || !numAvaliacao) return;

    let dataCalculada = new Date(dataBaseStr);
    dataCalculada.setMinutes(dataCalculada.getMinutes() + dataCalculada.getTimezoneOffset());

    if (numAvaliacao === "1") {
        dataCalculada.setMonth(dataCalculada.getMonth() + 4);
    } else {
        const mesesAdicionais = 4 + ((parseInt(numAvaliacao) - 1) * 3);
        dataCalculada.setMonth(dataCalculada.getMonth() + mesesAdicionais);
    }

    const ano = dataCalculada.getFullYear();
    const mes = String(dataCalculada.getMonth() + 1).padStart(2, '0');
    const dia = String(dataCalculada.getDate()).padStart(2, '0');

    inputDataAvaliacao.value = `${ano}-${mes}-${dia}`;
    formatarDataBR(inputDataAvaliacao.value);
}

inputEntrada.addEventListener('change', calcularDataAvaliacao);
selectAvaliacao.addEventListener('change', calcularDataAvaliacao);

function prepararImpressao() {
    atualizarResumoFinal(); 
    document.querySelectorAll('.pergunta-pendente').forEach(el => el.classList.remove('pergunta-pendente'));

    let camposFaltando = 0;
    let primeiroErro = null;

    const camposObrigatorios = document.querySelectorAll('#a-dados-servidor input, #a-dados-servidor select, #dataavaliacao');

    camposObrigatorios.forEach(campo => {
        if (!campo.value || campo.value.trim() === "") {
            camposFaltando++;
            campo.classList.add('pergunta-pendente');
            if (!primeiroErro) primeiroErro = campo;
        }
    });

    Object.keys(CONFIG_QUESITOS).forEach(quesitoNum => {
        const totalPerguntas = CONFIG_QUESITOS[quesitoNum].perguntas;
        for (let p = 1; p <= totalPerguntas; p++) {
            const nomeGrupo = `q${quesitoNum}p${p}`;
            const selecionado = document.querySelector(`input[name="${nomeGrupo}"]:checked`);
            if (!selecionado) {
                camposFaltando++;
                const inputExemplo = document.getElementsByName(nomeGrupo)[0];
                if (inputExemplo) {
                    const container = inputExemplo.closest('.b-pergunta');
                    if (container) {
                        container.classList.add('pergunta-pendente');
                        if (!primeiroErro) primeiroErro = container;
                    }
                }
            }
        }
    });

    if (camposFaltando > 0) {
        alert(`Atenção: Existem ${camposFaltando} itens pendentes.`);
        if (primeiroErro) primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    document.querySelectorAll('textarea.infotext').forEach(textarea => {
        if (textarea.value.trim() === "") {
            textarea.setAttribute('data-vazio', 'true');
            textarea.value = "Não preenchido";
            textarea.style.fontStyle = "italic";
            textarea.style.color = "#555";
        }
        textarea.style.border = "none";
    });
    
    //Troca o cabeçalho de SECRETARIA para PREFEITURA
    let trocar = document.getElementById("trocar");
    trocar.innerHTML="PREFEITURA DA CIDADE DE NOVA IGUAÇU";

    window.print();
}

// 3. FUNÇÃO DE FORMATAÇÃO DAS DATAS DE AVALIAÇÃO (Sincroniza apenas os carimbos 1 e 2)
function formatarDataBR(dataISO) {
    if (!dataISO) return "00/00/2026";
    const [ano, mes, dia] = dataISO.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    
    // Atualiza apenas os campos vinculados à data do cálculo de avaliação
    const d1 = document.getElementById('exibir-data');
    const d2 = document.getElementById('exibir-data2');
    
    if (d1) d1.innerText = dataFormatada;
    if (d2) d2.innerText = dataFormatada;
    
    return dataFormatada;
}

const DADOS_SECRETARIAS = {
    'SEMED': {
        membro: { nome: 'Alan Pimenta', mat: 'Matrícula 10/711.784-9', cargo: 'Membro da CADSMEP - SEMED' },
        secretario: { nome: 'Bruna Martins de Oliveira Sagawe', mat: 'Matrícula 18/731.802-5', cargo: 'Superintendente de Gestão de Pessoal' }
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
        secretario: { nome: 'Pedro Henrique de Oliveira Barreto', mat: 'Matrícula 60/738.237', cargo: 'Secretário Municipal de Agricultura e Meio Ambiente' }
    },
    'SEMEF': {
        membro: { nome: ' ', mat: 'Matrícula  ', cargo: 'Membro da CADSMEP - SEMEF' },
        secretario: { nome: 'Evandro Gonçalves de Almeida', mat: 'Matrícula 60/734.018-5', cargo: 'Secretário Municipal de Fazenda e Fiscalização Tributária' }
    }
};

const displayNomeMembro = document.getElementById('d-nome-membro');
const displayMatMembro = document.getElementById('d-matricula-membro');
const displayCargoMembro = document.getElementById('d-cargo-membro');
const displayNomeSec = document.getElementById('d-nome-secretario');
const displayMatSec = document.getElementById('d-matricula-secretario');
const displayCargoSec = document.getElementById('d-cargo-secretario');
const displayDataSec = document.getElementById('exibir-data2');

document.getElementById('secretaria').addEventListener('change', function() {
    const selecao = this.value;
    const dados = DADOS_SECRETARIAS[selecao];

    if (dados) {
        displayNomeMembro.innerText = dados.membro.nome;
        displayMatMembro.innerText = dados.membro.mat;
        displayCargoMembro.innerText = dados.membro.cargo;
        displayNomeSec.innerText = dados.secretario.nome;
        displayMatSec.innerText = dados.secretario.mat;
        displayCargoSec.innerText = dados.secretario.cargo;
        
        const dataPrincipal = document.getElementById('dataavaliacao').value;
        if (dataPrincipal) {
            const [ano, mes, dia] = dataPrincipal.split('-');
            displayDataSec.innerText = `${dia}/${mes}/${ano}`;
        }
    }
});

inputDataAvaliacao.addEventListener('change', function() {
    formatarDataBR(this.value);
});

function aplicarMascaraMatricula(idInput) {
    const input = document.getElementById(idInput);
    if (!input) return;
    input.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/^(\d{2})(\d)/, "$1/$2");
        v = v.replace(/(\d{2})\/(\d{3})(\d)/, "$1/$2.$3");
        v = v.replace(/(\d{2})\/(\d{3})\.(\d{3})(\d)/, "$1/$2.$3-$4");
        e.target.value = v;
    });
}

// aplicarMascaraMatricula('input-matriculaservidor');
aplicarMascaraMatricula('input-matriculachefe');

window.onbeforeprint = function() {
    atualizarResumoFinal();
};

const qualAvaliacao = document.getElementById('avaliacao-num');
const displayH6 = document.getElementById('qual-avaliacao');

qualAvaliacao.addEventListener('change', function() {
    const textoSelecionado = qualAvaliacao.options[qualAvaliacao.selectedIndex].text;
    displayH6.textContent = textoSelecionado;
});

/* --- NOVAS FUNCIONALIDADES: BUSCA POR NÚCLEO E LIMPEZA --- */

let baseServidores = [];

// Carrega o arquivo JSON da mesma pasta do site
async function carregarBaseDeDados() {
    try {
        const resposta = await fetch('servidores.json');
        if (!resposta.ok) throw new Error("Arquivo servidores.json não encontrado");
        baseServidores = await resposta.json();
        console.log("Base de servidores carregada com sucesso.");
    } catch (erro) {
        console.error("Erro ao carregar a base de dados:", erro);
    }
}

// Extrai os 6 dígitos centrais (padrão RH Nova Iguaçu)
function extrairNucleo(matricula) {
    const numeros = matricula.replace(/\D/g, "");
    return numeros.length >= 8 ? numeros.substring(2, 8) : numeros;
}

// Realiza a busca inteligente
function buscarPorNucleo() {
    const campoMatricula = document.getElementById('input-matriculaservidor');
    // Pega apenas os números digitados (o usuário digita os 6 dígitos)
    const apenasNumeros = campoMatricula.value.replace(/\D/g, "");

    // O gatilho acontece ao atingir exatamente 6 dígitos
    if (apenasNumeros.length === 6) {
        const encontrado = baseServidores.find(s => {
            // Ajustado para ler a chave "matricula" do seu JSON
            const matriculaBase = s.matricula ? s.matricula.toString().trim() : ""; 
            return matriculaBase === apenasNumeros;
        });

        if (encontrado) {
            // 1. Coloca o prefixo "13/" seguido da matrícula encontrada
            //campoMatricula.value = "13/" + encontrado.matricula;
            
            // 2. Preenche os campos usando as chaves em minúsculo do seu JSON
            document.getElementById('input-nomeservidor').value = encontrado.nome;
            document.getElementById('cargoservidor').value = encontrado.cargo;
            document.getElementById('secretaria').value = encontrado.secretaria;
            document.getElementById('lotacaoservidor').value = encontrado.lotacao;
            
            if (encontrado.data_exercicio) {
                document.getElementById('dataexercicioservidor').value = encontrado.data_exercicio;
            }

            // --- TRAVANDO CAMPOS ESTRUTURAIS ---
            document.getElementById('input-nomeservidor').readOnly = true;
            document.getElementById('cargoservidor').readOnly = true;
            document.getElementById('dataexercicioservidor').readOnly = false;
            
            // --- LIBERADOS PARA EDIÇÃO (SECRETARIA E LOTAÇÃO) ---
            document.getElementById('secretaria').disabled = false;
            document.getElementById('lotacaoservidor').readOnly = false;

            // Dispara atualizações automáticas 
            document.getElementById('secretaria').dispatchEvent(new Event('change'));
            if (typeof calcularDataAvaliacao === "function") calcularDataAvaliacao();
            if (typeof atualizarResumoFinal === "function") atualizarResumoFinal();
            
        } else {
            console.log("Servidor não encontrado com a matrícula: " + apenasNumeros);
        }
    }
}

// Função para o botão "Nova Avaliação"
function limparTudo() {
    if (confirm("Deseja zerar o formulário para uma nova avaliação?")) {
        document.querySelector('form').reset();
        localStorage.removeItem('progresso_cadsmep'); // Remove o que foi salvo no navegador
        if (typeof atualizarResumoFinal === "function") atualizarResumoFinal();
        window.scrollTo(0, 0);
        alert("Formulário limpo!");
    }
}

/* --- ATUALIZAÇÃO DOS EVENTOS --- */
window.addEventListener('load', () => {
    carregarBaseDeDados(); // Carrega o JSON
    preencherDataHojeReal(); // Mantém sua função original de data 
});

// Adiciona o monitor de digitação no campo de matrícula
document.getElementById('input-matriculaservidor').addEventListener('input', buscarPorNucleo);