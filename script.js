// Selecionamos todos os radios que fazem parte da pontuação do quesito 1
const radios1 = document.querySelectorAll('.score-radio1');
const displayTotal1 = document.getElementById('total-obtido1');
const ptsSoma1 = document.getElementById('pts-assiduidade');
const celulaPeso1 = document.getElementById('total-assiduidade')

const VALOR_MAXIMO1 = 28; // 4 perguntas x 7 pontos

// Adicionamos o evento de "escuta" em cada rádio
radios1.forEach(radio => {
    radio.addEventListener('change', () => {
        calcularPorcentagem1();
    });
});

function calcularPorcentagem1() {
    let soma1 = 0;
    
    // Pegamos apenas os que estão marcados (checked)
    const selecionados1 = document.querySelectorAll('.score-radio1:checked');

    selecionados1.forEach(input => {
        soma1 += parseInt(input.value);
    });

       // Soma * Peso
    let peso1 = soma1 * 4;
    
    // Cálculo da porcentagem
    const porcentagem1 = (soma1 / VALOR_MAXIMO1) * 100;
        
    // Atualiza o texto na tela
    displayTotal1.innerText = `TOTAL OBTIDO: ${porcentagem1.toFixed(0)}%`;
    
    // Colocar soma na tabela
    ptsSoma1.innerText = `${soma1.toFixed(0)}`;

    // Colocar soma*peso na tabela
    celulaPeso1.innerText = `${peso1.toFixed(0)}`;
}

// Selecionamos todos os radios que fazem parte da pontuação do quesito 2
const radios2 = document.querySelectorAll('.score-radio2');
const displayTotal2 = document.getElementById('total-obtido2');
const ptsSoma2 = document.getElementById('pts-disciplina');
const celulaPeso2 = document.getElementById('total-disciplina')

const VALOR_MAXIMO2 = 42; // 4 perguntas x 7 pontos

// Adicionamos o evento de "escuta" em cada rádio
radios2.forEach(radio => {
    radio.addEventListener('change', () => {
        calcularPorcentagem2();
    });
});

function calcularPorcentagem2() {
    let soma2 = 0;
    
    // Pegamos apenas os que estão marcados (checked)
    const selecionados2 = document.querySelectorAll('.score-radio2:checked');

    selecionados2.forEach(input => {
        soma2 += parseInt(input.value);
    });

       // Soma * Peso
    let peso2 = soma2 * 4;
    
    // Cálculo da porcentagem
    const porcentagem2 = (soma2 / VALOR_MAXIMO2) * 100;
        
    // Atualiza o texto na tela
    displayTotal2.innerText = `TOTAL OBTIDO: ${porcentagem2.toFixed(0)}%`;
    
    // Colocar soma na tabela
    ptsSoma2.innerText = `${soma2.toFixed(0)}`;

    // Colocar soma*peso na tabela
    celulaPeso2.innerText = `${peso2.toFixed(0)}`;
}

// Selecionamos todos os radios que fazem parte da pontuação do quesito 2
const radios3 = document.querySelectorAll('.score-radio3');
const displayTotal3 = document.getElementById('total-obtido3');
const ptsSoma3 = document.getElementById('pts-iniciativa');
const celulaPeso3 = document.getElementById('total-iniciativa')

const VALOR_MAXIMO3 = 35; // 5 perguntas x 7 pontos

// Adicionamos o evento de "escuta" em cada rádio
radios3.forEach(radio => {
    radio.addEventListener('change', () => {
        calcularPorcentagem3();
    });
});

function calcularPorcentagem3() {
    let soma3 = 0;
    
    // Pegamos apenas os que estão marcados (checked)
    const selecionados3 = document.querySelectorAll('.score-radio3:checked');

    selecionados3.forEach(input => {
        soma3 += parseInt(input.value);
    });

       // Soma * Peso
    let peso3 = soma3 * 2;
    
    // Cálculo da porcentagem
    const porcentagem3 = (soma3 / VALOR_MAXIMO3) * 100;
        
    // Atualiza o texto na tela
    displayTotal3.innerText = `TOTAL OBTIDO: ${porcentagem3.toFixed(0)}%`;
    
    // Colocar soma na tabela
    ptsSoma3.innerText = `${soma3.toFixed(0)}`;

    // Colocar soma*peso na tabela
    celulaPeso3.innerText = `${peso3.toFixed(0)}`;
}

// Selecionamos todos os radios que fazem parte da pontuação do quesito 4
const radios4 = document.querySelectorAll('.score-radio4');
const displayTotal4 = document.getElementById('total-obtido4');
const ptsSoma4 = document.getElementById('pts-produtividade');
const celulaPeso4 = document.getElementById('total-produtividade')

const VALOR_MAXIMO4 = 42; // 6 perguntas x 7 pontos

// Adicionamos o evento de "escuta" em cada rádio
radios4.forEach(radio => {
    radio.addEventListener('change', () => {
        calcularPorcentagem4();
    });
});

function calcularPorcentagem4() {
    let soma4 = 0;
    
    // Pegamos apenas os que estão marcados (checked)
    const selecionados4 = document.querySelectorAll('.score-radio4:checked');

    selecionados4.forEach(input => {
        soma4 += parseInt(input.value);
    });

    // Soma * Peso
    let peso4 = soma4 * 5;
    
    // Cálculo da porcentagem
    const porcentagem4 = (soma4 / VALOR_MAXIMO4) * 100;
        
    // Atualiza o texto na tela
    displayTotal4.innerText = `TOTAL OBTIDO: ${porcentagem4.toFixed(0)}%`;
    
    // Colocar soma na tabela
    ptsSoma4.innerText = `${soma4.toFixed(0)}`;

    // Colocar soma*peso na tabela
    celulaPeso4.innerText = `${peso4.toFixed(0)}`;
}

// Selecionamos todos os radios que fazem parte da pontuação do quesito 5
const radios5 = document.querySelectorAll('.score-radio5');
const displayTotal5 = document.getElementById('total-obtido5');
const ptsSoma5 = document.getElementById('pts-responsabilidade');
const celulaPeso5 = document.getElementById('total-responsabilidade')

const VALOR_MAXIMO5 = 35; // 5 perguntas x 7 pontos

// Adicionamos o evento de "escuta" em cada rádio
radios5.forEach(radio => {
    radio.addEventListener('change', () => {
        calcularPorcentagem5();
    });
});

function calcularPorcentagem5() {
    let soma5 = 0;
    
    // Pegamos apenas os que estão marcados (checked)
    const selecionados5 = document.querySelectorAll('.score-radio5:checked');

    selecionados5.forEach(input => {
        soma5 += parseInt(input.value);
    });

    
    // Soma * Peso
    let peso5 = soma5 * 5;
    
    // Cálculo da porcentagem
    const porcentagem5 = (soma5 / VALOR_MAXIMO5) * 100;
        
    // Atualiza o texto na tela
    displayTotal5.innerText = `TOTAL OBTIDO: ${porcentagem5.toFixed(0)}%`;
    
    // Colocar soma na tabela
    ptsSoma5.innerText = `${soma5.toFixed(0)}`;

    // Colocar soma*peso na tabela
    celulaPeso5.innerText = `${peso5.toFixed(0)}`;
}

const celulaTotalGeralPontos = document.getElementById('total-geralpontos')
const celulaPercentualTotal = document.getElementById('percentual-total')
const VALOR_MAXIMOGERAL = 735;

function totalGeralPontos() {    
    const totalGeralPts = peso1 + peso2 + peso3 + peso4 + peso5;
    const porcentagemTotal = (totalGeralPts / VALOR_MAXIMOGERAL) *100;

    celulaTotalGeralPontos.innerText = `${totalGeralPts.toFixed(0)}`;
    celulaPercentualTotal.innerText = `${porcentagemTotal.toFixed(0)}`;

}

