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
    // Brand selection
    selectedBrand: null,
    
    // Demographics (Ecrã 2)
    age: null,
    gender: null,
    monthlyIncome: null,
    shoppingPreference: null,
    firstName: null,
    prolificId: null,
    
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
    
    // Intention to use after website (Ecrã 10b)
    intentionAfterWebsiteProbable: null, // 1-7
    intentionAfterWebsitePossible: null, // 1-7
    intentionAfterWebsiteDefinitelyUse: null, // 1-7
    intentionAfterWebsiteFrequent: null, // 1-7
    
    // Website viewing time
    websiteViewTime: null, // in seconds
    
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

// Brand names
const brands = ['Adidas', 'Booking.com', 'Sephora', 'Samsung', 'New Balance', 'Conforama', 'Sonos', 'Temu', 'Fila', 'Tous', 'Converse', 'Gocco', 'Pikolin'];

// Email framings - dynamically use selected brand
function getEmailFraming(brandName) {
    return {
        positive: {
            subject: `Ganhe mais com suas compras ${brandName}`,
            greeting: "Olá, [Nome da pessoa],",
            body1: `A ${brandName}, em parceria com a Tagpeak, uniu forças para multiplicar as vantagens sempre que faz compras conosco.`,
            body2: "Agora podes ter uma percentagem do valor que paga nas suas compras automaticamente investida em ações de empresas cotadas em bolsa pela equipa especializada da Tagpeak, sem qualquer custo e risco para si.",
            body3: "Tudo isso para permitir que ganhe um cashback de até <strong>100% do valor gasto nas suas compras</strong>. Aproveite estes benefícios exclusivos!",
            body4: "Comece a ganhar agora! É muito simples, basta escrever <strong>\"tagpeak\"</strong> no campo de desconto/cupão no checkout da sua próxima compra na ${brandName}.",
            body5: "Para mais informações, visite: www.tagpeak.com"
        },
        negative: {
            subject: `Não deixei escapar os benefícios nas suas compras ${brandName}`,
            greeting: "Olá, [Nome da pessoa],",
            body1: `A ${brandName}, em parceria com a Tagpeak, uniu forças para aumentar as vantagens sempre que faz compras conosco.`,
            body2: "Agora podes ter uma percentagem do valor que paga nas suas compras automaticamente investida em ações de empresas cotadas em bolsa pela equipa especializada da Tagpeak, sem qualquer custo e risco para si, mas somente se ativar a parceria.",
            body3: "Tudo isso para permitir que evite perder um cashback de até <strong>100% do valor gasto nas suas compras. Vais mesmo abrir mão desta oportunidade?</strong>",
            body4: "Para não perder, basta escrever <strong>\"tagpeak\"</strong> no campo de desconto/cupão no checkout da sua próxima compra na ${brandName}.",
            body5: "Para mais informações, visite: www.tagpeak.com"
        },
        neutral: {
            subject: `Nova parceria ${brandName} e Tagpeak`,
            greeting: "Olá, [Nome da pessoa],",
            body1: `A ${brandName} estabeleceu uma parceria com a Tagpeak com o objetivo de disponibilizar um benefício adicional às compras.`,
            body2: "Este benefício permite que uma percentagem do valor pago nas compras seja automaticamente investido em ações de empresas cotadas em bolsa, geridas pela equipa especializada da Tagpeak, sem custos ou riscos para o utilizador.",
            body3: "Esse mecanismo permite obter um cashback de até 100% do valor gasto na compra.",
            body4: "Para utilizar, basta inserir <strong>\"tagpeak\"</strong> no campo de desconto/cupão durante o checkout da sua próxima compra na ${brandName}.",
            body5: "Para mais informações, visite: www.tagpeak.com"
        }
    };
}

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
        // Ensure card styling
        surveyContainer.classList.add('card');
        surveyContainer.style.padding = '';
        surveyContainer.style.boxShadow = '';
        
        contentArea.innerHTML = '';
        
        switch (screenName) {
            case 'welcome':
                contentArea.innerHTML = renderWelcomeScreen();
                break;
            case 'demographics':
                contentArea.innerHTML = renderDemographicsScreen();
                break;
            case 'brand_selection':
                contentArea.innerHTML = renderBrandSelectionScreen();
                break;
            case 'financial_literacy':
                contentArea.innerHTML = renderFinancialLiteracyScreen();
                break;
            case 'email_notification':
                contentArea.innerHTML = renderEmailNotificationScreen();
                break;
            case 'tagpeak_info':
                contentArea.innerHTML = renderTagpeakInfoScreen();
                break;
            case 'website_view':
                contentArea.innerHTML = renderWebsiteViewScreen();
                break;
            case 'intention_after_website':
                contentArea.innerHTML = renderIntentionAfterWebsiteScreen();
                break;
            case 'initial_involvement':
                contentArea.innerHTML = renderInitialInvolvementScreen();
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
        <div class="text-center space-y-6">
            <div>
                <h1 class="text-4xl font-bold mb-3">Bem-vindo(a)!</h1>
                <p class="text-lg text-gray-700">Agradecemos por participar neste estudo sobre programas de benefícios.</p>
            </div>
            
            <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                <p class="text-gray-700 mb-4">A pesquisa leva cerca de <strong>7-10 minutos</strong> e as suas respostas são <strong>anónimas e confidenciais</strong>.</p>
                <p class="text-sm text-gray-600">A participação é voluntária e pode ser interrompida a qualquer momento.</p>
                <p class="text-xs text-gray-500 mt-3">Questões: <a href="mailto:luis@tagpeak.com" class="text-blue-600 hover:underline">luis@tagpeak.com</a></p>
            </div>
            
            <button onclick="renderScreen('demographics')" class="btn-primary mt-4">
                Continuar
            </button>
        </div>
    `;
}

function renderDemographicsScreen() {
    return `
        <div class="space-y-6">
            <p class="text-center text-gray-600 mb-4">Os seus dados serão mantidos confidenciais e utilizados apenas para fins de análise estatística.</p>
            
            <div class="space-y-5">
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
                
                <div>
                    <label class="block text-base font-semibold text-gray-800 mb-3">6. Prolific ID</label>
                    <input type="text" id="prolificId" class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Seu ID do Prolific" value="${surveyData.prolificId || ''}" onchange="surveyData.prolificId = this.value">
                </div>
            </div>
            
            <button onclick="validateAndContinue('demographics', 'financial_literacy')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderBrandSelectionScreen() {
    return `
        <div class="space-y-6">
            <p class="text-center text-lg text-gray-700 mb-6">Escolha uma marca que gosta ou utiliza:</p>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                ${brands.map(brand => `
                    <button 
                        onclick="selectBrand('${brand}')" 
                        class="brand-btn p-4 border-2 rounded-xl font-semibold text-gray-700 transition-all hover:scale-105 ${surveyData.selectedBrand === brand ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}"
                    >
                        ${brand}
                    </button>
                `).join('')}
            </div>
            <p id="brand-error" class="text-red-500 text-sm text-center mt-2 hidden">Por favor, selecione uma marca.</p>
            
            <button onclick="validateBrandSelection()" class="btn-primary mt-6 w-full">
                Continuar
            </button>
        </div>
    `;
}

function selectBrand(brand) {
    surveyData.selectedBrand = brand;
    clearError('brand-error');
    // Re-render to update visual state
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
        contentArea.innerHTML = renderBrandSelectionScreen();
    }
}

function validateBrandSelection() {
    if (!surveyData.selectedBrand) {
        showError('brand-error');
        return;
    }
    renderScreen('email_notification');
}

function renderFinancialLiteracyScreen() {
    return `
        <div class="space-y-5">
            <p class="text-center text-gray-600 mb-4">Por favor, responda às seguintes perguntas:</p>
            
            <div class="space-y-4">
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
            
            <button onclick="validateAndContinue('financial_literacy', 'brand_selection')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderInitialInvolvementScreen() {
    return `
        <div class="space-y-5">
            <p class="text-center text-gray-700 mb-2">"Para mim, benefícios promocionais (como cashback, descontos, cupões, etc.) são:"</p>
            <p class="text-center text-xs text-gray-500 mb-4">*itens cotados em reverso</p>
            
            <div class="space-y-5 bg-gray-50 p-4 rounded-2xl">
                ${renderLikertScale('inv_important', 'initialInvolvementImportant', 'importantes', 'nada importantes', 1, 7, surveyData.initialInvolvementImportant)}
                ${renderLikertScale('inv_relevant', 'initialInvolvementRelevant', 'relevantes', 'irrelevantes', 1, 7, surveyData.initialInvolvementRelevant)}
                ${renderLikertScale('inv_meaningful', 'initialInvolvementMeaningful', 'não significam nada', 'significam muito para mim', 1, 7, surveyData.initialInvolvementMeaningful)}
                ${renderLikertScale('inv_valuable', 'initialInvolvementValuable', 'sem valor', 'valiosos', 1, 7, surveyData.initialInvolvementValuable)}
            </div>
            
            <button onclick="validateLikertScreen('initial_involvement', ['initialInvolvementImportant', 'initialInvolvementRelevant', 'initialInvolvementMeaningful', 'initialInvolvementValuable'], 'brand_selection')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderEmailNotificationScreen() {
    return `
        <div class="text-center space-y-8">
            <div class="relative">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <div class="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm animate-pulse">
                    1
                </div>
            </div>
            
            <div class="space-y-4">
                <h2 class="text-3xl font-bold text-gray-800">Recebeu um novo e-mail!</h2>
                <p class="text-xl text-gray-700">Por favor, abra e leia o e-mail que acabou de receber.</p>
                <p class="text-gray-600">As informações contidas no e-mail serão importantes para as próximas questões.</p>
            </div>
            
            <button onclick="assignFramingCondition(); renderScreen('email_framing')" class="btn-primary mt-8">
                Abrir E-mail
            </button>
        </div>
    `;
}

function renderEmailFramingScreen() {
    if (!framingCondition) {
        assignFramingCondition();
    }
    
    if (!surveyData.selectedBrand) {
        return '<div class="text-center text-red-500">Erro: Marca não selecionada. Por favor, volte atrás.</div>';
    }
    
    const brandName = surveyData.selectedBrand;
    const emailFramings = getEmailFraming(brandName);
    const email = emailFramings[framingCondition];
    const displayName = surveyData.firstName || '[Nome da pessoa]';
    
    // Generate email domain from brand name
    const emailDomain = brandName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    const brandInitial = brandName.charAt(0).toUpperCase();
    
    return `
        <div class="space-y-6">
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
                                        ${brandInitial}
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center space-x-2">
                                        <span class="font-semibold text-gray-900 truncate">${brandName}</span>
                                        <span class="text-xs text-gray-500">noreply@${emailDomain}</span>
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
                                        ${brandInitial}
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900">${brandName}</div>
                                        <div class="text-sm text-gray-500">noreply@${emailDomain}</div>
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
                                <p>${brandName} - A sua plataforma de compras</p>
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
        <div class="space-y-5">
            <p class="text-center text-gray-600 mb-4">Responda às seguintes questões com base no e-mail que acabou de ler:</p>
            
            <div class="space-y-4">
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
        <div class="space-y-5">
            <p class="text-center text-gray-600 mb-4">Com base no e-mail que leu, responda às seguintes questões:</p>
            
            <div class="space-y-5 bg-gray-50 p-4 rounded-2xl">
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
        <div class="space-y-5">
            <p class="text-center text-gray-600 mb-4">Avalie a sua experiência ao ler o e-mail:</p>
            
            <div class="space-y-5 bg-gray-50 p-4 rounded-2xl">
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
    const brandName = surveyData.selectedBrand || 'a marca selecionada';
    return `
        <div class="space-y-5">
            <p class="text-center text-gray-700 mb-2">Imagine que está prestes a fazer uma compra na <strong class="text-blue-600">${brandName}</strong>.</p>
            <p class="text-center text-gray-600 mb-4">Indique o quanto é provável que utilize este novo benefício na sua próxima compra:</p>
            
            <div class="space-y-5 bg-gray-50 p-4 rounded-2xl">
                ${renderLikertScale('int_probable', 'intentionProbable', 'improvável', 'provável', 1, 7, surveyData.intentionProbable)}
                ${renderLikertScale('int_possible', 'intentionPossible', 'impossível', 'possível', 1, 7, surveyData.intentionPossible)}
                ${renderLikertScale('int_definitely', 'intentionDefinitelyUse', 'definitivamente não usaria', 'definitivamente usaria', 1, 7, surveyData.intentionDefinitelyUse)}
                ${renderLikertScale('int_frequent', 'intentionFrequent', 'nada frequente', 'muito frequente', 1, 7, surveyData.intentionFrequent)}
            </div>
            
            <button onclick="validateLikertScreen('intention', ['intentionProbable', 'intentionPossible', 'intentionDefinitelyUse', 'intentionFrequent'], 'tagpeak_info')" class="btn-primary mt-6 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderTagpeakInfoScreen() {
    return `
        <div class="text-center space-y-6">
            <p class="text-lg text-gray-700">Vamos dar-lhe mais informações sobre a Tagpeak que podem ter faltado no e-mail.</p>
            <p class="text-gray-600">Poderá navegar livremente pelo website da Tagpeak para conhecer melhor o produto.</p>
            
            <button onclick="renderScreen('website_view')" class="btn-primary mt-4">
                Continuar
            </button>
        </div>
    `;
}

let websiteStartTime = null;

function renderWebsiteViewScreen() {
    // Start tracking time when screen loads
    websiteStartTime = Date.now();
    
    return `
        <div class="space-y-4">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-300" style="height: 80vh;">
                <div class="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-300">
                    <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div class="flex-1 mx-4">
                        <div class="bg-white px-3 py-1 rounded text-sm text-gray-600 text-center">https://tagpeak.com</div>
                    </div>
                    <div class="text-sm text-gray-500">Navegue pelo website</div>
                </div>
                <iframe 
                    id="tagpeak-iframe"
                    src="https://tagpeak.com" 
                    class="w-full h-full border-0"
                    style="height: calc(80vh - 50px);"
                    allow="fullscreen"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p class="font-medium mb-1">Nota:</p>
                <p>Se o website não carregar, pode ser devido a restrições de segurança. Por favor, clique em "Continuar" quando estiver pronto.</p>
            </div>
            
            <button onclick="finishWebsiteView()" class="btn-primary w-full">
                Continuar
            </button>
        </div>
    `;
}

function finishWebsiteView() {
    if (websiteStartTime) {
        const timeSpent = Math.floor((Date.now() - websiteStartTime) / 1000); // in seconds
        surveyData.websiteViewTime = timeSpent;
        websiteStartTime = null;
    }
    renderScreen('intention_after_website');
}

function renderIntentionAfterWebsiteScreen() {
    const brandName = surveyData.selectedBrand || 'a marca selecionada';
    return `
        <div class="space-y-5">
            <p class="text-center text-gray-700 mb-2">Agora que conhece melhor a Tagpeak, imagine que está prestes a fazer uma compra na <strong class="text-blue-600">${brandName}</strong>.</p>
            <p class="text-center text-gray-600 mb-4">Indique o quanto é provável que utilize este novo benefício na sua próxima compra:</p>
            
            <div class="space-y-5 bg-gray-50 p-4 rounded-2xl">
                ${renderLikertScale('int_after_probable', 'intentionAfterWebsiteProbable', 'improvável', 'provável', 1, 7, surveyData.intentionAfterWebsiteProbable)}
                ${renderLikertScale('int_after_possible', 'intentionAfterWebsitePossible', 'impossível', 'possível', 1, 7, surveyData.intentionAfterWebsitePossible)}
                ${renderLikertScale('int_after_definitely', 'intentionAfterWebsiteDefinitelyUse', 'definitivamente não usaria', 'definitivamente usaria', 1, 7, surveyData.intentionAfterWebsiteDefinitelyUse)}
                ${renderLikertScale('int_after_frequent', 'intentionAfterWebsiteFrequent', 'nada frequente', 'muito frequente', 1, 7, surveyData.intentionAfterWebsiteFrequent)}
            </div>
            
            <button onclick="validateLikertScreen('intention_after_website', ['intentionAfterWebsiteProbable', 'intentionAfterWebsitePossible', 'intentionAfterWebsiteDefinitelyUse', 'intentionAfterWebsiteFrequent'], 'emotions_1')" class="btn-primary mt-6 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderEmotionsScreen1() {
    return `
        <div class="space-y-5">
            <p class="text-center text-gray-600 mb-4">De acordo com as informações apresentadas, avalie as seguintes afirmações:</p>
            
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-2xl">
                    <div class="space-y-4">
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
                
                <div class="bg-gray-50 p-4 rounded-2xl">
                    <div class="space-y-4">
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
                
                <div class="bg-gray-50 p-4 rounded-2xl">
                    <div class="space-y-4">
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
            
            <button onclick="validateLikertScreen('emotions_1', ['easeDifficult', 'easeEasy', 'productExplainEasy', 'productDescriptionEasy', 'clarityStepsClear', 'clarityFeelSecure'], 'emotions_2')" class="btn-primary mt-6 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderEmotionsScreen2() {
    return `
        <div class="space-y-5">
            <p class="text-center text-gray-600 mb-4">Avalie as seguintes afirmações:</p>
            
            <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-2xl">
                    <div class="space-y-4">
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
                
                <div class="bg-gray-50 p-4 rounded-2xl">
                    <div class="space-y-4">
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
            
            <button onclick="validateLikertScreen('emotions_2', ['advantageMoreAdvantageous', 'advantageBetterPosition', 'willingnessInterest', 'willingnessLikelyUse', 'willingnessIntendFuture'], 'concerns')" class="btn-primary mt-6 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderConcernsScreen() {
    return `
        <div class="space-y-5">
            <div class="text-center">
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
        'willingnessIntendFuture': 'willingness_future',
        'intentionAfterWebsiteProbable': 'int_after_probable',
        'intentionAfterWebsitePossible': 'int_after_possible',
        'intentionAfterWebsiteDefinitelyUse': 'int_after_definitely',
        'intentionAfterWebsiteFrequent': 'int_after_frequent'
    };
    
    // Handle brand selection validation
    if (screenName === 'brand_selection') {
        if (!surveyData.selectedBrand) {
            showError('brand-error');
            isValid = false;
        }
    }
    
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
window.validateBrandSelection = validateBrandSelection;
window.selectOption = selectOption;
window.selectBrand = selectBrand;
window.selectLikertOption = selectLikertOption;
window.clearError = clearError;
window.showError = showError;
window.assignFramingCondition = assignFramingCondition;
window.finishWebsiteView = finishWebsiteView;
window.saveResults = saveResults;
window.surveyData = surveyData;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeSupabase();
    renderScreen('welcome');
});
