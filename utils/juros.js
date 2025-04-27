console.log("Script juros.js carregado com sucesso");

// DOM Elements
const calcularBtn = document.getElementById('calcular-btn');
const modal = document.getElementById('jurosModal');
const closeBtn = document.querySelector('.close');
const copyBtn = document.getElementById('copy-btn');
const tooltip = document.getElementById('tooltip');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

console.log("Elementos DOM capturados:", { calcularBtn, modal, closeBtn, copyBtn, tooltip, themeToggle });

// Theme Management
const savedTheme = localStorage.getItem('theme') || 'light';
console.log("Tema carregado:", savedTheme);
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    console.log("Botão de tema clicado");
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    console.log("Alterando tema para:", newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    console.log("Atualizando ícone do tema:", theme);
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Event Listeners
calcularBtn.addEventListener('click', () => {
    console.log("Botão Calcular clicado");
    calcularJuros();
});
closeBtn.addEventListener('click', () => {
    console.log("Botão Fechar clicado");
    fecharModal();
});
copyBtn.addEventListener('click', () => {
    console.log("Botão Copiar clicado");
    copiarResultado();
});
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        console.log("Clicado fora do modal, fechando");
        fecharModal();
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        console.log("Tecla ESC pressionada, fechando modal");
        fecharModal();
    }
});

// Functions
function calcularJuros() {
    console.log("Iniciando função calcularJuros");
    const capital = parseFloat(document.getElementById('capital').value);
    const taxa = parseFloat(document.getElementById('taxa').value) / 100;
    const periodo = parseInt(document.getElementById('periodo').value);

    console.log("Dados de entrada:", { capital, taxa, periodo });

    // Validações
    if (isNaN(capital) || capital <= 0) {
        console.log("Erro: Capital inválido");
        showError("Insira um capital inicial válido maior que zero");
        return;
    }
    if (isNaN(taxa) || taxa <= 0) {
        console.log("Erro: Taxa inválida");
        showError("Insira uma taxa de juros válida maior que zero");
        return;
    }
    if (isNaN(periodo) || periodo <= 0) {
        console.log("Erro: Período inválido");
        showError("Insira um período válido maior que zero");
        return;
    }

    const montante = capital * Math.pow(1 + taxa, periodo);
    const resultado = montante.toFixed(2);
    console.log("Resultado do cálculo:", resultado);

    const resultText = document.getElementById('modalResultText');
    resultText.textContent = `Montante Final: R$ ${resultado}`;
    console.log("Conteúdo do modal atualizado, chamando abrirModal");
    abrirModal();
    clearError();
}

function abrirModal() {
    console.log("Abrindo modal");
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    console.log("Classe 'show' adicionada ao modal, overflow definido como hidden");
}

function fecharModal() {
    console.log("Fechando modal");
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    console.log("Classe 'show' removida do modal, overflow restaurado");
}

function copiarResultado() {
    console.log("Iniciando cópia do resultado");
    const resultText = document.getElementById('modalResultText').textContent;
    navigator.clipboard.writeText(resultText).then(() => {
        console.log("Resultado copiado com sucesso:", resultText);
        tooltip.classList.add('show');
        setTimeout(() => {
            console.log("Removendo tooltip após 2 segundos");
            tooltip.classList.remove('show');
        }, 2000);
    }).catch(err => {
        console.error("Erro ao copiar resultado:", err);
        alert("Não foi possível copiar o resultado");
    });
}

function showError(message) {
    console.log("Exibindo mensagem de erro:", message);
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError() {
    console.log("Limpando mensagem de erro");
    const errorElement = document.getElementById('error-message');
    errorElement.style.display = 'none';
}