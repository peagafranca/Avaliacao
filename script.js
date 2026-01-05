function adicionarTarefa() {
    let mensagem = "Tarefa adicionada com sucesso";
    document.getElementById("mensagem").textContent = mensagem;

    let inputTarefa = document.getElementById("inputTarefa")


}

//Primeiro Total Obtido gerado por Gemini e adaptado, procurar entender cada linha
// Selecionamos todos os radios que fazem parte da pontuação
const radios = document.querySelectorAll('.score-radio1');
const displayTotal = document.getElementById('total-obtido1');

const VALOR_MAXIMO = 28; // 4 perguntas x 7 pontos

// Adicionamos o evento de "escuta" em cada rádio
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        calcularPorcentagem();
    });
});

function calcularPorcentagem() {
    let soma = 0;
    
    // Pegamos apenas os que estão marcados (checked)
    const selecionados = document.querySelectorAll('.score-radio1:checked');

    selecionados.forEach(input => {
        soma += parseInt(input.value);
    });

    // Cálculo da porcentagem
    const porcentagem = (soma / VALOR_MAXIMO) * 100;

    // Atualiza o texto na tela
    displayTotal.innerText = `TOTAL OBTIDO: ${porcentagem.toFixed(0)}%`;
}