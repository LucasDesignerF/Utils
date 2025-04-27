console.log("Script validador.js carregado com sucesso");

// DOM Elements
const validarBtn = document.getElementById('validar-btn');
const resultContainer = document.getElementById('result-container');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

console.log("Elementos DOM capturados:", { validarBtn, resultContainer, themeToggle });

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
validarBtn.addEventListener('click', () => {
    console.log("Botão Validar clicado");
    validarDocumento();
});

// Functions
function validarDocumento() {
    console.log("Iniciando função validarDocumento");
    const documento = document.getElementById('documento').value.replace(/[^\d]/g, '');
    console.log("Documento inserido:", documento);

    // Validações
    if (!documento) {
        console.log("Erro: Nenhum documento inserido");
        showResult("Por favor, insira um CPF ou CNPJ", "result-error");
        return;
    }

    if (documento.length === 11) {
        console.log("Validando CPF");
        if (validarCPF(documento)) {
            showResult("CPF válido!", "result-valid");
        } else {
            showResult("CPF inválido.", "result-invalid");
        }
    } else if (documento.length === 14) {
        console.log("Validando CNPJ");
        if (validarCNPJ(documento)) {
            showResult("CNPJ válido!", "result-valid");
        } else {
            showResult("CNPJ inválido.", "result-invalid");
        }
    } else {
        console.log("Erro: Comprimento inválido");
        showResult("Documento inválido. Insira um CPF (11 dígitos) ou CNPJ (14 dígitos).", "result-error");
    }
}

function validarCPF(cpf) {
    console.log("Executando validarCPF:", cpf);
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        console.log("CPF inválido: tamanho ou sequência repetida");
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
        console.log("CPF inválido: primeiro dígito verificador incorreto");
        return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) {
        console.log("CPF inválido: segundo dígito verificador incorreto");
        return false;
    }

    console.log("CPF válido");
    return true;
}

function validarCNPJ(cnpj) {
    console.log("Executando validarCNPJ:", cnpj);
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
        console.log("CNPJ inválido: tamanho ou sequência repetida");
        return false;
    }

    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj[i]) * pesos1[i];
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== parseInt(cnpj[12])) {
        console.log("CNPJ inválido: primeiro dígito verificador incorreto");
        return false;
    }

    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    soma = 0;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj[i]) * pesos2[i];
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    if (digito2 !== parseInt(cnpj[13])) {
        console.log("CNPJ inválido: segundo dígito verificador incorreto");
        return false;
    }

    console.log("CNPJ válido");
    return true;
}

function showResult(message, className) {
    console.log("Exibindo resultado:", message, className);
    resultContainer.textContent = message;
    resultContainer.className = `result-container ${className}`;
    resultContainer.style.display = 'block';
}