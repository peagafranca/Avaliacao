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

    document.getElementById('total-geralpontos').innerText = totalGeral;
    document.getElementById('percentual-total').innerText = `${percentualGeral.toFixed(0)}%`;
}