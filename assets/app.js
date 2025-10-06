// --- VARIÁVEIS DE CONFIGURAÇÃO (Supabase) ---
// Environment variables are injected by Vercel at build time
const supabaseUrl = 'VERCEL_SUPABASE_URL_PLACEHOLDER';
const supabaseAnonKey = 'VERCEL_SUPABASE_ANON_KEY_PLACEHOLDER';

// --- ESTADO DA APLICAÇÃO ---
let userId = 'initializing...'; // Inicialização
let isApiReady = false;
let selectedLanguage = 'pt'; // Default to Portuguese

// --- TRANSLATIONS ---
const translations = {
    pt: {
        // Language Selection
        selectLanguage: "Selecione o seu idioma",
        languageSubtitle: "Escolha o idioma para continuar com o estudo",
        continue: "Continuar",
        
        // Welcome Screen
        welcome: "Bem-vindo(a)!",
        welcomeSubtitle: "Agradecemos por dedicar alguns minutos para participar deste estudo.",
        objective: "Objetivo da Pesquisa:",
        objectiveText: "Queremos compreender melhor a perceção sobre programas de benefícios oferecidos por empresas. As respostas vão ajudar-nos a desenvolver soluções mais alinhadas com as demandas dos consumidores.",
        timeEstimated: "Tempo Estimado:",
        timeText: "A pesquisa leva cerca de 5 a 7 minutos para ser concluída.",
        confidentiality: "Confidencialidade:",
        confidentialityText: "As suas respostas são anónimas e serão utilizadas exclusivamente para fins internos, com o objetivo de gerar insights e melhorar os nossos serviços.",
        voluntary: "Participação Voluntária:",
        voluntaryText: "A participação é totalmente voluntária e pode ser interrompida a qualquer momento. Ao continuar, está a concordar com os termos acima.",
        next: "Avançar",
        
        // Attention Screen
        attentionTitle: "Aviso Importante",
        attentionText1: "A seguir, será apresentado uma notícia sobre um novo modelo de benefício.",
        attentionText2: "É fundamental que compreenda a sua descrição para a realização do estudo.",
        understood: "Compreendi, Avançar para a Explicação",
        
        // Explanation Screen
        explanationTitle: "NOVO MODELO DE CASHBACK CHEGA AO MERCADO",
        explanationText1: "O novo benefício tem como missão oferecer aos consumidores um cashback elevado, que pode chegar a 100% do valor da compra inicial, sem custos ou riscos adicionais.",
        explanationText2: "A cada compra realizada, a marca financia um investimento feito por especialistas nos mercados financeiros. Os resultados desses investimentos determinam o crescimento do cashback, que nunca será inferior a 0,5%.",
        explanationText3: "Os usuários podem acompanhar todo o processo em tempo real durante os 6 meses em que o investimento está ativo e realizar o resgate a qualquer momento.",
        proceed: "Para prosseguir, clique em 'Avançar'.",
        
        // Testimonials
        testimonialsTitle: "Experiências Reais dos Utilizadores",
        testimonialsSubtitle: "Veja como outros utilizadores já beneficiaram deste novo modelo de cashback:",
        testimonial1: "Comprei um telemóvel por €800 e recebi 30% (€240) de volta! O investimento funcionou perfeitamente e consegui resgatar o valor quando precisei.",
        testimonial2: "Consegui 25% de volta nas minhas férias! Foi uma surpresa agradável ver o cashback crescer ao longo dos meses.",
        testimonial3: "O meu cashback começou em 5% e subiu para 12% passado 1 mês. Muito bom! A flexibilidade de resgate é excelente.",
        tip: "Dica:",
        tipText: "Estes são exemplos reais de como o novo modelo de cashback pode beneficiar os utilizadores.",
        continueQuiz: "Agora vamos verificar se compreendeu o conceito.",
        continueQuizButton: "Continuar para o Quiz",
        
        // Quiz
        quizTitle: "Questões acerca do texto anterior",
        verifyAnswers: "Verificar Respostas",
        congratulations: "Parabéns!",
        quizSuccess: "Compreensão verificada. A preparar o estudo...",
        incorrectAnswers: "Tem {count} resposta(s) incorreta(s). Por favor, reveja as suas escolhas e tente novamente.",
        
        // Instructions
        instructionsTitle: "INSTRUÇÕES FINAIS PARA A TAREFA",
        instructionsText1: "Pedimos que leia atentamente os enunciados e as opções.",
        instructionsText2: "Em cada situação selecione a opção que representa a sua preferência real.",
        startTask: "Iniciar Tarefa Principal",
        
        // Staircase
        productProgress: "Produto {current} de {total}",
        imagineBuying: "Imagine que você está comprando {product}. Qual das seguintes opções prefere?",
        optionA: "Opção A: Cashback Investido",
        optionB: "Opção B: Desconto Imediato",
        
        // Demographics
        demographicsTitle: "Informação Sociodemográfica",
        demographicsSubtitle: "Por favor, preencha as seguintes questões. Os seus dados serão mantidos confidenciais e utilizados apenas para fins de análise estatística.",
        
        // Thank You
        thankYouTitle: "Obrigado(a) pela sua Participação!",
        thankYouText1: "O seu estudo está completo e as suas respostas foram guardadas com sucesso.",
        thankYouText2: "Agradecemos o seu tempo e contribuição.",
        userIdLabel: "O seu ID de Utilizador para verificação é:",
        
        // Common
        age: "Idade",
        gender: "Género",
        education: "Nível de Escolaridade (Consoante Portugal)",
        selectOption: "Selecione...",
        submit: "Concluir e Submeter Dados"
    },
    
    en: {
        // Language Selection
        selectLanguage: "Select your language",
        languageSubtitle: "Choose the language to continue with the study",
        continue: "Continue",
        
        // Welcome Screen
        welcome: "Welcome!",
        welcomeSubtitle: "Thank you for taking a few minutes to participate in this study.",
        objective: "Research Objective:",
        objectiveText: "We want to better understand perceptions about benefit programs offered by companies. Your responses will help us develop solutions more aligned with consumer demands.",
        timeEstimated: "Estimated Time:",
        timeText: "The survey takes about 5 to 7 minutes to complete.",
        confidentiality: "Confidentiality:",
        confidentialityText: "Your responses are anonymous and will be used exclusively for internal purposes, with the goal of generating insights and improving our services.",
        voluntary: "Voluntary Participation:",
        voluntaryText: "Participation is completely voluntary and can be interrupted at any time. By continuing, you agree to the terms above.",
        next: "Next",
        
        // Attention Screen
        attentionTitle: "Important Notice",
        attentionText1: "Next, you will be presented with news about a new benefit model.",
        attentionText2: "It is essential that you understand its description for the study.",
        understood: "I understand, proceed to explanation",
        
        // Explanation Screen
        explanationTitle: "NEW CASHBACK MODEL ARRIVES IN THE MARKET",
        explanationText1: "The new benefit aims to offer consumers high cashback, which can reach 100% of the initial purchase value, without additional costs or risks.",
        explanationText2: "With each purchase made, the brand finances an investment made by financial market specialists. The results of these investments determine cashback growth, which will never be less than 0.5%.",
        explanationText3: "Users can follow the entire process in real time during the 6 months that the investment is active and withdraw at any time.",
        proceed: "To proceed, click 'Next'.",
        
        // Testimonials
        testimonialsTitle: "Real User Experiences",
        testimonialsSubtitle: "See how other users have already benefited from this new cashback model:",
        testimonial1: "I bought a phone for €800 and received 30% (€240) back! The investment worked perfectly and I was able to withdraw the amount when I needed it.",
        testimonial2: "I got 25% back on my vacation! It was a pleasant surprise to see the cashback grow over the months.",
        testimonial3: "My cashback started at 5% and rose to 12% after 1 month. Very good! The withdrawal flexibility is excellent.",
        tip: "Tip:",
        tipText: "These are real examples of how the new cashback model can benefit users.",
        continueQuiz: "Now let's verify if you understood the concept.",
        continueQuizButton: "Continue to Quiz",
        
        // Quiz
        quizTitle: "Questions about the previous text",
        verifyAnswers: "Verify Answers",
        congratulations: "Congratulations!",
        quizSuccess: "Understanding verified. Preparing the study...",
        incorrectAnswers: "You have {count} incorrect answer(s). Please review your choices and try again.",
        
        // Instructions
        instructionsTitle: "FINAL INSTRUCTIONS FOR THE TASK",
        instructionsText1: "We ask that you read the statements and options carefully.",
        instructionsText2: "In each situation, select the option that represents your real preference.",
        startTask: "Start Main Task",
        
        // Staircase
        productProgress: "Product {current} of {total}",
        imagineBuying: "Imagine you are buying {product}. Which of the following options do you prefer?",
        optionA: "Option A: Invested Cashback",
        optionB: "Option B: Immediate Discount",
        
        // Demographics
        demographicsTitle: "Sociodemographic Information",
        demographicsSubtitle: "Please fill out the following questions. Your data will be kept confidential and used only for statistical analysis purposes.",
        
        // Thank You
        thankYouTitle: "Thank you for your participation!",
        thankYouText1: "Your study is complete and your responses have been saved successfully.",
        thankYouText2: "We appreciate your time and contribution.",
        userIdLabel: "Your User ID for verification is:",
        
        // Common
        age: "Age",
        gender: "Gender",
        education: "Education Level",
        selectOption: "Select...",
        submit: "Complete and Submit Data"
    },
    
    es: {
        // Language Selection
        selectLanguage: "Selecciona tu idioma",
        languageSubtitle: "Elige el idioma para continuar con el estudio",
        continue: "Continuar",
        
        // Welcome Screen
        welcome: "¡Bienvenido/a!",
        welcomeSubtitle: "Gracias por dedicar unos minutos a participar en este estudio.",
        objective: "Objetivo de la Investigación:",
        objectiveText: "Queremos comprender mejor la percepción sobre los programas de beneficios ofrecidos por las empresas. Tus respuestas nos ayudarán a desarrollar soluciones más alineadas con las demandas de los consumidores.",
        timeEstimated: "Tiempo Estimado:",
        timeText: "La encuesta toma aproximadamente 5 a 7 minutos para completarse.",
        confidentiality: "Confidencialidad:",
        confidentialityText: "Tus respuestas son anónimas y serán utilizadas exclusivamente para fines internos, con el objetivo de generar insights y mejorar nuestros servicios.",
        voluntary: "Participación Voluntaria:",
        voluntaryText: "La participación es completamente voluntaria y puede ser interrumpida en cualquier momento. Al continuar, estás de acuerdo con los términos anteriores.",
        next: "Siguiente",
        
        // Attention Screen
        attentionTitle: "Aviso Importante",
        attentionText1: "A continuación, se te presentará una noticia sobre un nuevo modelo de beneficio.",
        attentionText2: "Es fundamental que comprendas su descripción para la realización del estudio.",
        understood: "Entendido, proceder a la explicación",
        
        // Explanation Screen
        explanationTitle: "NUEVO MODELO DE CASHBACK LLEGA AL MERCADO",
        explanationText1: "El nuevo beneficio tiene como misión ofrecer a los consumidores un cashback elevado, que puede llegar al 100% del valor de la compra inicial, sin costos o riesgos adicionales.",
        explanationText2: "Con cada compra realizada, la marca financia una inversión realizada por especialistas en los mercados financieros. Los resultados de estas inversiones determinan el crecimiento del cashback, que nunca será inferior al 0,5%.",
        explanationText3: "Los usuarios pueden seguir todo el proceso en tiempo real durante los 6 meses en que la inversión está activa y realizar el rescate en cualquier momento.",
        proceed: "Para proceder, haz clic en 'Siguiente'.",
        
        // Testimonials
        testimonialsTitle: "Experiencias Reales de los Usuarios",
        testimonialsSubtitle: "Ve cómo otros usuarios ya se han beneficiado de este nuevo modelo de cashback:",
        testimonial1: "Compré un teléfono por €800 y recibí 30% (€240) de vuelta! La inversión funcionó perfectamente y pude retirar el valor cuando lo necesité.",
        testimonial2: "Conseguí 25% de vuelta en mis vacaciones! Fue una sorpresa agradable ver el cashback crecer a lo largo de los meses.",
        testimonial3: "Mi cashback comenzó en 5% y subió a 12% después de 1 mes. ¡Muy bueno! La flexibilidad de rescate es excelente.",
        tip: "Consejo:",
        tipText: "Estos son ejemplos reales de cómo el nuevo modelo de cashback puede beneficiar a los usuarios.",
        continueQuiz: "Ahora vamos a verificar si comprendiste el concepto.",
        continueQuizButton: "Continuar al Quiz",
        
        // Quiz
        quizTitle: "Preguntas sobre el texto anterior",
        verifyAnswers: "Verificar Respuestas",
        congratulations: "¡Felicitaciones!",
        quizSuccess: "Comprensión verificada. Preparando el estudio...",
        incorrectAnswers: "Tienes {count} respuesta(s) incorrecta(s). Por favor, revisa tus elecciones e intenta de nuevo.",
        
        // Instructions
        instructionsTitle: "INSTRUCCIONES FINALES PARA LA TAREA",
        instructionsText1: "Te pedimos que leas atentamente los enunciados y las opciones.",
        instructionsText2: "En cada situación selecciona la opción que representa tu preferencia real.",
        startTask: "Iniciar Tarea Principal",
        
        // Staircase
        productProgress: "Producto {current} de {total}",
        imagineBuying: "Imagina que estás comprando {product}. ¿Cuál de las siguientes opciones prefieres?",
        optionA: "Opción A: Cashback Invertido",
        optionB: "Opción B: Descuento Inmediato",
        
        // Demographics
        demographicsTitle: "Información Sociodemográfica",
        demographicsSubtitle: "Por favor, completa las siguientes preguntas. Tus datos serán mantenidos confidenciales y utilizados únicamente para fines de análisis estadístico.",
        
        // Thank You
        thankYouTitle: "¡Gracias por tu participación!",
        thankYouText1: "Tu estudio está completo y tus respuestas han sido guardadas exitosamente.",
        thankYouText2: "Agradecemos tu tiempo y contribución.",
        userIdLabel: "Tu ID de Usuario para verificación es:",
        
        // Common
        age: "Edad",
        gender: "Género",
        education: "Nivel de Escolaridad",
        selectOption: "Seleccionar...",
        submit: "Completar y Enviar Datos"
    }
};

// --- TRANSLATION HELPER ---
function t(key, params = {}) {
    const translation = translations[selectedLanguage][key] || translations['pt'][key] || key;
    return translation.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
}

// --- NOVO: Mapeamento de Imagens para Cada Produto ---
const productImages = {
    'low': 'https://img01.ztat.net/article/spp-media-p1/094e544331cb45c08f5d73538ff6cf78/bbe4e28369fa4d77ab539d9257696276.jpg?imwidth=1800&filter=packshot', // T-shirt
    'medium': 'https://d.media.kavehome.com/image/upload/w_1900,f_auto/v1755600386/products/CC0008M40_1V01.jpg', // Mesa
    'high': 'https://www.backmarket.pt/cdn-cgi/image/format%3Dauto%2Cquality%3D75%2Cwidth%3D1080/https://d2e6ccujb3mkqf.cloudfront.net/9c478b70-4c93-4f0b-ba40-7abcc00d93df-2_a2b1ded4-2162-4a62-bfc9-3767a77e01a9.jpg' // Notebook
};

// --- Mapeamento de Cores para Cada Produto ---
const productAccentColors = {
    'low': { accent: 'product-low-accent', border: 'product-low-border-selected' },
    'medium': { accent: 'product-medium-accent', border: 'product-medium-border-selected' },
    'high': { accent: 'product-high-accent', border: 'product-high-border-selected' }
};

// --- FUNÇÃO DE INICIALIZAÇÃO SUPABASE ---
async function initializeSupabase() {
    try {
        // Verifica se há configuração Supabase válida
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === window.location.origin) {
            console.warn("Nenhuma configuração Supabase válida fornecida. O estudo será executado, mas os resultados NÃO serão salvos.");
            userId = crypto.randomUUID(); 
            isApiReady = false; // Desativa a persistência
            return;
        }

        // Gera um ID único para o utilizador
        userId = crypto.randomUUID(); 
        isApiReady = true;
        console.log("Supabase configurado. User ID:", userId);
        
    } catch (error) {
        console.error("Falha na inicialização do Supabase. Usando ID aleatório:", error);
        userId = crypto.randomUUID(); 
        isApiReady = false; // Garante que não haverá tentativas de salvar se houver falha
    }
}

// --- CONFIGURAÇÃO DO ESTUDO ---
const config = {
    priceLevels: [
        { id: 'low', name: 'uma T-shirt', price: 40, currency: '€' },
        { id: 'medium', name: 'uma Mesa', price: 250, currency: '€' },
        { id: 'high', name: 'um Computador', price: 1000, currency: '€' }
    ],
    staircase: {
        // Pontos de partida possíveis: 5% (baixo), 15% (médio), 25% (alto)
        startDiscounts: [10, 25, 40], 
        // *** ALTERAÇÃO SOLICITADA: stepSizes mudado para [16, 8, 4, 2, 1, 0.5] ***
        // O array tem 6 elementos. A 5ª reversão (reversals=5) vai pegar o índice 5 (0.5).
        stepSizes: [32, 16, 8, 4, 2, 1], 
        reversalsToEnd: 6,
        // **ATUALIZADO:** 1 Catch Trial por produto.
        ctPerStaircase: 1, 
        // Número máximo de trial para gerar o índice CT aleatório.
        maxTrialsToGenerateCT: 8 
    },
    verificationQuestions: [
        {
            question: "Qual é o valor mínimo de cashback que tem garantido em qualquer compra neste novo modelo?",
            options: [
                { text: "100%", isCorrect: false },
                { text: "0,5%", isCorrect: true },
                { text: "5%", isCorrect: false }
            ]
        },
        {
            question: "Qual é o retorno máximo que pode atingir com o valor investido do seu cashback?",
            options: [
                { text: "O dobro do valor da compra.", isCorrect: false },
                { text: "100% do valor da compra.", isCorrect: true },
                { text: "50% do valor da compra.", isCorrect: false }
            ]
        },
        {
            question: "Por quanto tempo o valor do cashback fica investido e qual a flexibilidade de levantamento?",
            options: [
                { text: "Fica investido por 6 meses e não pode ser levantado antes.", isCorrect: false },
                { text: "Fica investido por 12 meses, mas pode levantar a qualquer momento.", isCorrect: false },
                // ALTERAÇÃO SOLICITADA: Nova Opção Correta
                { text: "Fica investido por 6 meses e pode ser levantado a qualquer momento (mesmo após os 6 meses)", isCorrect: true }
            ]
        }
    ]
};

// --- ESTADO DA APLICAÇÃO ---
let state = {
    currentScreen: 'loading',
    staircases: [],
    currentStaircaseIndex: -1,
    shuffledOrder: [], // Contém a ordem aleatória de índices [1, 0, 2]
    quizAnswers: Array(config.verificationQuestions.length).fill(null),
    demographicsData: null,
    indifferencePoints: {},
    isCurrentTrialCatch: false, // Flag para o trial em execução ser um Catch Trial
    // NOVOS CAMPOS ADICIONADOS AQUI (Q1 e Q2 da Demografia)
    priceResearch: null, // NOVO: Costuma fazer pesquisa de preço
    purchasePreference: null, // NOVO: Prefere presencial ou online
    // CAMPOS DO QUIZ DE EXPERIÊNCIA TRADICIONAL (Agora parte da Demografia)
    usedTraditionalCashback: null, 
    experienceRating: null,        
    ratingJustification: "",       
};

// --- FUNÇÕES DE PERSISTÊNCIA (FIRESTORE) ---

/**
 * Salva os resultados do estudo via API Supabase.
 */
async function saveResultsToSupabase(indifferencePoints, demographicsData) {
    if (!isApiReady) {
        console.error("API não está inicializada ou configurada. Os dados NÃO foram salvos.");
        return;
    }
    
    try {
        // Mapeia o histórico para inclusão de variáveis de controle (Ordem e Âncora)
        const rawHistory = state.staircases.map(s => {
            // Encontra o índice original do produto (0, 1, ou 2)
            const originalIndex = config.priceLevels.findIndex(p => p.id === s.id);
            // Encontra a posição desse índice na array de ordem embaralhada. A posição + 1 é a ordem de apresentação.
            const presentationIndex = state.shuffledOrder.indexOf(originalIndex) + 1; // 1, 2, ou 3

            return {
                id: s.id,
                name: s.name.replace('uma ', '').replace('um ', '').replace('uns ', ''),
                presentationOrder: presentationIndex, // Ordem em que o produto foi apresentado
                startDiscount: s.initialDiscount, // Ponto de partida inicial (Âncora)
                price: s.price,
                currency: s.currency,
                failedCatchTrials: s.failedCatchTrials, // Número de falhas no catch trial
                ctIndices: s.ctIndices, // Índices onde o CT ocorreu (para verificação)
                history: s.history,
            };
        });

        const resultsData = {
            indifferencePoints: indifferencePoints,
            rawHistory: rawHistory, // Contém Ordem, Âncora e Histórico Completo
            // CAMPOS DO QUIZ DE EXPERIÊNCIA ATUALIZADOS
            experienceQuiz: {
                usedTraditionalCashback: state.usedTraditionalCashback,
                experienceRating: state.experienceRating,
                ratingJustification: state.ratingJustification, 
            }
        };

        // Envia dados para a API Vercel
        const response = await fetch('/api/save-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resultsData,
                demographicsData,
                userId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Resultados do método escada salvos com sucesso.");

    } catch (e) {
        console.error("Erro ao salvar dados no servidor:", e);
        alert("Erro ao salvar dados no servidor. Verifique o console para mais detalhes.");
    }
}

// --- FUNÇÕES DE NAVEGAÇÃO E LÓGICA ---

/**
 * Alterna o ecrã a ser exibido com um efeito de fade.
 */
function renderScreen(screenName, data = {}) {
    state.currentScreen = screenName;
    const contentArea = document.getElementById('content-area');
    const surveyContainer = document.getElementById('survey-container');
    
    // 1. Inicia o Fade Out
    // Adicionar a classe 'fade-out' ao #content-area
    contentArea.classList.add('fade-out');

    // Tempo de espera para o fade out (300ms)
    setTimeout(() => {
        
        // AJUSTE DE ESTILO: Tela de Aviso Chamativa (Remove o branco de fora)
        if (screenName === 'attention_screen' || screenName === 'instruction_reminder') {
            // Remove o estilo 'card' (background branco, box-shadow e padding de 2rem)
            surveyContainer.classList.remove('card'); 
            // Adiciona o background amarelo chamativo ao container principal
            surveyContainer.classList.add('bg-yellow-100'); 
            // Remove o padding e sombra para que o conteúdo preencha
            surveyContainer.style.padding = '0';
            surveyContainer.style.boxShadow = 'none'; 
        } else {
            // Restaura o estilo 'card' para todas as outras telas
            surveyContainer.classList.add('card');
            surveyContainer.classList.remove('bg-yellow-100');
            surveyContainer.style.padding = ''; // Volta ao padding default de 2rem
            surveyContainer.style.boxShadow = ''; // Volta à sombra default
        }
        
        // Limpa a área de conteúdo
        contentArea.innerHTML = '';
        
        // 2. Gera o novo conteúdo
        switch (screenName) {
            case 'language_selection':
                contentArea.innerHTML = renderLanguageSelectionScreen();
                break;
            case 'welcome':
                contentArea.innerHTML = renderWelcomeScreen();
                break;
            case 'attention_screen': 
                contentArea.innerHTML = renderAttentionScreen();
                break;
            case 'explanation':
                contentArea.innerHTML = renderExplanationScreen();
                break;
            case 'testimonials':
                contentArea.innerHTML = renderTestimonialsScreen();
                break;
            case 'quiz':
                contentArea.innerHTML = renderQuizScreen();
                renderQuizQuestions(); 
                break;
            case 'instruction_reminder': // NOVO ECRÃ DE INSTRUÇÕES
                contentArea.innerHTML = renderInstructionReminderScreen();
                break;
            case 'staircase':
                contentArea.innerHTML = renderQuestionScreen(data.staircase); 
                break;
            case 'demographics': // Ecrã alterado para ser o segundo no fluxo. (REQUISITO 1)
                contentArea.innerHTML = renderDemographicsScreen();
                // Chama a função de UI para configurar a validação inicial do quiz complexo
                // e anexar o listener da justificação (textarea)
                setTimeout(() => {
                    updateDemographicsUI();
                    document.getElementById('rating-justification')?.addEventListener('input', (e) => {
                        state.ratingJustification = e.target.value;
                        updateDemographicsUI();
                    });
                }, 0); 
                break;
            case 'thank_you':
                contentArea.innerHTML = renderThankYouScreen();
                break;
            default:
                contentArea.innerHTML = '<p class="text-center text-red-500">Erro: Ecrã não encontrado.</p>';
        }
        
        // 3. Inicia o Fade In
        // Remove a classe 'fade-out' e o conteúdo volta à opacidade 1 (fade-in)
        contentArea.classList.remove('fade-out');
        
    }, 300); // Duração do fade-out
}
// Torna a função globalmente acessível para ser usada nos 'onclick' do HTML
window.renderScreen = renderScreen; 

/**
 * Formata um valor numérico para moeda. 
 * ALTERADO: Garante que o valor não tem casas decimais se for inteiro.
 */
function formatCurrency(value, currency) {
    // Verifica se o valor é (quase) um inteiro
    const isInteger = Math.abs(value - Math.round(value)) < 1e-9;
    
    if (isInteger) {
        // Para valores inteiros, formata sem casas decimais
        return `${Math.round(value)}${currency}`;
    } else {
        // Para valores não inteiros (como o cashback garantido), usa 2 casas decimais.
        // A substituição de '.' por ',' é para o formato português.
        return `${value.toFixed(2).replace('.', ',')}${currency}`; 
    }
}

// --- FUNÇÕES ESPECÍFICAS DO ESTUDO ---

/**
 * Gera 'count' números inteiros únicos no intervalo [1, max].
 * @param {number} count - Quantidade de números a gerar.
 * @param {number} max - Valor máximo (inclusivo).
 * @returns {Array<number>}
 */
function generateUniqueRandomIndices(count, max) {
    const indices = new Set();
    while (indices.size < count) {
        // Gera um número entre 1 e max
        const randomIndex = Math.floor(Math.random() * max) + 1;
        indices.add(randomIndex);
    }
    return Array.from(indices);
}

window.initializeStudy = () => {
    // Embaralha a ordem dos produtos
    state.shuffledOrder = config.priceLevels
        .map((value, index) => ({ value, sort: Math.random(), index }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ index }) => index);

    // Inicializa as escadas
    state.staircases = config.priceLevels.map(level => {
        const startOptions = config.staircase.startDiscounts;
        const randomIndex = Math.floor(Math.random() * startOptions.length);
        const initialDiscount = startOptions[randomIndex];
        
        // Geração do índice de Catch Trial: 1 CT por escada (produto)
        const ctIndices = generateUniqueRandomIndices(
            config.staircase.ctPerStaircase, // Agora é 1
            config.staircase.maxTrialsToGenerateCT // Agora é 8
        );

        return {
            ...level,
            status: 'pending', 
            initialDiscount: initialDiscount, 
            currentDiscount: initialDiscount,
            history: [], 
            reversals: 0,
            lastChoice: null,
            reversalPoints: [], // Armazena APENAS descontos dos trials normais que resultaram em reversão
            trialCount: 0, // Contador de tentativas (começa em 0)
            failedCatchTrials: 0, 
            ctIndices: ctIndices.sort((a, b) => a - b), // Índices onde o Catch Trial deve ocorrer (terá apenas 1 índice)
        };
    });

    state.currentStaircaseIndex = 0;
    state.isCurrentTrialCatch = false; 
    runNextStaircase();
}

function runNextStaircase() {
    const realIndex = state.shuffledOrder[state.currentStaircaseIndex];
    const currentStaircase = state.staircases[realIndex];

    if (!currentStaircase) {
        // Fim das escadas
        calculateIndifferencePoints(); 
        // **CORREÇÃO:** Após calcular os pontos, chama a função final de salvamento e agradecimento.
        saveAllAndThankYou(); 
        return;
    }
    
    currentStaircase.status = 'active';

    // Verifica se o PRÓXIMO trial (trialCount + 1) deve ser um Catch Trial
    const nextTrialNumber = currentStaircase.trialCount + 1;
    state.isCurrentTrialCatch = currentStaircase.ctIndices.includes(nextTrialNumber);

    renderScreen('staircase', { staircase: currentStaircase });
}

// CORREÇÃO: Função handleStaircaseChoice acessível globalmente
window.handleStaircaseChoice = (choice) => {
    const realIndex = state.shuffledOrder[state.currentStaircaseIndex];
    const staircase = state.staircases[realIndex];

    const optionA = document.getElementById('cashback-option');
    const optionB = document.getElementById('discount-option');

    // Determina as classes de acento/borda do produto atual
    const { accent: accentClass, border: borderClass } = productAccentColors[staircase.id];
    
    // Remove todas as classes de borda específicas do produto e a classe 'selected'
    Object.values(productAccentColors).forEach(color => {
        optionA?.classList.remove(color.border);
        optionB?.classList.remove(color.border);
    });
    optionA?.classList.remove('selected');
    optionB?.classList.remove('selected');
    
    // Highlight current selection
    const selectedOption = document.getElementById(`${choice}-option`);
    selectedOption?.classList.add('selected');
    selectedOption?.classList.add(borderClass);


    // 1. Prepara log e incrementa contador
    staircase.trialCount++; 
    const trialDiscount = state.isCurrentTrialCatch ? 100 : staircase.currentDiscount; // Desconto de 100% no CT

    // 2. Lógica do Catch Trial
    if (state.isCurrentTrialCatch) {
        
        // ***** GARANTIA DE EXCLUSÃO 1/2: Nenhuma lógica de Reversão ou Ajuste de Escada é executada *****

        // Regra do Catch Trial: Se for Catch Trial (100% Desconto) e o usuário escolher Cashback (Opção A) -> FALHA
        if (choice === 'cashback') {
            staircase.failedCatchTrials++;
            console.warn(`Catch Trial Falhou para ${staircase.name}. Escolha: Cashback (Opção A) @ 100% Desconto.`);
        }
        
        // Log do Catch Trial
        staircase.history.push({ 
            choice, 
            discount: trialDiscount,
            trialNumber: staircase.trialCount, 
            trialType: 'catch',
            catchFailed: (choice === 'cashback')
        });
        
        state.isCurrentTrialCatch = false; 
        
        // Transição de 500ms (ver a seleção) + (fade out/in)
        setTimeout(runNextStaircase, 500); 
        return; // Encerra o processamento do trial
    }

    // --- Lógica NORMAL do Método Escada (Apenas para trials normais) ---
    
    // Log do Trial Normal
    staircase.history.push({ 
        choice, 
        discount: trialDiscount, 
        trialNumber: staircase.trialCount, 
        trialType: 'normal' 
    });

    const isReversal = staircase.lastChoice && staircase.lastChoice !== choice;
    if (isReversal) {
        staircase.reversals++;
        // ***** GARANTIA DE EXCLUSÃO 2/2: APENAS trials normais (não Catch) que resultam em reversão
        // adicionam o ponto de desconto à lista usada para o cálculo final do Indifference Point. *****
        staircase.reversalPoints.push(staircase.currentDiscount);
    }
    staircase.lastChoice = choice;

    if (staircase.reversals >= config.staircase.reversalsToEnd) {
        staircase.status = 'completed';
        state.currentStaircaseIndex++;
        // Transição de 500ms (ver a seleção) + (fade out/in)
        setTimeout(runNextStaircase, 500); 
        return;
    }

    // Calcula o tamanho do passo baseado no número de reversões
    const stepIndex = Math.min(staircase.reversals, config.staircase.stepSizes.length - 1);
    const stepSize = config.staircase.stepSizes[stepIndex];
    
    if (choice === 'discount') { // Escolheu desconto, precisa de um desconto menor para voltar ao cashback.
        staircase.currentDiscount -= stepSize;
    } else { // Escolheu cashback, precisa de um desconto maior para trocar para o desconto.
        staircase.currentDiscount += stepSize;
    }
    
    // Limites de 0% a 100%
    if(staircase.currentDiscount < 0) {
      staircase.currentDiscount = 0;
    } else if (staircase.currentDiscount > 100) {
        staircase.currentDiscount = 100;
    }
    
    // Transição de 500ms (ver a seleção) + (fade out/in)
    setTimeout(() => runNextStaircase(), 500);
}


function selectQuizAnswer(qIndex, optIndex) {
    state.quizAnswers[qIndex] = optIndex;
    
    const optionsContainer = document.getElementById(`question-${qIndex}`);
    const optionCards = optionsContainer.querySelectorAll('.quiz-option');
    
    optionCards.forEach((card, index) => {
        // Adiciona ou remove a classe 'selected'
        if (index === optIndex) {
            card.classList.add('selected');
            // Garante que a borda de seleção seja azul (indigo) no quiz
            card.classList.add('accent-blue-border'); 
        } else {
            card.classList.remove('selected');
            card.classList.remove('accent-blue-border');
        }
    });
    
    updateQuizSubmitButton();
}
window.selectQuizAnswer = selectQuizAnswer; // Torna a função global

// FUNÇÃO UNIFICADA PARA SELECIONAR RESPOSTAS DO QUIZ TRADICIONAL / NOVAS PERGUNTAS DE DEMOGRAFIA
window.selectTraditionalQuizAnswer = (questionId, answer) => {
    // NOVO: Q1 Demografia
    if (questionId === 'priceResearch') {
        state.priceResearch = answer;
    // NOVO: Q2 Demografia
    } else if (questionId === 'purchasePreference') {
        state.purchasePreference = answer;
    // EXISTENTE: Q3.1 (Cashback Tradicional)
    } else if (questionId === 'usedTraditionalCashback') {
        state.usedTraditionalCashback = answer;
        
        // *** LÓGICA DE VISIBILIDADE DA PERGUNTA 3.2 ***
        const q2Group = document.getElementById('question-group-2');
        
        if (q2Group) {
            // Se a Q3.1 mudar para 'Não'
            if (answer === 'Não') {
                state.ratingJustification = "";
                const textarea = document.getElementById('rating-justification');
                if (textarea) textarea.value = "";
                state.experienceRating = null; // Limpa o rating se mudar para 'Não'
                
                // Esconde a Pergunta 3.2 (Classificação)
                q2Group.style.display = 'none'; 
            } else if (answer === 'Sim') {
                // Mostra a Pergunta 3.2 (Classificação)
                q2Group.style.display = 'block';
            }
        }

    } else if (questionId === 'experienceRating') {
        // Para a escala Likert, o valor é o número (1 a 5)
        const newRating = parseInt(answer, 10);
        
        // Se for um novo rating, limpa a justificação
        if (state.experienceRating !== newRating) {
            state.ratingJustification = ""; // Limpa a justificação ao mudar o rating
            const textarea = document.getElementById('rating-justification');
            if (textarea) textarea.value = "";
        }

        state.experienceRating = newRating; 
    }
    
    // Remove a seleção anterior e aplica a nova
    const options = document.querySelectorAll(`[data-question-id="${questionId}"]`);
    options.forEach(opt => {
        opt.classList.remove('selected', 'accent-blue-border');
        if (opt.dataset.answer === answer) {
            opt.classList.add('selected', 'accent-blue-border');
        }
    });
    
    // Se mudou a classificação, força a revalidação
    if (questionId === 'experienceRating') {
        const justificationField = document.getElementById('justification-group');
        const isNeutral = state.experienceRating === 3;
        
        // 1. Mostra/Oculta o campo de justificação
        if (justificationField) {
            justificationField.style.display = isNeutral ? 'none' : 'block';
        }
        
        // 2. Se a nova resposta for '3', limpa a justificação e remove o requisito
        if (isNeutral) {
            state.ratingJustification = ""; // Limpa a justificação se for neutro
            const textarea = document.getElementById('rating-justification');
            if (textarea) textarea.value = "";
        }
    }
    
    // O updateDemographicsUI é agora responsável pela validação do botão principal
    updateDemographicsUI();
}

function submitQuiz() {
    let allCorrect = true;
    let incorrectCount = 0;
    const quizMessage = document.getElementById('quiz-message');

    state.quizAnswers.forEach((selectedOptIndex, qIndex) => {
        const question = config.verificationQuestions[qIndex];
        // Verifica se o índice de opção selecionado é válido e se a opção é a correta
        const isCorrect = question.options[selectedOptIndex]?.isCorrect;
        
        if (!isCorrect) {
            allCorrect = false;
            incorrectCount++;
        }
    });

    if (allCorrect) {
        quizMessage.className = 'text-center text-green-600 font-medium mb-4';
        quizMessage.innerHTML = "<strong>Parabéns!</strong> Compreensão verificada. A preparar o estudo...";
        document.getElementById('submit-quiz-btn').disabled = true;
        
        // Vai para a nova página de instruções antes de iniciar o estudo
        setTimeout(() => renderScreen('instruction_reminder'), 500); 
    } else {
        quizMessage.className = 'text-center text-red-600 font-medium mb-4';
        quizMessage.innerHTML = `Tem <strong>${incorrectCount}</strong> resposta(s) incorreta(s). Por favor, reveja as suas escolhas e tente novamente.`;
        document.getElementById('submit-quiz-btn').disabled = false;
    }
}
window.submitQuiz = submitQuiz; // Torna a função global

function updateQuizSubmitButton() {
    const allAnswered = state.quizAnswers.every(answer => answer !== null);
    document.getElementById('submit-quiz-btn').disabled = !allAnswered;
}

function calculateIndifferencePoints() {
    state.indifferencePoints = {};
    state.staircases.forEach(staircase => {
        
        // ***** GARANTIA DE EXCLUSÃO 3/3: Usa APENAS a array 'reversalPoints', que só contém
        // dados de trials normais (não Catch) que resultaram em reversão. *****
        
        // Utiliza a média dos últimos 4 pontos de reversão
        const relevantReversals = staircase.reversalPoints.slice(-4); 
        let indifferencePoint = 0;

        if (relevantReversals.length > 0) {
           const sum = relevantReversals.reduce((acc, val) => acc + val, 0);
           indifferencePoint = sum / relevantReversals.length;
        } else {
            // Caso não haja reversões suficientes (pode ocorrer se o participante parar cedo)
            indifferencePoint = staircase.currentDiscount; 
        }
        
        state.indifferencePoints[staircase.id] = {
            name: staircase.name.replace('uma ', '').replace('um ', '').replace('uns ', ''),
            price: formatCurrency(staircase.price, staircase.currency),
            point: indifferencePoint.toFixed(2)
        };
    });
}

// NOVO: Função para salvar todos os dados (Pontos de Indiferença e Demográficos)
// e terminar o estudo. Chamada após o fim do método escada.
async function saveAllAndThankYou() {
    if (!state.demographicsData) {
        console.error("Dados demográficos ausentes. Não é possível salvar os resultados completos.");
        // Em caso de falha na recolha de demográficos (se a tela for pulada), adiciona um marcador
        state.demographicsData = { error: "Demographics Missing" }; 
    }
    await saveResultsToSupabase(state.indifferencePoints, state.demographicsData);
    renderScreen('thank_you');
}


window.handleDemographicsSubmit = async (event) => {
    event.preventDefault();
    
    // 1. Validação do Bloco Customizado (inclui Q1, Q2, Q3.1-3.2 e Justificação)
    // Se a validação falhar, a UI já deve ter bloqueado o botão, mas esta é a checagem final.
    if (!updateDemographicsUI()) {
        alert("Por favor, preencha as questões obrigatórias sobre a sua experiência antes de submeter.");
        return; 
    }
    
    // 2. Coletar dados do formulário HTML
    const data = {};
    const formData = new FormData(document.getElementById('demographics-form'));
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // 3. Adicionar as respostas das questões de escolha rápida e do quiz que não são parte do FormData
    data.priceResearch = state.priceResearch;
    data.purchasePreference = state.purchasePreference;
    data.usedTraditionalCashback = state.usedTraditionalCashback;
    data.experienceRating = state.experienceRating;
    data.ratingJustification = state.ratingJustification;
    
    state.demographicsData = data;
    
    // 4. REMOVIDO: Salvar no Firestore neste momento. Os dados demográficos estão agora no 'state'.
    
    // 5. Mostrar Ecrã de Aviso (Attention Screen) para CONTINUAR o estudo.
    renderScreen('attention_screen');
}

// NOVO: Atualiza o estado visual e do botão de submissão do formulário de Demografia
function updateDemographicsUI() {
    // 1. VALIDAÇÃO DOS NOVOS CAMPOS (Q1 e Q2)
    const q_priceResearch_answered = state.priceResearch !== null;
    const q_purchasePreference_answered = state.purchasePreference !== null;
    
    // 2. VALIDAÇÃO DO QUIZ COMPLEXO (Grupo Q3)
    const usedCashback = state.usedTraditionalCashback;
    const rating = state.experienceRating;
    const justification = state.ratingJustification.trim();
    
    // A justificação é obrigatória SE o rating for obrigatório (usou cashback) E não for 'Neutra' (3)
    const isJustificationRequired = (usedCashback === 'Sim' && rating !== null && rating !== 3);
    
    const isJustificationValid = !isJustificationRequired || (isJustificationRequired && justification.length >= 5);

    // Pergunta 3.1 tem que estar respondida
    const q3_1_Answered = usedCashback !== null;
    
    // Pergunta 3.2 (Rating) é considerada respondida se:
    const q3_2_Answered = usedCashback === 'Não' || (usedCashback === 'Sim' && typeof rating === 'number' && rating >= 1 && rating <= 5);

    // Verifica se todas as CUSTOM questions têm resposta E se a justificação (se necessária) é válida
    const allCustomAnsweredAndValid = 
        q_priceResearch_answered &&         // Novo Q1
        q_purchasePreference_answered &&    // Novo Q2
        q3_1_Answered && q3_2_Answered && // Grupo Q3 (3.3 removida)
        isJustificationValid;

    // 3. ATUALIZAÇÃO DO ESTADO VISUAL DO CAMPO DE JUSTIFICAÇÃO
    const justificationTextarea = document.getElementById('rating-justification');
    const justificationLabel = document.getElementById('justification-label');
    const errorMessageElement = document.getElementById('justification-error'); 
    
    if (justificationTextarea && justificationLabel) {
        // Lógica de exibição da Justificativa
        const justificationGroup = document.getElementById('justification-group');
        const isRatingSelected = (typeof rating === 'number' && rating >= 1 && rating <= 5);
        
        if (justificationGroup) {
            if (usedCashback === 'Sim' && isRatingSelected) {
                // Só mostra o campo de justificação se usou cashback E selecionou uma classificação
                justificationGroup.style.display = (rating === 3) ? 'none' : 'block';
            } else {
                justificationGroup.style.display = 'none';
            }
        }
        
        if (isJustificationRequired) {
            justificationLabel.innerHTML = '3.2. Justifique brevemente o por que de classificar sua experiencia desta forma?';
            
            if (!isJustificationValid) {
                justificationTextarea.classList.add('border-red-500');
                justificationTextarea.classList.remove('border-gray-300');
                if (errorMessageElement) {
                    errorMessageElement.textContent = 'A justificação deve ter pelo menos 5 caracteres.';
                }
            } else {
                justificationTextarea.classList.remove('border-red-500');
                justificationTextarea.classList.add('border-gray-300');
                 if (errorMessageElement) {
                    errorMessageElement.textContent = ''; 
                }
            }
        } else {
            justificationLabel.innerHTML = '3.2. Justificação (opcional):';
            justificationTextarea.classList.remove('border-red-500');
            justificationTextarea.classList.add('border-gray-300');
             if (errorMessageElement) {
                errorMessageElement.textContent = '';
            }
        }
    }

    // 4. VALIDAÇÃO DOS CAMPOS PADRÃO (com `required`)
    const demogSubmitButton = document.getElementById('demog-submit-btn');
    
    if (demogSubmitButton) {
        // O botão só fica ativo se todas as CUSTOM questions estiverem válidas.
        demogSubmitButton.disabled = !allCustomAnsweredAndValid;
    }
    
    return allCustomAnsweredAndValid;
}


window.handleDemographicsSubmit = async (event) => {
    event.preventDefault();
    
    // 1. Validação do Bloco Customizado (inclui Q1, Q2, Q3.1-3.2 e Justificação)
    // Se a validação falhar, a UI já deve ter bloqueado o botão, mas esta é a checagem final.
    if (!updateDemographicsUI()) {
        alert("Por favor, preencha as questões obrigatórias sobre a sua experiência antes de submeter.");
        return; 
    }
    
    // 2. Coletar dados do formulário HTML
    const data = {};
    const formData = new FormData(document.getElementById('demographics-form'));
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // 3. Adicionar as respostas das questões de escolha rápida e do quiz que não são parte do FormData
    data.priceResearch = state.priceResearch;
    data.purchasePreference = state.purchasePreference;
    data.usedTraditionalCashback = state.usedTraditionalCashback;
    data.experienceRating = state.experienceRating;
    data.ratingJustification = state.ratingJustification;
    
    state.demographicsData = data;
    
    // 4. REMOVIDO: Salvar no Firestore neste momento. Os dados demográficos estão agora no 'state'.
    
    // 5. Mostrar Ecrã de Aviso (Attention Screen) para CONTINUAR o estudo.
    renderScreen('attention_screen');
}

// --- LANGUAGE SELECTION SCREEN ---
function renderLanguageSelectionScreen() {
    return `
        <div id="language-selection-screen" class="text-center">
            <div class="mb-8">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">${t('selectLanguage')}</h1>
                <p class="text-gray-600 text-lg">${t('languageSubtitle')}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <!-- Portuguese -->
                <div class="language-option option-card text-center" onclick="selectLanguage('pt')">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <span class="text-white font-bold text-2xl">🇵🇹</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Português</h3>
                    <p class="text-gray-600">Estudo em português</p>
                </div>
                
                <!-- English -->
                <div class="language-option option-card text-center" onclick="selectLanguage('en')">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <span class="text-white font-bold text-2xl">🇬🇧</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">English</h3>
                    <p class="text-gray-600">Study in English</p>
                </div>
                
                <!-- Spanish -->
                <div class="language-option option-card text-center" onclick="selectLanguage('es')">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <span class="text-white font-bold text-2xl">🇪🇸</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Español</h3>
                    <p class="text-gray-600">Estudio en español</p>
                </div>
            </div>
            
            <div class="mt-8">
                <button id="continue-language-btn" class="btn-primary" disabled onclick="continueWithLanguage()">
                    ${t('continue')}
                </button>
            </div>
        </div>
    `;
}

// --- LANGUAGE SELECTION HANDLERS ---
window.selectLanguage = (language) => {
    selectedLanguage = language;
    
    // Update visual selection
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('selected', 'accent-blue-border');
    });
    
    event.target.closest('.language-option').classList.add('selected', 'accent-blue-border');
    
    // Enable continue button
    document.getElementById('continue-language-btn').disabled = false;
};

window.continueWithLanguage = () => {
    renderScreen('welcome');
};

function renderWelcomeScreen() {
    return `
        <div id="welcome-screen">
            <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center text-indigo-600">${t('welcome')}</h1>
            <p class="text-gray-600 mb-6 text-center text-lg">${t('welcomeSubtitle')}</p>
            <hr class="my-6">
            <div class="bg-indigo-50 p-6 rounded-lg space-y-4 text-left">
                
                <p class="text-gray-700">
                    <strong class="font-semibold text-indigo-700">${t('objective')}</strong> ${t('objectiveText')}
                </p>
                
                <p class="text-gray-700">
                    <strong class="font-semibold text-indigo-700">${t('timeEstimated')}</strong> ${t('timeText')}
                </p>
                
                <p class="text-gray-700">
                    <strong class="font-semibold text-indigo-700">${t('confidentiality')}</strong> ${t('confidentialityText')}
                </p>

                <p class="text-gray-700">
                    <strong class="font-semibold text-indigo-700">${t('voluntary')}</strong> ${t('voluntaryText')}
                </p>
            </div>
            
            <p class="text-gray-600 mt-8 mb-8 text-center text-xl">👉 ${t('next')} para iniciar a pesquisa.</p>
            <div class="text-center">
                <button onclick="renderScreen('demographics')" class="btn-primary">${t('next')}</button>
            </div>
        </div>
    `;
}

// NOVO: Função para renderizar APENAS o HTML do quiz de experiência (Movido para dentro da demografia)
function renderTraditionalQuizContent() {
    const likertOptions = [1, 2, 3, 4, 5];

    const likertGrid = likertOptions.map(num => `
        <div data-question-id="experienceRating" data-answer="${num}" 
             class="traditional-quiz-option option-card likert-option text-center ${state.experienceRating === num ? 'selected accent-blue-border' : ''}" 
             onclick="selectTraditionalQuizAnswer('experienceRating', '${num}')">
            <span>${num}</span>
        </div>
    `).join('');
    
    // A Q3.3 (frequentBenefit) foi removida. O question-group-2 é o Rating.
    const q2InitialStyle = (state.usedTraditionalCashback === 'Sim') ? 'block' : 'none';

    return `
        <div id="question-group-3-1" class="p-4 border border-gray-200 rounded-lg">
            <p class="font-semibold mb-3 text-gray-800">3.1. Alguma vez já utilizaste <strong>cashback tradicional</strong>?</p>
            <div class="grid grid-cols-2 gap-4">
                <div data-question-id="usedTraditionalCashback" data-answer="Sim" class="option-card traditional-quiz-option text-center ${state.usedTraditionalCashback === 'Sim' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('usedTraditionalCashback', 'Sim')">
                    <span class="text-lg font-medium">Sim</span>
                </div>
                <div data-question-id="usedTraditionalCashback" data-answer="Não" class="option-card traditional-quiz-option text-center ${state.usedTraditionalCashback === 'Não' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('usedTraditionalCashback', 'Não')">
                    <span class="text-lg font-medium">Não</span>
                </div>
            </div>
        </div>
        
        <div id="question-group-2" class="p-4 border border-gray-200 rounded-lg mt-4" style="display: ${q2InitialStyle};">
            <p class="font-semibold mb-3 text-gray-800">3.2. Como classifica a sua experiência?</p>
            
            <div class="grid grid-cols-5 gap-2 mb-2">
                ${likertGrid}
            </div>
            
            <div class="flex justify-between text-sm text-gray-600 mt-1">
                <span class="text-red-600 font-semibold">1 - Muito Negativa</span>
                <span class="text-green-600 font-semibold">5 - Muito Positiva</span>
            </div>

             <div id="justification-group" class="mt-4" style="display: none;">
                <label id="justification-label" for="rating-justification" class="block text-sm font-medium text-gray-700 mb-1">
                    Justificação (opcional):
                </label>
                <textarea id="rating-justification" rows="3" 
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Descreva brevemente o motivo da sua avaliação.">${state.ratingJustification}</textarea>
                <p id="justification-error" class="text-sm text-red-600 mt-1"></p> </div>
        </div>
        
        `;
}


// ECRÃ 3: Tela de Aviso (Attention Screen)
function renderAttentionScreen() {
    const content = `
        <div id="attention-screen" class="p-8 border-4 border-yellow-400 rounded-xl">
            <div class="text-center space-y-4">
                <h2 class="text-3xl font-extrabold text-gray-800 mb-4">
                    <span class="inline-block transform -translate-y-1 text-yellow-600">⚠️</span> 
                    ${t('attentionTitle')}
                    <span class="inline-block transform -translate-y-1 text-yellow-600">⚠️</span>
                </h2>
                
                <p class="text-xl text-gray-800">
                    ${t('attentionText1')}
                </p>
                
                <p class="text-xl text-red-600 font-semibold mt-4">
                    ${t('attentionText2')}
                </p>
                
                <div class="pt-6">
                    <button onclick="renderScreen('explanation')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 text-lg shadow-lg">
                        ${t('understood')}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return content;
}

// ECRÃ 4: Explicação do Novo Modelo (o antigo ECRÃ 3)
function renderExplanationScreen() {
    const content = `
        <div id="model-explanation-screen">
            <h1 class="text-3xl font-bold text-gray-800 mb-2 text-center">${t('explanationTitle')}</h1>
            
            <hr class="my-6">

            <div class="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
                <p class="text-gray-700 leading-relaxed space-y-4">
                    <span class="block">
                        ${t('explanationText1')}
                    </span>
                    <span class="block">
                        ${t('explanationText2')}
                    </span>
                    <span class="block">
                        ${t('explanationText3')}
                    </span>
                    </p>
            </div>
            <p class="text-gray-600 mt-8 mb-8 text-center">${t('proceed')}</p>
            <div class="text-center">
                <button onclick="renderScreen('testimonials')" class="btn-primary">${t('next')}</button>
            </div>
        </div>
    `;
    return content;
}

// ECRÃ 5: Testimonials (Novo)
function renderTestimonialsScreen() {
    const content = `
        <div id="testimonials-screen">
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">${t('testimonialsTitle')}</h1>
            
            <div class="bg-indigo-50 p-6 rounded-lg mb-6">
                <p class="text-gray-700 text-center text-lg mb-6">
                    ${t('testimonialsSubtitle')}
                </p>
            </div>

            <div class="space-y-6">
                <!-- Testimonial 1 -->
                <div class="testimonial-card">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <span class="text-white font-bold text-xl">J</span>
                            </div>
                        </div>
                        <div class="flex-1">
                            <blockquote class="text-gray-700 text-lg leading-relaxed mb-4 font-medium">
                                "${t('testimonial1')}"
                            </blockquote>
                            <footer class="text-sm text-gray-600 font-semibold">
                                <strong class="text-green-600">João, 32 anos</strong> - Lisboa
                            </footer>
                        </div>
                    </div>
                </div>

                <!-- Testimonial 2 -->
                <div class="testimonial-card">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <span class="text-white font-bold text-xl">R</span>
                            </div>
                        </div>
                        <div class="flex-1">
                            <blockquote class="text-gray-700 text-lg leading-relaxed mb-4 font-medium">
                                "${t('testimonial2')}"
                            </blockquote>
                            <footer class="text-sm text-gray-600 font-semibold">
                                <strong class="text-blue-600">Raquel, 28 anos</strong> - Porto
                            </footer>
                        </div>
                    </div>
                </div>

                <!-- Testimonial 3 -->
                <div class="testimonial-card">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <span class="text-white font-bold text-xl">M</span>
                            </div>
                        </div>
                        <div class="flex-1">
                            <blockquote class="text-gray-700 text-lg leading-relaxed mb-4 font-medium">
                                "${t('testimonial3')}"
                            </blockquote>
                            <footer class="text-sm text-gray-600 font-semibold">
                                <strong class="text-purple-600">Miguel, 34 anos</strong> - Braga
                            </footer>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 alert-warning">
                <p class="text-center font-medium">
                    💡 <strong>${t('tip')}</strong> ${t('tipText')}
                </p>
            </div>
            
            <p class="text-gray-600 mt-8 mb-8 text-center">${t('continueQuiz')}</p>
            <div class="text-center">
                <button onclick="renderScreen('quiz')" class="btn-primary">${t('continueQuizButton')}</button>
            </div>
        </div>
    `;
    return content;
}

// ECRÃ 6: Quiz do Novo Modelo (o antigo ECRÃ 5)
function renderQuizScreen() {
    return `
        <div id="quiz-screen">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Questões acerca do texto anterior</h2>
            
            <div id="quiz-content" class="space-y-4">
                </div>

            <div id="quiz-message" class="text-center font-medium mb-4"></div>
            
            <div class="text-center mt-6">
                <button id="submit-quiz-btn" onclick="submitQuiz()" class="btn-primary" disabled>Verificar Respostas</button>
            </div>
        </div>
    `;
}

function renderQuizQuestions() {
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = '';
    config.verificationQuestions.forEach((q, qIndex) => {
        const qElement = document.createElement('div');
        qElement.id = `question-${qIndex}`;
        qElement.className = "mb-4 p-4 border border-gray-200 rounded-lg";
        qElement.innerHTML = `<p class="font-semibold mb-3 text-gray-800">Q${qIndex + 1}: ${q.question}</p>`;

        q.options.forEach((opt, optIndex) => {
            const optElement = document.createElement('div');
            optElement.className = "quiz-option option-card mb-2 p-3";
            // Usa a função global `selectQuizAnswer`
            optElement.onclick = () => selectQuizAnswer(qIndex, optIndex); 
            
            optElement.innerHTML = `<label class="cursor-pointer block text-gray-700">${opt.text}</label>`;
            qElement.appendChild(optElement);
        });
        quizContent.appendChild(qElement);
    });
    updateQuizSubmitButton();
}

// Ecrã de Lembrete de Instruções (Após o Quiz, Antes da Tarefa)
function renderInstructionReminderScreen() {
    // Frase alterada conforme solicitação
    return `
        <div id="instruction-reminder-screen" class="text-center p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-red-600">INSTRUÇÕES FINAIS PARA A TAREFA</h2>
            <div class="bg-yellow-100 p-6 rounded-lg border-4 border-yellow-400 max-w-lg mx-auto">
                <p class="text-xl text-gray-800 font-semibold leading-relaxed">
                    Pedimos que leia <strong>atentamente</strong> os enunciados e as opções.
                </p>
                <p class="text-gray-800 mt-4 text-lg">
                    Em cada situação <strong class="text-red-700">selecione a opção que representa a sua preferência real</strong>.
                </p>
            </div>
            
            <div class="text-center mt-8">
                <button onclick="window.initializeStudy()" class="btn-primary">Iniciar Tarefa Principal</button>
            </div>
        </div>
    `;
}

function renderQuestionScreen(staircase) {
    // Obter classes de acento específicas para o produto atual
    const { accent: accentClass, border: borderClass } = productAccentColors[staircase.id];
    
    // NOVO: Obter a URL da imagem do produto
    const productImageURL = productImages[staircase.id];

    // Usa a flag de Catch Trial do estado global para determinar o desconto a exibir
    const isCatchTrial = state.isCurrentTrialCatch;
    const displayDiscount = isCatchTrial ? 100 : staircase.currentDiscount;

    const basePriceFormatted = formatCurrency(staircase.price, staircase.currency);
    const productNameAndPrice = `${staircase.name} com o custo de ${basePriceFormatted}`;
    
    const monetaryDiscount = staircase.price * (displayDiscount / 100);
    const monetaryCashbackGuaranteed = staircase.price * (0.5 / 100); 
    const monetaryCashbackMax = staircase.price * (100 / 100); 

    // Formata todos os valores para exibição
    const formattedDiscount = formatCurrency(monetaryDiscount, staircase.currency);
    const formattedCashbackGuaranteed = formatCurrency(monetaryCashbackGuaranteed, staircase.currency); 
    const formattedCashbackMax = formatCurrency(monetaryCashbackMax, staircase.currency); 

    // A classe de acento (cor) é agora DINÂMICA
    const uniformValueClass = accentClass;
    
    // *** ALTERAÇÃO 2/2: Função auxiliar para formatar porcentagens (agora não arredonda) ***
    const formatPercent = (value) => {
        // ToFixed(2) para garantir pelo menos duas casas decimais, se necessário
        let fixedValue = value.toFixed(2).replace('.', ','); 
        
        // Remove casas decimais se for exatemente .00
        if (fixedValue.endsWith(',00')) {
            return fixedValue.slice(0, -3);
        }
        
        // Remove uma casa decimal se for exatemente .X0 (mantém uma casa decimal)
        if (fixedValue.endsWith('0')) {
             return fixedValue.slice(0, -1);
        }
        
        return fixedValue;
    };
    const displayDiscountFormatted = formatPercent(displayDiscount);
    
    // Opção A: Cashback Investido
    const optionADescription = `
        Até <strong class="${uniformValueClass}">${formatPercent(100)}%</strong> 
        (<strong class="${uniformValueClass}">${formattedCashbackMax}</strong>) 
        de cashback, com a <strong class="${uniformValueClass}">garantia de 0,5%</strong> 
        (<strong class="${uniformValueClass}">${formattedCashbackGuaranteed}</strong>) 
        do valor da compra e com <strong class="${uniformValueClass}">resgate a qualquer momento</strong> durante os 6 meses.
    `;

    // Opção B: Desconto Imediato
    const optionBDescription = `
        Desconto imediato de 
        <strong class="${uniformValueClass}">${displayDiscountFormatted}%</strong> 
        (<strong class="${uniformValueClass}">${formattedDiscount}</strong>).
    `;


    return `
        <div id="question-screen">
            <div class="text-center mb-6">
                <p class="progress-indicator inline-block" id="progress-indicator">Produto ${state.currentStaircaseIndex + 1} de ${config.priceLevels.length}</p>
                <h2 class="text-2xl font-bold text-gray-800 mt-2">Imagine que você está comprando <span id="product-full-name" class="${accentClass} font-extrabold">${productNameAndPrice}</span>. Qual das seguintes opções prefere?</h2>
            </div>

            <div class="product-image-container">
                <img src="${productImageURL}" alt="${staircase.name}" class="product-image"/>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
                <div id="cashback-option" class="option-card flex flex-col items-center text-center" onclick="handleStaircaseChoice('cashback')">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Opção A: <strong class="${uniformValueClass}">Cashback Investido</strong></h3>
                    <p class="text-gray-600">
                        ${optionADescription}
                    </p>
                </div>
                <div id="discount-option" class="option-card flex flex-col items-center text-center" onclick="handleStaircaseChoice('discount')">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Opção B: <strong class="${uniformValueClass}">Desconto Imediato</strong></h3>
                    <p class="text-gray-600">
                        ${optionBDescription}
                    </p>
                </div>
            </div>
        </div>
    `;
}

function renderDemographicsScreen() {
    // HTML do Quiz de Experiência movido
    const traditionalQuizContentHTML = renderTraditionalQuizContent();
    
    // Formulário Demográfico (reestruturado com os requisitos)
    return `
        <div id="demographics-screen">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Informação Sociodemográfica</h2>
            <p class="text-gray-600 mb-6 text-center">Por favor, preencha as seguintes questões. Os seus dados serão mantidos confidenciais e utilizados apenas para fins de análise estatística.</p>
            
            <form id="demographics-form" onsubmit="handleDemographicsSubmit(event)" class="space-y-6">
                
                <div id="question-group-new-1" class="p-4 border border-gray-200 rounded-lg">
                    <label class="block text-sm font-medium text-gray-700 mb-2">1. Costuma fazer pesquisa de preço antes de realizar sua compra?</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div data-question-id="priceResearch" data-answer="Sim" class="option-card text-center ${state.priceResearch === 'Sim' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('priceResearch', 'Sim')">
                            <span class="text-lg font-medium">Sim</span>
                        </div>
                        <div data-question-id="priceResearch" data-answer="Não" class="option-card text-center ${state.priceResearch === 'Não' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('priceResearch', 'Não')">
                            <span class="text-lg font-medium">Não</span>
                        </div>
                    </div>
                </div>

                <div id="question-group-new-2" class="p-4 border border-gray-200 rounded-lg">
                    <label class="block text-sm font-medium text-gray-700 mb-2">2. Prefere realizar compras presencialmente ou online?</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div data-question-id="purchasePreference" data-answer="Online" class="option-card text-center ${state.purchasePreference === 'Online' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('purchasePreference', 'Online')">
                            <span class="text-lg font-medium">Online</span>
                        </div>
                        <div data-question-id="purchasePreference" data-answer="Presencial" class="option-card text-center ${state.purchasePreference === 'Presencial' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('purchasePreference', 'Presencial')">
                            <span class="text-lg font-medium">Presencial</span>
                        </div>
                    </div>
                </div>

                <div id="question-group-moved-3" class="mt-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">3. Sobre a sua experiência com benefícios:</h3>
                    ${traditionalQuizContentHTML}
                </div>
                
                <hr class="my-6 border-t border-gray-200">

                <div>
                    <label for="age" class="block text-sm font-medium text-gray-700 mb-1">4. Idade</label>
                    <input type="number" id="age" name="age" min="18" max="100" required class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">5. Género</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gender" value="Feminino" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>Feminino</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gender" value="Masculino" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Masculino</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gender" value="Outro" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Outro</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gender" value="Prefiro nao dizer" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Prefiro não dizer</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label for="education" class="block text-sm font-medium text-gray-700 mb-1">6. Nível de Escolaridade (Consoante Portugal)</label>
                    <select id="education" name="education" required class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Selecione...</option>
                        <option value="Ensino Básico">Ensino Básico (até 9.º ano)</option>
                        <option value="Ensino Secundário">Ensino Secundário (12.º ano / Profissional)</option>
                        <option value="Licenciatura">Licenciatura</option>
                        <option value="Mestrado/Pos-graduacao">Mestrado / Pós-graduação</option>
                        <option value="Doutoramento">Doutoramento</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">7. Tem o hábito de investir em mercados financeiros ou considera-se familiarizado(a) com este tópico?</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="invests" value="Sim" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>Sim</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="invests" value="Nao" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Não</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">8. Qual o beneficio que mais o atrai na hora de realizar sua compra?</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="habit" value="Desconto" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>Desconto</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="habit" value="Cashback" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Cashback</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="habit" value="Nenhum dos dois" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Nenhum dos dois</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">9. Fuma habitualmente?</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="smokes" value="Sim" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>Sim</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="smokes" value="Nao" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Não</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">10. Costuma fazer apostas (ex: lotaria, jogos de casino, apostas desportivas)?</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gambles" value="Sim" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>Sim</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gambles" value="Nao" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Não</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">11. Qual é o seu rendimento mensal líquido (após impostos)? Por favor, selecione a faixa que melhor representa o seu rendimento médio mensal.</label>
                    <div class="flex flex-col space-y-2">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="Menos de €1.000" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>Menos de €1.000</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="Entre €1.000 e €1.499" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Entre €1.000 e €1.499</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="Entre €1.500 e €2.499" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Entre €1.500 e €2.499</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="Entre €2.500 e €3.499" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Entre €2.500 e €3.499</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="€3.500 ou mais" class="text-indigo-600 focus:ring-indigo-500">
                            <span>€3.500 ou mais</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="Prefiro não responder" class="text-indigo-600 focus:ring-indigo-500">
                            <span>Prefiro não responder</span>
                        </label>
                    </div>
                </div>
                
                <div class="text-center pt-4">
                    <button type="submit" id="demog-submit-btn" class="btn-primary" disabled>Concluir e Submeter Dados</button>
                </div>
            </form>
        </div>
    `;
}

function renderThankYouScreen() {
    return `
        <div id="thank-you-screen" class="text-center p-8">
            <h1 class="text-4xl font-bold text-indigo-600 mb-6">Obrigado(a) pela sua Participação!</h1>
            <p class="text-gray-700 text-lg mb-4">O seu estudo está completo e as suas respostas foram guardadas com sucesso.</p>
            <p class="text-gray-500 text-md">Agradecemos o seu tempo e contribuição.</p>
            
            <div class="mt-8 p-4 bg-yellow-100 rounded-lg max-w-xl mx-auto border border-yellow-300">
                <p class="text-sm font-medium text-gray-700">O seu ID de Utilizador para verificação é:</p>
                <p id="user-id-display" class="font-mono text-xs text-red-700 break-all mt-2">${userId}</p>
            </div>
        </div>
    `;
}

// --- INICIALIZAÇÃO CORRIGIDA ---

// 1. Inicia o Supabase de forma assíncrona
function startApplication() {
    // Start with language selection
    renderScreen('language_selection'); 
    
    // Inicia o Supabase em segundo plano
    initializeSupabase(); 
}

// 2. Chama a função de arranque quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', startApplication);
