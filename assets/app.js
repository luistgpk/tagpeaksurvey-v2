// --- VARIÁVEIS DE CONFIGURAÇÃO (Supabase) ---
// Environment variables are injected by Vercel at build time
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// --- ESTADO DA APLICAÇÃO ---
let userId = crypto.randomUUID();
let isApiReady = false;
let currentScreen = 'welcome';
let framingCondition = null; // Will be randomly assigned: 'positive', 'negative', or 'neutral'

// Survey state
let surveyData = {
    // Demographics (Ecrã 2)
    age: null,
    gender: null,
    monthlyIncome: null,
    shoppingPreference: null,
    firstName: null,
    
    // Financial literacy (Ecrã 3)
    financialLiteracyQ1: null, // Compound interest
    financialLiteracyQ2: null, // Inflation
    financialLiteracyQ3: null, // Diversification
    
    // Initial involvement (Ecrã 4)
    initialInvolvementImportant: null, // 1-7 (reversed)
    initialInvolvementRelevant: null, // 1-7 (reversed)
    initialInvolvementMeaningful: null, // 1-7
    initialInvolvementValuable: null, // 1-7
    
    // Exclusion questions (Ecrã 7)
    exclusionBenefitType: null,
    exclusionPercentage: null,
    
    // Manipulation check (Ecrã 8)
    manipulationLossEmphasis: null, // 1-7
    manipulationGlobalIdea: null, // 1-7
    
    // Message involvement (Ecrã 9)
    involvementInterested: null, // 1-9
    involvementAbsorbed: null, // 1-9
    involvementAttention: null, // 1-9
    involvementRelevant: null, // 1-9
    involvementInteresting: null, // 1-9
    involvementEngaging: null, // 1-9
    
    // Intention to use (Ecrã 10)
    intentionProbable: null, // 1-7
    intentionPossible: null, // 1-7
    intentionDefinitelyUse: null, // 1-7
    intentionFrequent: null, // 1-7
    
    // Ease of use (Ecrã 12)
    easeDifficult: null, // 1-7 (reversed)
    easeEasy: null, // 1-7
    
    // General product view (Ecrã 12)
    productExplainEasy: null, // 1-7
    productDescriptionEasy: null, // 1-7
    
    // Clarity in usage (Ecrã 12)
    clarityStepsClear: null, // 1-7
    clarityFeelSecure: null, // 1-7
    
    // Perceived advantage (Ecrã 13)
    advantageMoreAdvantageous: null, // 1-7
    advantageBetterPosition: null, // 1-7
    
    // Willingness/interest to use (Ecrã 13)
    willingnessInterest: null, // 1-7
    willingnessLikelyUse: null, // 1-7
    willingnessIntendFuture: null, // 1-7
    
    // Concerns (Ecrã 14)
    concernsText: null,
    
    // Optional feedback
    userFeedback: null
};

// Email framings
const emailFramings = {
    positive: {
        subject: "Ganhe mais com suas reservas Airpnp",
        greeting: "Olá, [Nome da pessoa],",
        body1: "A Airpnp, em parceria com a Tagpeak, uniu forças para multiplicar as vantagens sempre que reserva alojamentos conosco.",
        body2: "Agora podes ter uma percentagem do valor que paga nas suas reservas automaticamente investida em ações de empresas cotadas em bolsa pela equipa especializada da Tagpeak, sem qualquer custo e risco para si.",
        body3: "Tudo isso para permitir que ganhe um cashback de até <strong>100% do valor gasto nas suas reservas</strong>. Aproveite estes benefícios exclusivos!",
        body4: "Comece a ganhar agora! É muito simples, basta escrever <strong>\"tagpeak\"</strong> no campo de desconto/cupão no checkout da sua próxima reserva na Airpnp.",
        body5: "Para mais informações, visite: www.tagpeak.com"
    },
    negative: {
        subject: "Não deixei escapar os benefícios nas suas reservas Airpnp",
        greeting: "Olá, [Nome da pessoa],",
        body1: "A Airpnp, em parceria com a Tagpeak, uniu forças para aumentar as vantagens sempre que reserva alojamentos conosco.",
        body2: "Agora podes ter uma percentagem do valor que paga nas suas reservas automaticamente investida em ações de empresas cotadas em bolsa pela equipa especializada da Tagpeak, sem qualquer custo e risco para si, mas somente se ativar a parceria.",
        body3: "Tudo isso para permitir que evite perder um cashback de até <strong>100% do valor gasto nas suas reservas. Vais mesmo abrir mão desta oportunidade?</strong>",
        body4: "Para não perder, basta escrever <strong>\"tagpeak\"</strong> no campo de desconto/cupão no checkout da sua próxima reserva na Airpnp.",
        body5: "Para mais informações, visite: www.tagpeak.com"
    },
    neutral: {
        subject: "Nova parceria Airpnp e Tagpeak",
        greeting: "Olá, [Nome da pessoa],",
        body1: "A Airpnp estabeleceu uma parceria com a Tagpeak com o objetivo de disponibilizar um benefício adicional às reservas de alojamento.",
        body2: "Este benefício permite que uma percentagem do valor pago nas reservas seja automaticamente investido em ações de empresas cotadas em bolsa, geridas pela equipa especializada da Tagpeak, sem custos ou riscos para o utilizador.",
        body3: "Esse mecanismo permite obter um cashback de até 100% do valor gasto na reserva.",
        body4: "Para utilizar, basta inserir <strong>\"tagpeak\"</strong> no campo de desconto/cupão durante o checkout da sua próxima reserva Airpnp.",
        body5: "Para mais informações, visite: www.tagpeak.com"
    }
};

// Assign random framing condition
function assignFramingCondition() {
    const conditions = ['positive', 'negative', 'neutral'];
    framingCondition = conditions[Math.floor(Math.random() * conditions.length)];
    console.log('Assigned framing condition:', framingCondition);
}

// Initialize Supabase
async function initializeSupabase() {
    if (supabaseUrl.includes('PLACEHOLDER') || supabaseAnonKey.includes('PLACEHOLDER')) {
        console.warn('Supabase credentials not configured. Survey will run but data will not be saved.');
        isApiReady = false;
        return;
    }
    
    try {
        // Test connection
        isApiReady = true;
        console.log('Supabase initialized successfully');
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        isApiReady = false;
    }
}

// --- FUNÇÕES DE NAVEGAÇÃO ---
function renderScreen(screenName) {
    currentScreen = screenName;
    const contentArea = document.getElementById('content-area');
    const surveyContainer = document.getElementById('survey-container');
    
    // Fade out
    contentArea.classList.add('fade-out');
    
    setTimeout(() => {
        // Special styling for attention screen (Ecrã 5)
        if (screenName === 'preparation') {
            surveyContainer.classList.remove('card');
            surveyContainer.classList.add('bg-yellow-100');
            surveyContainer.style.padding = '0';
            surveyContainer.style.boxShadow = 'none';
        } else {
            surveyContainer.classList.add('card');
            surveyContainer.classList.remove('bg-yellow-100');
            surveyContainer.style.padding = '';
            surveyContainer.style.boxShadow = '';
        }
        
        contentArea.innerHTML = '';
        
        switch (screenName) {
            case 'welcome':
                contentArea.innerHTML = renderWelcomeScreen();
                break;
            case 'demographics':
                contentArea.innerHTML = renderDemographicsScreen();
                break;
            case 'financial_literacy':
                contentArea.innerHTML = renderFinancialLiteracyScreen();
                break;
            case 'initial_involvement':
                contentArea.innerHTML = renderInitialInvolvementScreen();
                break;
            case 'preparation':
                contentArea.innerHTML = renderPreparationScreen();
                break;
            case 'email_framing':
                contentArea.innerHTML = renderEmailFramingScreen();
                break;
            case 'exclusion':
                contentArea.innerHTML = renderExclusionScreen();
                break;
            case 'manipulation_check':
                contentArea.innerHTML = renderManipulationCheckScreen();
                break;
            case 'message_involvement':
                contentArea.innerHTML = renderMessageInvolvementScreen();
                break;
            case 'intention':
                contentArea.innerHTML = renderIntentionScreen();
                break;
            case 'website':
                contentArea.innerHTML = renderWebsiteScreen();
                break;
            case 'emotions_1':
                contentArea.innerHTML = renderEmotionsScreen1();
                break;
            case 'emotions_2':
                contentArea.innerHTML = renderEmotionsScreen2();
                break;
            case 'concerns':
                contentArea.innerHTML = renderConcernsScreen();
                break;
            case 'thank_you':
                contentArea.innerHTML = renderThankYouScreen();
                break;
            default:
                contentArea.innerHTML = '<p class="text-center text-red-500">Erro: Ecrã não encontrado</p>';
        }
        
        contentArea.classList.remove('fade-out');
        window.scrollTo(0, 0);
    }, 300);
}

// --- RENDER FUNCTIONS ---

function renderWelcomeScreen() {
    return `
        <div class="text-center space-y-8">
            <div>
                <h1 class="text-4xl font-bold mb-4">Bem-vindo(a)!</h1>
                <p class="text-lg text-gray-700">Agradecemos por dedicar alguns minutos para participar deste estudo.</p>
            </div>
            
            <div class="text-left space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200 shadow-lg">
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg mb-2 text-gray-800">Objetivo da Pesquisa</h3>
                        <p class="text-gray-700">Queremos compreender melhor programas de benefícios oferecidos por empresas. As respostas vão ajudar-nos a desenvolver soluções mais alinhadas com as demandas dos consumidores.</p>
                    </div>
                </div>
                
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg mb-2 text-gray-800">Tempo Estimado</h3>
                        <p class="text-gray-700">A pesquisa leva cerca de 7 a 10 minutos para ser concluída.</p>
                    </div>
                </div>
                
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg mb-2 text-gray-800">Confidencialidade</h3>
                        <p class="text-gray-700">As suas respostas são anónimas e serão utilizadas exclusivamente para fins internos, com o objetivo de gerar insights e melhorar os nossos serviços.</p>
                    </div>
                </div>
                
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-lg mb-2 text-gray-800">Participação Voluntária</h3>
                        <p class="text-gray-700">A participação é totalmente voluntária e pode ser interrompida a qualquer momento. Ao continuar, está a concordar com os termos acima.</p>
                    </div>
                </div>
                
                <div class="pt-4 border-t border-gray-200">
                    <p class="text-sm text-gray-600 mb-2">Para questões ou feedback:</p>
                    <a href="mailto:luis@tagpeak.com" class="text-blue-600 hover:text-blue-700 font-medium hover:underline">luis@tagpeak.com</a>
                </div>
            </div>
            
            <button onclick="renderScreen('demographics')" class="btn-primary mt-4">
                Continuar
            </button>
        </div>
    `;
}

function renderDemographicsScreen() {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-3">Informação Sociodemográfica</h2>
                <p class="text-gray-600">Os seus dados serão mantidos confidenciais e utilizados apenas para fins de análise estatística.</p>
            </div>
            
            <div class="space-y-8">
                <div>
                    <label class="block text-base font-semibold text-gray-800 mb-3">1. Idade</label>
                    <div class="space-y-2" id="age-group">
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.age === 'less_25' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('age', 'less_25', 'age-group')">
                            <input type="radio" name="age" value="less_25" class="mr-3 w-5 h-5" ${surveyData.age === 'less_25' ? 'checked' : ''} onchange="surveyData.age = this.value; clearError('age-error')">
                            <span class="text-gray-700">Menos de 25</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.age === '26_35' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('age', '26_35', 'age-group')">
                            <input type="radio" name="age" value="26_35" class="mr-3 w-5 h-5" ${surveyData.age === '26_35' ? 'checked' : ''} onchange="surveyData.age = this.value; clearError('age-error')">
                            <span class="text-gray-700">26-35</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.age === '36_50' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('age', '36_50', 'age-group')">
                            <input type="radio" name="age" value="36_50" class="mr-3 w-5 h-5" ${surveyData.age === '36_50' ? 'checked' : ''} onchange="surveyData.age = this.value; clearError('age-error')">
                            <span class="text-gray-700">36-50</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.age === '51_65' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('age', '51_65', 'age-group')">
                            <input type="radio" name="age" value="51_65" class="mr-3 w-5 h-5" ${surveyData.age === '51_65' ? 'checked' : ''} onchange="surveyData.age = this.value; clearError('age-error')">
                            <span class="text-gray-700">51-65</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.age === '66_plus' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('age', '66_plus', 'age-group')">
                            <input type="radio" name="age" value="66_plus" class="mr-3 w-5 h-5" ${surveyData.age === '66_plus' ? 'checked' : ''} onchange="surveyData.age = this.value; clearError('age-error')">
                            <span class="text-gray-700">66 anos ou mais</span>
                        </label>
                    </div>
                    <p id="age-error" class="text-red-500 text-sm mt-2 hidden">Por favor, selecione uma opção.</p>
                </div>
                
                <div>
                    <label class="block text-base font-semibold text-gray-800 mb-3">2. Sexo</label>
                    <div class="space-y-2" id="gender-group">
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.gender === 'mulher' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('gender', 'mulher', 'gender-group')">
                            <input type="radio" name="gender" value="mulher" class="mr-3 w-5 h-5" ${surveyData.gender === 'mulher' ? 'checked' : ''} onchange="surveyData.gender = this.value; clearError('gender-error')">
                            <span class="text-gray-700">Mulher</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.gender === 'homem' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('gender', 'homem', 'gender-group')">
                            <input type="radio" name="gender" value="homem" class="mr-3 w-5 h-5" ${surveyData.gender === 'homem' ? 'checked' : ''} onchange="surveyData.gender = this.value; clearError('gender-error')">
                            <span class="text-gray-700">Homem</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.gender === 'outro' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('gender', 'outro', 'gender-group')">
                            <input type="radio" name="gender" value="outro" class="mr-3 w-5 h-5" ${surveyData.gender === 'outro' ? 'checked' : ''} onchange="surveyData.gender = this.value; clearError('gender-error')">
                            <span class="text-gray-700">Outro</span>
                        </label>
                    </div>
                    <p id="gender-error" class="text-red-500 text-sm mt-2 hidden">Por favor, selecione uma opção.</p>
                </div>
                
                <div>
                    <label class="block text-base font-semibold text-gray-800 mb-3">3. Rendimento médio mensal</label>
                    <div class="space-y-2" id="income-group">
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.monthlyIncome === 'less_750' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('income', 'less_750', 'income-group')">
                            <input type="radio" name="income" value="less_750" class="mr-3 w-5 h-5" ${surveyData.monthlyIncome === 'less_750' ? 'checked' : ''} onchange="surveyData.monthlyIncome = this.value; clearError('income-error')">
                            <span class="text-gray-700">&lt; 750€</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.monthlyIncome === '750_1500' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('income', '750_1500', 'income-group')">
                            <input type="radio" name="income" value="750_1500" class="mr-3 w-5 h-5" ${surveyData.monthlyIncome === '750_1500' ? 'checked' : ''} onchange="surveyData.monthlyIncome = this.value; clearError('income-error')">
                            <span class="text-gray-700">750€ - 1500€</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.monthlyIncome === '1500_3000' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('income', '1500_3000', 'income-group')">
                            <input type="radio" name="income" value="1500_3000" class="mr-3 w-5 h-5" ${surveyData.monthlyIncome === '1500_3000' ? 'checked' : ''} onchange="surveyData.monthlyIncome = this.value; clearError('income-error')">
                            <span class="text-gray-700">1500€ - 3000€</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.monthlyIncome === 'more_3000' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('income', 'more_3000', 'income-group')">
                            <input type="radio" name="income" value="more_3000" class="mr-3 w-5 h-5" ${surveyData.monthlyIncome === 'more_3000' ? 'checked' : ''} onchange="surveyData.monthlyIncome = this.value; clearError('income-error')">
                            <span class="text-gray-700">&gt; 3000€</span>
                        </label>
                    </div>
                    <p id="income-error" class="text-red-500 text-sm mt-2 hidden">Por favor, selecione uma opção.</p>
                </div>
                
                <div>
                    <label class="block text-base font-semibold text-gray-800 mb-3">4. Forma mais utilizada de realizar compras</label>
                    <div class="space-y-2" id="shopping-group">
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.shoppingPreference === 'online' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('shopping', 'online', 'shopping-group')">
                            <input type="radio" name="shopping" value="online" class="mr-3 w-5 h-5" ${surveyData.shoppingPreference === 'online' ? 'checked' : ''} onchange="surveyData.shoppingPreference = this.value; clearError('shopping-error')">
                            <span class="text-gray-700">Online (internet / e-commerce)</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all ${surveyData.shoppingPreference === 'presencial' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('shopping', 'presencial', 'shopping-group')">
                            <input type="radio" name="shopping" value="presencial" class="mr-3 w-5 h-5" ${surveyData.shoppingPreference === 'presencial' ? 'checked' : ''} onchange="surveyData.shoppingPreference = this.value; clearError('shopping-error')">
                            <span class="text-gray-700">Presencial (em loja física)</span>
                        </label>
                    </div>
                    <p id="shopping-error" class="text-red-500 text-sm mt-2 hidden">Por favor, selecione uma opção.</p>
                </div>
                
                <div>
                    <label class="block text-base font-semibold text-gray-800 mb-3">5. Primeiro nome <span class="text-sm font-normal text-gray-500">(opcional)</span></label>
                    <input type="text" id="firstName" class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Seu primeiro nome" value="${surveyData.firstName || ''}" onchange="surveyData.firstName = this.value">
                    <p class="text-sm text-gray-500 mt-2">Esta informação será utilizada somente para melhorar a experiência.</p>
                </div>
            </div>
            
            <button onclick="validateAndContinue('demographics', 'financial_literacy')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderFinancialLiteracyScreen() {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-3">Avaliação de Literacia Financeira</h2>
                <p class="text-gray-600">Por favor, responda às seguintes perguntas:</p>
            </div>
            
            <div class="space-y-6">
                <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                    <p class="text-base font-semibold text-gray-800 mb-4">Suponha que tem €100 numa conta que rende 2% ao ano. Após 5 anos, quanto terá na conta?</p>
                    <div class="space-y-2">
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ1 === 'more_102' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q1', 'more_102', 'fl_q1-group')">
                            <input type="radio" name="fl_q1" value="more_102" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ1 === 'more_102' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ1 = this.value">
                            <span class="text-gray-700">Mais de €102</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ1 === 'exactly_102' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q1', 'exactly_102', 'fl_q1-group')">
                            <input type="radio" name="fl_q1" value="exactly_102" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ1 === 'exactly_102' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ1 = this.value">
                            <span class="text-gray-700">Exatamente €102</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ1 === 'less_102' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q1', 'less_102', 'fl_q1-group')">
                            <input type="radio" name="fl_q1" value="less_102" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ1 === 'less_102' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ1 = this.value">
                            <span class="text-gray-700">Menos de €102</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ1 === 'dont_know' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q1', 'dont_know', 'fl_q1-group')">
                            <input type="radio" name="fl_q1" value="dont_know" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ1 === 'dont_know' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ1 = this.value">
                            <span class="text-gray-700">Não sabe</span>
                        </label>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                    <p class="text-base font-semibold text-gray-800 mb-4">Se a taxa de juros da sua conta for 1% ao ano e a inflação for 2%, após um ano o dinheiro permite comprar:</p>
                    <div class="space-y-2">
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ2 === 'more' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q2', 'more', 'fl_q2-group')">
                            <input type="radio" name="fl_q2" value="more" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ2 === 'more' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ2 = this.value">
                            <span class="text-gray-700">Mais</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ2 === 'same' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q2', 'same', 'fl_q2-group')">
                            <input type="radio" name="fl_q2" value="same" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ2 === 'same' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ2 = this.value">
                            <span class="text-gray-700">O mesmo</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ2 === 'less' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q2', 'less', 'fl_q2-group')">
                            <input type="radio" name="fl_q2" value="less" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ2 === 'less' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ2 = this.value">
                            <span class="text-gray-700">Menos</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ2 === 'dont_know' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q2', 'dont_know', 'fl_q2-group')">
                            <input type="radio" name="fl_q2" value="dont_know" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ2 === 'dont_know' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ2 = this.value">
                            <span class="text-gray-700">Não sabe</span>
                        </label>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                    <p class="text-base font-semibold text-gray-800 mb-4">Comprar ações de uma única empresa é normalmente mais seguro do que investir num fundo diversificado.</p>
                    <div class="space-y-2">
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ3 === 'true' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q3', 'true', 'fl_q3-group')">
                            <input type="radio" name="fl_q3" value="true" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ3 === 'true' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ3 = this.value">
                            <span class="text-gray-700">Verdadeiro</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ3 === 'false' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q3', 'false', 'fl_q3-group')">
                            <input type="radio" name="fl_q3" value="false" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ3 === 'false' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ3 = this.value">
                            <span class="text-gray-700">Falso</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.financialLiteracyQ3 === 'dont_know' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('fl_q3', 'dont_know', 'fl_q3-group')">
                            <input type="radio" name="fl_q3" value="dont_know" class="mr-3 w-5 h-5" ${surveyData.financialLiteracyQ3 === 'dont_know' ? 'checked' : ''} onchange="surveyData.financialLiteracyQ3 = this.value">
                            <span class="text-gray-700">Não sabe</span>
                        </label>
                    </div>
                </div>
            </div>
            
            <button onclick="validateAndContinue('financial_literacy', 'initial_involvement')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderInitialInvolvementScreen() {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-3">Avaliação do Envolvimento</h2>
                <p class="text-lg font-medium text-gray-700 mb-2">"Para mim, benefícios promocionais (como cashback, descontos, cupões, etc.) são:"</p>
                <p class="text-sm text-gray-500">*itens cotados em reverso</p>
            </div>
            
            <div class="space-y-8 bg-gray-50 p-6 rounded-2xl">
                ${renderLikertScale('inv_important', 'initialInvolvementImportant', 'importantes', 'nada importantes', 1, 7, surveyData.initialInvolvementImportant)}
                ${renderLikertScale('inv_relevant', 'initialInvolvementRelevant', 'relevantes', 'irrelevantes', 1, 7, surveyData.initialInvolvementRelevant)}
                ${renderLikertScale('inv_meaningful', 'initialInvolvementMeaningful', 'não significam nada', 'significam muito para mim', 1, 7, surveyData.initialInvolvementMeaningful)}
                ${renderLikertScale('inv_valuable', 'initialInvolvementValuable', 'sem valor', 'valiosos', 1, 7, surveyData.initialInvolvementValuable)}
            </div>
            
            <button onclick="validateLikertScreen('initial_involvement', ['initialInvolvementImportant', 'initialInvolvementRelevant', 'initialInvolvementMeaningful', 'initialInvolvementValuable'], 'preparation')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderPreparationScreen() {
    return `
        <div class="p-8 text-center">
            <div class="bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-50 p-10 rounded-2xl border-4 border-yellow-400 shadow-2xl">
                <div class="mb-6">
                    <div class="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                        <svg class="w-10 h-10 text-yellow-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h2 class="text-3xl font-bold text-yellow-900 mb-4">Atenção!</h2>
                </div>
                <p class="text-xl text-yellow-900 font-semibold leading-relaxed">
                    Pedimos que leia com atenção as informações que serão apresentadas a seguir.
                </p>
                <p class="text-lg text-yellow-800 font-medium mt-4">
                    Elas serão importantes para a conclusão do estudo.
                </p>
            </div>
            
            <button onclick="assignFramingCondition(); renderScreen('email_framing')" class="btn-primary mt-8">
                Continuar
            </button>
        </div>
    `;
}

function renderEmailFramingScreen() {
    if (!framingCondition) {
        assignFramingCondition();
    }
    
    const email = emailFramings[framingCondition];
    const displayName = surveyData.firstName || '[Nome da pessoa]';
    
    return `
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">E-mail</h2>
            
            <!-- Email Inbox Frame -->
            <div class="bg-gray-100 rounded-2xl shadow-2xl overflow-hidden border border-gray-300">
                <!-- Email Client Header -->
                <div class="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            M
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">Mail</div>
                            <div class="text-xs text-gray-500">Caixa de entrada</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-xs text-gray-500">Hoje</span>
                    </div>
                </div>
                
                <!-- Email List (simulated) -->
                <div class="bg-white border-b border-gray-200">
                    <div class="px-4 py-3 border-l-4 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3 flex-1 min-w-0">
                                <div class="flex-shrink-0">
                                    <input type="checkbox" class="w-4 h-4 text-blue-600 rounded">
                                </div>
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        A
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center space-x-2">
                                        <span class="font-semibold text-gray-900 truncate">Airpnp</span>
                                        <span class="text-xs text-gray-500">noreply@airpnp.com</span>
                                    </div>
                                    <div class="text-sm font-medium text-gray-800 truncate mt-1">${email.subject}</div>
                                </div>
                            </div>
                            <div class="flex-shrink-0 text-xs text-gray-500 ml-4">Agora</div>
                        </div>
                    </div>
                </div>
                
                <!-- Email Content -->
                <div class="bg-white p-8">
                    <div class="max-w-3xl mx-auto">
                        <!-- Email Header -->
                        <div class="border-b border-gray-200 pb-4 mb-6">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        A
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900">Airpnp</div>
                                        <div class="text-sm text-gray-500">noreply@airpnp.com</div>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-500">Hoje às ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            <div class="mt-4">
                                <div class="text-sm text-gray-500 mb-1">Para:</div>
                                <div class="font-medium text-gray-900">${displayName}</div>
                            </div>
                            <div class="mt-3">
                                <div class="text-lg font-semibold text-gray-900">${email.subject}</div>
                            </div>
                        </div>
                        
                        <!-- Email Body -->
                        <div class="prose max-w-none text-gray-800 space-y-4 leading-relaxed">
                            <p>${email.greeting.replace('[Nome da pessoa]', displayName)}</p>
                            <p>${email.body1}</p>
                            <p>${email.body2}</p>
                            <p>${email.body3}</p>
                            <p>${email.body4}</p>
                            <p class="mt-6">${email.body5}</p>
                        </div>
                        
                        <!-- Email Footer -->
                        <div class="mt-8 pt-6 border-t border-gray-200">
                            <div class="text-xs text-gray-500">
                                <p>Airpnp - A sua plataforma de reservas de alojamento</p>
                                <p class="mt-1">Este e-mail foi enviado para ${displayName.toLowerCase()}@email.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <button onclick="renderScreen('exclusion')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderExclusionScreen() {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-3">Perguntas de Verificação</h2>
                <p class="text-gray-600">Responda às seguintes questões com base no e-mail que acabou de ler:</p>
            </div>
            
            <div class="space-y-6">
                <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                    <p class="text-base font-semibold text-gray-800 mb-4">"O e-mail refere qual tipo de benefício?"</p>
                    <div class="space-y-2">
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.exclusionBenefitType === 'Desconto' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('exclusion_type', 'Desconto', 'exclusion_type-group')">
                            <input type="radio" name="exclusion_type" value="Desconto" class="mr-3 w-5 h-5" ${surveyData.exclusionBenefitType === 'Desconto' ? 'checked' : ''} onchange="surveyData.exclusionBenefitType = this.value">
                            <span class="text-gray-700">Desconto</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.exclusionBenefitType === 'Cashback' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('exclusion_type', 'Cashback', 'exclusion_type-group')">
                            <input type="radio" name="exclusion_type" value="Cashback" class="mr-3 w-5 h-5" ${surveyData.exclusionBenefitType === 'Cashback' ? 'checked' : ''} onchange="surveyData.exclusionBenefitType = this.value">
                            <span class="text-gray-700">Cashback</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.exclusionBenefitType === 'Cupão' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('exclusion_type', 'Cupão', 'exclusion_type-group')">
                            <input type="radio" name="exclusion_type" value="Cupão" class="mr-3 w-5 h-5" ${surveyData.exclusionBenefitType === 'Cupão' ? 'checked' : ''} onchange="surveyData.exclusionBenefitType = this.value">
                            <span class="text-gray-700">Cupão</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.exclusionBenefitType === 'Nenhum destes' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('exclusion_type', 'Nenhum destes', 'exclusion_type-group')">
                            <input type="radio" name="exclusion_type" value="Nenhum destes" class="mr-3 w-5 h-5" ${surveyData.exclusionBenefitType === 'Nenhum destes' ? 'checked' : ''} onchange="surveyData.exclusionBenefitType = this.value">
                            <span class="text-gray-700">Nenhum destes</span>
                        </label>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                    <p class="text-base font-semibold text-gray-800 mb-4">"O benefício mencionado permite recebimento/subtração de até quantos % do valor gasto?"</p>
                    <div class="space-y-2">
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.exclusionPercentage === '50%' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('exclusion_percent', '50%', 'exclusion_percent-group')">
                            <input type="radio" name="exclusion_percent" value="50%" class="mr-3 w-5 h-5" ${surveyData.exclusionPercentage === '50%' ? 'checked' : ''} onchange="surveyData.exclusionPercentage = this.value">
                            <span class="text-gray-700">50%</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.exclusionPercentage === '25%' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('exclusion_percent', '25%', 'exclusion_percent-group')">
                            <input type="radio" name="exclusion_percent" value="25%" class="mr-3 w-5 h-5" ${surveyData.exclusionPercentage === '25%' ? 'checked' : ''} onchange="surveyData.exclusionPercentage = this.value">
                            <span class="text-gray-700">25%</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.exclusionPercentage === '10%' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('exclusion_percent', '10%', 'exclusion_percent-group')">
                            <input type="radio" name="exclusion_percent" value="10%" class="mr-3 w-5 h-5" ${surveyData.exclusionPercentage === '10%' ? 'checked' : ''} onchange="surveyData.exclusionPercentage = this.value">
                            <span class="text-gray-700">10%</span>
                        </label>
                        <label class="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${surveyData.exclusionPercentage === '100%' ? 'border-blue-500 bg-blue-50' : ''}" onclick="selectOption('exclusion_percent', '100%', 'exclusion_percent-group')">
                            <input type="radio" name="exclusion_percent" value="100%" class="mr-3 w-5 h-5" ${surveyData.exclusionPercentage === '100%' ? 'checked' : ''} onchange="surveyData.exclusionPercentage = this.value">
                            <span class="text-gray-700">100%</span>
                        </label>
                    </div>
                </div>
            </div>
            
            <button onclick="validateAndContinue('exclusion', 'manipulation_check')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderManipulationCheckScreen() {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-3">Verificação de Manipulação</h2>
                <p class="text-gray-600">Com base no e-mail que leu, responda às seguintes questões:</p>
            </div>
            
            <div class="space-y-8 bg-gray-50 p-6 rounded-2xl">
                <div>
                    <p class="text-base font-semibold text-gray-800 mb-4">"A mensagem apresentada enfatizou principalmente:"</p>
                    ${renderLikertScale('manip_loss', 'manipulationLossEmphasis', 'Perdas por NÃO usar o benefício', 'Benefícios de USAR o benefício', 1, 7, surveyData.manipulationLossEmphasis)}
                </div>
                
                <div>
                    <p class="text-base font-semibold text-gray-800 mb-4">"Globalmente, a mensagem transmite mais a ideia de…"</p>
                    ${renderLikertScale('manip_global', 'manipulationGlobalIdea', 'Não deixar passar algo que poderia me beneficiar', 'Tirar partido de algo que pode trazer benefícios', 1, 7, surveyData.manipulationGlobalIdea)}
                </div>
            </div>
            
            <button onclick="validateLikertScreen('manipulation_check', ['manipulationLossEmphasis', 'manipulationGlobalIdea'], 'message_involvement')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderMessageInvolvementScreen() {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-3">Envolvimento com a Mensagem</h2>
                <p class="text-gray-600">Avalie a sua experiência ao ler o e-mail:</p>
            </div>
            
            <div class="space-y-8 bg-gray-50 p-6 rounded-2xl">
                <div>
                    <p class="text-base font-semibold text-gray-800 mb-4">1. Você diria que, enquanto lia, você:</p>
                    ${renderLikertScale('inv_interested', 'involvementInterested', 'não estava interessado', 'estava muito interessado', 1, 9, surveyData.involvementInterested)}
                </div>
                
                <div>
                    <p class="text-base font-semibold text-gray-800 mb-4">2. Você diria que, enquanto lia, você:</p>
                    ${renderLikertScale('inv_absorbed', 'involvementAbsorbed', 'não estava absorvido', 'estava muito absorvido', 1, 9, surveyData.involvementAbsorbed)}
                </div>
                
                <div>
                    <p class="text-base font-semibold text-gray-800 mb-4">3. Você diria que, enquanto lia, você:</p>
                    ${renderLikertScale('inv_attention', 'involvementAttention', 'leu a mensagem rapidamente por alto', 'leu a mensagem com atenção', 1, 9, surveyData.involvementAttention)}
                </div>
                
                <div>
                    <p class="text-base font-semibold text-gray-800 mb-4">4. Você diria que achou a mensagem:</p>
                    ${renderLikertScale('inv_relevant_msg', 'involvementRelevant', 'irrelevante', 'relevante para si', 1, 9, surveyData.involvementRelevant)}
                </div>
                
                <div>
                    <p class="text-base font-semibold text-gray-800 mb-4">5. Você diria que achou a mensagem:</p>
                    ${renderLikertScale('inv_interesting', 'involvementInteresting', 'chata', 'interessante', 1, 9, surveyData.involvementInteresting)}
                </div>
                
                <div>
                    <p class="text-base font-semibold text-gray-800 mb-4">6. Você diria que achou a mensagem:</p>
                    ${renderLikertScale('inv_engaging', 'involvementEngaging', 'não envolvente', 'envolvente', 1, 9, surveyData.involvementEngaging)}
                </div>
            </div>
            
            <button onclick="validateLikertScreen('message_involvement', ['involvementInterested', 'involvementAbsorbed', 'involvementAttention', 'involvementRelevant', 'involvementInteresting', 'involvementEngaging'], 'intention')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderIntentionScreen() {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-4">Intenção de Uso</h2>
                <p class="text-lg text-gray-700 mb-2">Imagine que está prestes a fazer uma reserva na <strong class="text-blue-600">Airpnp</strong>.</p>
                <p class="text-gray-600">Indique o quanto é provável que utilize este novo benefício na sua próxima reserva:</p>
            </div>
            
            <div class="space-y-8 bg-gray-50 p-6 rounded-2xl">
                ${renderLikertScale('int_probable', 'intentionProbable', 'improvável', 'provável', 1, 7, surveyData.intentionProbable)}
                ${renderLikertScale('int_possible', 'intentionPossible', 'impossível', 'possível', 1, 7, surveyData.intentionPossible)}
                ${renderLikertScale('int_definitely', 'intentionDefinitelyUse', 'definitivamente não usaria', 'definitivamente usaria', 1, 7, surveyData.intentionDefinitelyUse)}
                ${renderLikertScale('int_frequent', 'intentionFrequent', 'nada frequente', 'muito frequente', 1, 7, surveyData.intentionFrequent)}
            </div>
            
            <button onclick="validateLikertScreen('intention', ['intentionProbable', 'intentionPossible', 'intentionDefinitelyUse', 'intentionFrequent'], 'website')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderWebsiteScreen() {
    return `
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">Apresentação do site TAGPEAK</h2>
            
            <div class="space-y-8">
                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="flex items-start space-x-4">
                        <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">01</div>
                        <div>
                            <h3 class="text-xl font-bold mb-2">Purchase from our partner stores</h3>
                            <p class="text-gray-700">Check our available brands and go to their website to make a purchase.</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="flex items-start space-x-4">
                        <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">02</div>
                        <div>
                            <h3 class="text-xl font-bold mb-2">We invest a % of the price you paid</h3>
                            <p class="text-gray-700">Brands fund strategic investments in high-potential companies, which allow us to boost your reward. This has no extra cost to you.</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="flex items-start space-x-4">
                        <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">03</div>
                        <div>
                            <h3 class="text-xl font-bold mb-2">Follow the reward evolution</h3>
                            <p class="text-gray-700">Your cash reward will move according to the investments made by Tagpeak. You get to see the daily evolution on your dashboard.</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-lg">
                    <div class="flex items-start space-x-4">
                        <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">04</div>
                        <div>
                            <h3 class="text-xl font-bold mb-2">Cash-out the reward at any time</h3>
                            <p class="text-gray-700">Whenever you decide or the pre-defined investment period is over, you may cash out directly to your bank account.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <button onclick="renderScreen('emotions_1')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderEmotionsScreen1() {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-3">Avaliação do Produto</h2>
                <p class="text-gray-600">De acordo com as informações apresentadas, avalie as seguintes afirmações:</p>
            </div>
            
            <div class="space-y-8">
                <div class="bg-gray-50 p-6 rounded-2xl">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">1. Facilidade de uso</h3>
                    <div class="space-y-6">
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"É difícil de utilizar o benefício"</p>
                            ${renderLikertScale('ease_difficult', 'easeDifficult', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.easeDifficult)}
                        </div>
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"Eu acredito que é fácil utilizar o benefício"</p>
                            ${renderLikertScale('ease_easy', 'easeEasy', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.easeEasy)}
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-2xl">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">2. Visão generalizada do produto</h3>
                    <div class="space-y-6">
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"Poderia explicar facilmente o funcionamento associado ao benefício"</p>
                            ${renderLikertScale('product_explain', 'productExplainEasy', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.productExplainEasy)}
                        </div>
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"Não é difícil de dar fazer uma descrição precisa sobre o benefício."</p>
                            ${renderLikertScale('product_desc', 'productDescriptionEasy', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.productDescriptionEasy)}
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-2xl">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">3. Clareza na utilização</h3>
                    <div class="space-y-6">
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"As etapas do processo de utilização do benefício são claras para mim"</p>
                            ${renderLikertScale('clarity_steps', 'clarityStepsClear', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.clarityStepsClear)}
                        </div>
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"Sinto‑me segura/o quanto à forma de utilizar o benefício de forma eficaz."</p>
                            ${renderLikertScale('clarity_secure', 'clarityFeelSecure', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.clarityFeelSecure)}
                        </div>
                    </div>
                </div>
            </div>
            
            <button onclick="validateLikertScreen('emotions_1', ['easeDifficult', 'easeEasy', 'productExplainEasy', 'productDescriptionEasy', 'clarityStepsClear', 'clarityFeelSecure'], 'emotions_2')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderEmotionsScreen2() {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-3">Avaliação do Produto (continuação)</h2>
                <p class="text-gray-600">Avalie as seguintes afirmações:</p>
            </div>
            
            <div class="space-y-8">
                <div class="bg-gray-50 p-6 rounded-2xl">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">4. Percepção de vantagem em relação a outros benefícios</h3>
                    <div class="space-y-6">
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"Este benefício parece‑me mais vantajoso do que outras opções de desconto ou cashback que conheço."</p>
                            ${renderLikertScale('advantage_more', 'advantageMoreAdvantageous', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.advantageMoreAdvantageous)}
                        </div>
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"Com este benefício, sinto que fico em melhor posição do que com benefícios tradicionais."</p>
                            ${renderLikertScale('advantage_better', 'advantageBetterPosition', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.advantageBetterPosition)}
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-2xl">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">5. Vontade/interesse de utilização</h3>
                    <div class="space-y-6">
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"Tenho interesse em usar este benefício."</p>
                            ${renderLikertScale('willingness_interest', 'willingnessInterest', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.willingnessInterest)}
                        </div>
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"É provável que eu utilize este benefício sempre que tiver oportunidade."</p>
                            ${renderLikertScale('willingness_likely', 'willingnessLikelyUse', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.willingnessLikelyUse)}
                        </div>
                        <div>
                            <p class="text-base font-medium text-gray-800 mb-4">"Pretendo utilizar este benefício no futuro."</p>
                            ${renderLikertScale('willingness_future', 'willingnessIntendFuture', 'Discordo totalmente', 'Concordo totalmente', 1, 7, surveyData.willingnessIntendFuture)}
                        </div>
                    </div>
                </div>
            </div>
            
            <button onclick="validateLikertScreen('emotions_2', ['advantageMoreAdvantageous', 'advantageBetterPosition', 'willingnessInterest', 'willingnessLikelyUse', 'willingnessIntendFuture'], 'concerns')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderConcernsScreen() {
    return `
        <div class="space-y-8">
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-4">Dúvidas ou Receios</h2>
                <p class="text-lg text-gray-700 mb-2">Após as informações apresentadas sobre o produto, há alguma dúvida ou receio que ainda tenha em mente?</p>
                <p class="text-sm text-gray-500">Por favor, partilhe as suas preocupações ou questões.</p>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-2xl">
                <label for="concerns" class="block text-base font-semibold text-gray-800 mb-3">As suas dúvidas ou receios:</label>
                <textarea 
                    id="concerns" 
                    rows="6" 
                    class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none" 
                    placeholder="Escreva aqui as suas dúvidas ou receios..."
                    required 
                    oninput="surveyData.concernsText = this.value; clearError('concerns-error')"
                >${surveyData.concernsText || ''}</textarea>
                <p id="concerns-error" class="text-red-500 text-sm mt-2 hidden">Por favor, escreva pelo menos algumas palavras sobre as suas dúvidas ou receios.</p>
                <p class="text-sm text-gray-500 mt-2">Mínimo de 5 caracteres</p>
            </div>
            
            <button onclick="validateConcernsAndSubmit()" class="btn-primary mt-4 w-full">
                Submeter
            </button>
        </div>
    `;
}

function renderThankYouScreen() {
    return `
        <div class="text-center space-y-8">
            <div class="mb-8">
                <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 class="text-4xl font-bold mb-4">Obrigado(a)!</h1>
                <p class="text-xl text-gray-700 mb-2">O seu estudo está completo</p>
                <p class="text-lg text-gray-600">As suas respostas foram guardadas com sucesso.</p>
            </div>
            
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200 shadow-lg max-w-md mx-auto">
                <p class="text-sm text-gray-600 mb-3 font-medium">O seu ID de Utilizador para verificação:</p>
                <div class="bg-white p-4 rounded-xl border-2 border-blue-300">
                    <p class="text-2xl font-mono font-bold text-blue-600 tracking-wider">${userId}</p>
                </div>
                <p class="text-xs text-gray-500 mt-3">Guarde este ID caso precise de verificar a sua participação.</p>
            </div>
            
            <div class="pt-6">
                <p class="text-gray-600">Agradecemos o seu tempo e contribuição!</p>
            </div>
        </div>
    `;
}

// --- HELPER FUNCTIONS ---

function selectOption(fieldName, value, groupId) {
    const radio = document.querySelector(`input[name="${fieldName}"][value="${value}"]`);
    if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
    }
}

function clearError(errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.classList.add('hidden');
    }
}

function showError(errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.classList.remove('hidden');
    }
}

function renderLikertScale(questionId, fieldName, leftLabel, rightLabel, min = 1, max = 7, currentValue = null) {
    const options = [];
    for (let i = min; i <= max; i++) {
        const isSelected = currentValue === i;
        options.push(`
            <label class="likert-option-btn flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md scale-105' 
                    : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
            }" onclick="selectLikertOption('${fieldName}', ${i}, '${questionId}')">
                <input type="radio" name="${fieldName}" value="${i}" class="hidden" ${isSelected ? 'checked' : ''} onchange="surveyData.${fieldName} = ${i}; clearError('${questionId}-error')">
                <span class="text-lg font-semibold text-gray-700">${i}</span>
            </label>
        `);
    }
    
    const gridCols = max === 9 ? 'grid-cols-9' : max === 7 ? 'grid-cols-7' : `grid-cols-${max}`;
    
    return `
        <div class="likert-question">
            <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium text-gray-600 text-left">${leftLabel}</span>
                <span class="text-sm font-medium text-gray-600 text-right">${rightLabel}</span>
            </div>
            <div class="grid ${gridCols} gap-2 mb-2" id="${questionId}-options">
                ${options.join('')}
            </div>
            <p id="${questionId}-error" class="text-red-500 text-sm mt-2 hidden">Por favor, selecione uma opção.</p>
        </div>
    `;
}

function selectLikertOption(fieldName, value, questionId) {
    surveyData[fieldName] = value;
    const radio = document.querySelector(`input[name="${fieldName}"][value="${value}"]`);
    if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
    }
    
    // Update visual state
    const container = document.getElementById(`${questionId}-options`);
    if (container) {
        const labels = container.querySelectorAll('label');
        labels.forEach((label, index) => {
            if (index + 1 === value) {
                label.classList.add('border-blue-500', 'bg-blue-50', 'shadow-md', 'scale-105');
                label.classList.remove('border-gray-300');
            } else {
                label.classList.remove('border-blue-500', 'bg-blue-50', 'shadow-md', 'scale-105');
                label.classList.add('border-gray-300');
            }
        });
    }
    
    clearError(`${questionId}-error`);
}

function validateAndContinue(currentScreen, nextScreen) {
    let isValid = true;
    let errors = [];
    
    if (currentScreen === 'demographics') {
        if (!surveyData.age) {
            showError('age-error');
            errors.push('Idade');
        }
        if (!surveyData.gender) {
            showError('gender-error');
            errors.push('Sexo');
        }
        if (!surveyData.monthlyIncome) {
            showError('income-error');
            errors.push('Rendimento');
        }
        if (!surveyData.shoppingPreference) {
            showError('shopping-error');
            errors.push('Forma de compras');
        }
        
        if (errors.length > 0) {
            isValid = false;
            // Scroll to first error
            const firstError = document.getElementById(errors[0].toLowerCase().replace(' ', '-') + '-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    } else if (currentScreen === 'financial_literacy') {
        if (!surveyData.financialLiteracyQ1 || !surveyData.financialLiteracyQ2 || !surveyData.financialLiteracyQ3) {
            alert('Por favor, responda a todas as questões.');
            isValid = false;
        }
    } else if (currentScreen === 'exclusion') {
        if (!surveyData.exclusionBenefitType || !surveyData.exclusionPercentage) {
            alert('Por favor, responda a todas as questões.');
            isValid = false;
        }
    }
    
    if (isValid) {
        renderScreen(nextScreen);
    } else if (errors.length > 0) {
        // Highlight errors visually
        errors.forEach(error => {
            const fieldName = error.toLowerCase().replace(' ', '');
            const group = document.getElementById(fieldName + '-group');
            if (group) {
                group.classList.add('ring-2', 'ring-red-500', 'ring-offset-2');
                setTimeout(() => {
                    group.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2');
                }, 3000);
            }
        });
    }
}

function validateLikertScreen(screenName, fieldNames, nextScreen) {
    let isValid = true;
    let missingFields = [];
    
    // Map field names to question IDs
    const fieldToQuestionId = {
        'initialInvolvementImportant': 'inv_important',
        'initialInvolvementRelevant': 'inv_relevant',
        'initialInvolvementMeaningful': 'inv_meaningful',
        'initialInvolvementValuable': 'inv_valuable',
        'manipulationLossEmphasis': 'manip_loss',
        'manipulationGlobalIdea': 'manip_global',
        'involvementInterested': 'inv_interested',
        'involvementAbsorbed': 'inv_absorbed',
        'involvementAttention': 'inv_attention',
        'involvementRelevant': 'inv_relevant_msg',
        'involvementInteresting': 'inv_interesting',
        'involvementEngaging': 'inv_engaging',
        'intentionProbable': 'int_probable',
        'intentionPossible': 'int_possible',
        'intentionDefinitelyUse': 'int_definitely',
        'intentionFrequent': 'int_frequent',
        'easeDifficult': 'ease_difficult',
        'easeEasy': 'ease_easy',
        'productExplainEasy': 'product_explain',
        'productDescriptionEasy': 'product_desc',
        'clarityStepsClear': 'clarity_steps',
        'clarityFeelSecure': 'clarity_secure',
        'advantageMoreAdvantageous': 'advantage_more',
        'advantageBetterPosition': 'advantage_better',
        'willingnessInterest': 'willingness_interest',
        'willingnessLikelyUse': 'willingness_likely',
        'willingnessIntendFuture': 'willingness_future'
    };
    
    fieldNames.forEach(fieldName => {
        if (!surveyData[fieldName] || surveyData[fieldName] === null) {
            isValid = false;
            missingFields.push(fieldName);
            // Show error for this field
            const questionId = fieldToQuestionId[fieldName] || fieldName;
            showError(`${questionId}-error`);
        }
    });
    
    if (isValid) {
        renderScreen(nextScreen);
    } else {
        // Scroll to first error
        if (missingFields.length > 0) {
            const firstField = missingFields[0];
            const questionId = fieldToQuestionId[firstField] || firstField;
            const errorEl = document.getElementById(`${questionId}-error`);
            if (errorEl) {
                errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
}

function validateConcernsAndSubmit() {
    console.log('validateConcernsAndSubmit called');
    const concernsTextarea = document.getElementById('concerns');
    
    if (!concernsTextarea) {
        console.error('Concerns textarea not found!');
        alert('Erro: campo de texto não encontrado. Por favor, recarregue a página.');
        return;
    }
    
    const concernsText = concernsTextarea.value.trim();
    console.log('Concerns text length:', concernsText.length);
    
    if (!concernsText || concernsText.length < 5) {
        showError('concerns-error');
        concernsTextarea.classList.add('border-red-500', 'ring-2', 'ring-red-200');
        concernsTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            concernsTextarea.classList.remove('ring-2', 'ring-red-200');
        }, 3000);
        return;
    }
    
    concernsTextarea.classList.remove('border-red-500');
    surveyData.concernsText = concernsText;
    console.log('Calling saveResults...');
    saveResults();
}

// --- SAVE RESULTS ---

async function saveResults() {
    console.log('saveResults called');
    console.log('Data to save:', { userId, framingCondition, surveyData });
    
    try {
        console.log('Making API request to /api/save-results');
        const response = await fetch('/api/save-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                framingCondition,
                surveyData
            })
        });

        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Response data:', responseData);
        console.log('Full error details:', responseData.details, responseData.code, responseData.hint);

        if (!response.ok) {
            const errorMessage = responseData.details || responseData.error || 'Unknown error';
            const errorHint = responseData.hint ? `\n\nHint: ${responseData.hint}` : '';
            const errorCode = responseData.code ? `\n\nCode: ${responseData.code}` : '';
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}${errorCode}${errorHint}`);
        }

        console.log('Results saved successfully');
        renderScreen('thank_you');
    } catch (error) {
        console.error('Error saving results:', error);
        console.error('Full error:', error);
        alert('Erro ao guardar os dados: ' + error.message + '\n\nPor favor, verifique a consola do navegador para mais detalhes.');
        // Still show thank you screen even if save fails
        renderScreen('thank_you');
    }
}

// Make functions globally accessible
window.renderScreen = renderScreen;
window.validateAndContinue = validateAndContinue;
window.validateLikertScreen = validateLikertScreen;
window.validateConcernsAndSubmit = validateConcernsAndSubmit;
window.selectOption = selectOption;
window.selectLikertOption = selectLikertOption;
window.clearError = clearError;
window.showError = showError;
window.assignFramingCondition = assignFramingCondition;
window.saveResults = saveResults;
window.surveyData = surveyData;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeSupabase();
    renderScreen('welcome');
});
