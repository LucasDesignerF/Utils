console.log("Script conversor.js carregado com sucesso");

// DOM Elements
const converterBtn = document.getElementById('converter-btn');
const modal = document.getElementById('conversorModal');
const closeBtn = document.querySelector('.close');
const copyBtn = document.getElementById('copy-btn');
const tooltip = document.getElementById('tooltip');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

console.log("Elementos DOM capturados:", { converterBtn, modal, closeBtn, copyBtn, tooltip, themeToggle });

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
converterBtn.addEventListener('click', () => {
    console.log("Botão Converter clicado");
    converterMoeda();
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
async function converterMoeda() {
    console.log("Iniciando função converterMoeda");
    const valor = parseFloat(document.getElementById('valor').value);
    const moedaOrigem = document.getElementById('moeda-origem').value;
    const moedaDestino = document.getElementById('moeda-destino').value;

    console.log("Dados de entrada:", { valor, moedaOrigem, moedaDestino });

    // Validações
    if (isNaN(valor) || valor <= 0) {
        console.log("Erro: Valor inválido");
        showError("Insira um valor válido maior que zero");
        return;
    }
    if (moedaOrigem === moedaDestino) {
        console.log("Erro: Moedas iguais");
        showError("Selecione moedas diferentes");
        return;
    }

    try {
        console.log("Fazendo requisição à ExchangeRate-API");
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${moedaOrigem}`);
        const data = await response.json();
        console.log("Resposta da API:", data);

        if (data.error) {
            console.log("Erro na API:", data.error);
            showError("Erro ao obter taxas de câmbio");
            return;
        }

        const taxa = data.rates[moedaDestino];
        const resultado = (valor * taxa).toFixed(2);
        console.log("Resultado da conversão:", resultado);

        const resultText = document.getElementById('modalResultText');
        resultText.textContent = `${valor.toFixed(2)} ${moedaOrigem} = ${resultado} ${moedaDestino}`;
        console.log("Conteúdo do modal atualizado, chamando abrirModal");
        abrirModal();
        clearError();
    } catch (error) {
        console.error("Erro ao converter moeda:", error);
        showError("Não foi possível realizar a conversão");
    }
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