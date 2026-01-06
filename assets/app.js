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
        <div class="text-center space-y-6">
            <h1 class="text-4xl font-bold mb-4">Bem-vindo(a)!</h1>
            <p class="text-lg text-gray-700 mb-8">Agradecemos por dedicar alguns minutos para participar deste estudo.</p>
            
            <div class="text-left space-y-6 bg-gray-50 p-6 rounded-lg">
                <div>
                    <h3 class="font-semibold text-lg mb-2">Objetivo da Pesquisa:</h3>
                    <p class="text-gray-700">Queremos compreender melhor programas de benefícios oferecidos por empresas. As respostas vão ajudar-nos a desenvolver soluções mais alinhadas com as demandas dos consumidores.</p>
                </div>
                
                <div>
                    <h3 class="font-semibold text-lg mb-2">Tempo Estimado:</h3>
                    <p class="text-gray-700">A pesquisa leva cerca de 7 a 10 minutos para ser concluída.</p>
                </div>
                
                <div>
                    <h3 class="font-semibold text-lg mb-2">Confidencialidade:</h3>
                    <p class="text-gray-700">As suas respostas são anónimas e serão utilizadas exclusivamente para fins internos, com o objetivo de gerar insights e melhorar os nossos serviços.</p>
                </div>
                
                <div>
                    <h3 class="font-semibold text-lg mb-2">Participação Voluntária:</h3>
                    <p class="text-gray-700">A participação é totalmente voluntária e pode ser interrompida a qualquer momento. Ao continuar, está a concordar com os termos acima.</p>
                </div>
                
                <div>
                    <h3 class="font-semibold text-lg mb-2">Para questões ou feedback:</h3>
                    <p class="text-gray-700"><a href="mailto:luis@tagpeak.com" class="text-blue-600 hover:underline">luis@tagpeak.com</a></p>
                </div>
            </div>
            
            <button onclick="renderScreen('demographics')" class="btn-primary mt-8">
                Continuar
            </button>
        </div>
    `;
}

function renderDemographicsScreen() {
    return `
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">Informação Sociodemográfica</h2>
            <p class="text-gray-700 mb-6">Por favor, preencha as seguintes questões. Os seus dados serão mantidos confidenciais e utilizados apenas para fins de análise estatística.</p>
            
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">1. Por favor, indique a sua Idade:</label>
                    <select id="age" class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" onchange="surveyData.age = this.value">
                        <option value="">Selecione...</option>
                        <option value="less_25">Menos de 25</option>
                        <option value="26_35">26-35</option>
                        <option value="36_50">36-50</option>
                        <option value="51_65">51-65</option>
                        <option value="66_plus">66 anos ou mais</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">2. Por favor, indique seu sexo:</label>
                    <select id="gender" class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" onchange="surveyData.gender = this.value">
                        <option value="">Selecione...</option>
                        <option value="mulher">Mulher</option>
                        <option value="homem">Homem</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">3. Por favor, selecione a faixa que melhor representa o seu rendimento médio mensal:</label>
                    <select id="income" class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" onchange="surveyData.monthlyIncome = this.value">
                        <option value="">Selecione...</option>
                        <option value="less_750">&lt; 750</option>
                        <option value="750_1500">750-1500</option>
                        <option value="1500_3000">1500-3000</option>
                        <option value="more_3000">&gt; 3000</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">4. Qual é a sua forma mais utilizada de realizar compras?</label>
                    <select id="shopping" class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" onchange="surveyData.shoppingPreference = this.value">
                        <option value="">Selecione...</option>
                        <option value="online">Online (internet / e-commerce)</option>
                        <option value="presencial">Presencial (em loja física)</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">5. Informe o seu primeiro nome (opcional). Essa informação será utilizada somente para melhorar a experiência:</label>
                    <input type="text" id="firstName" class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Seu primeiro nome" onchange="surveyData.firstName = this.value">
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
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">Avaliação de literacia financeira</h2>
            <p class="text-gray-700 mb-6">Por favor, responda as próximas perguntas:</p>
            
            <div class="space-y-8">
                <div class="bg-gray-50 p-6 rounded-lg">
                    <p class="font-medium mb-4">Suponha que tem €100 numa conta que rende 2% ao ano. Após 5 anos, quanto terá na conta?</p>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q1" value="more_102" class="mr-3" onchange="surveyData.financialLiteracyQ1 = this.value">
                            <span>Mais de €102</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q1" value="exactly_102" class="mr-3" onchange="surveyData.financialLiteracyQ1 = this.value">
                            <span>Exatamente €102</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q1" value="less_102" class="mr-3" onchange="surveyData.financialLiteracyQ1 = this.value">
                            <span>Menos de €102</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q1" value="dont_know" class="mr-3" onchange="surveyData.financialLiteracyQ1 = this.value">
                            <span>Não sabe</span>
                        </label>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-lg">
                    <p class="font-medium mb-4">Se a taxa de juros da sua conta for 1% ao ano e a inflação for 2%, após um ano o dinheiro permite comprar:</p>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q2" value="more" class="mr-3" onchange="surveyData.financialLiteracyQ2 = this.value">
                            <span>Mais</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q2" value="same" class="mr-3" onchange="surveyData.financialLiteracyQ2 = this.value">
                            <span>O mesmo</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q2" value="less" class="mr-3" onchange="surveyData.financialLiteracyQ2 = this.value">
                            <span>Menos</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q2" value="dont_know" class="mr-3" onchange="surveyData.financialLiteracyQ2 = this.value">
                            <span>Não sabe</span>
                        </label>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-lg">
                    <p class="font-medium mb-4">Comprar ações de uma única empresa é normalmente mais seguro do que investir num fundo diversificado.</p>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q3" value="true" class="mr-3" onchange="surveyData.financialLiteracyQ3 = this.value">
                            <span>Verdadeiro</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q3" value="false" class="mr-3" onchange="surveyData.financialLiteracyQ3 = this.value">
                            <span>Falso</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="fl_q3" value="dont_know" class="mr-3" onchange="surveyData.financialLiteracyQ3 = this.value">
                            <span>Não sabe</span>
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
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">Avaliação do envolvimento do participante</h2>
            <p class="text-gray-700 mb-6">Avalie a seguinte afirmação:</p>
            <p class="text-lg font-medium mb-6">"Para mim, benefícios promocionais (como cashback, descontos, cupões, etc.) são:"</p>
            
            <div class="space-y-6">
                <div>
                    <p class="mb-3">importantes <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> nada importantes*</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="inv_important" onchange="surveyData.initialInvolvementImportant = parseInt(this.value); updateLikertLabel('inv_important', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="inv_important_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">relevantes <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> irrelevantes*</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="inv_relevant" onchange="surveyData.initialInvolvementRelevant = parseInt(this.value); updateLikertLabel('inv_relevant', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="inv_relevant_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">não significam nada <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> significam muito para mim</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="inv_meaningful" onchange="surveyData.initialInvolvementMeaningful = parseInt(this.value); updateLikertLabel('inv_meaningful', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="inv_meaningful_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">sem valor <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> valiosos</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="inv_valuable" onchange="surveyData.initialInvolvementValuable = parseInt(this.value); updateLikertLabel('inv_valuable', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="inv_valuable_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <p class="text-sm text-gray-500 mt-4">*itens cotados em reverso.</p>
            </div>
            
            <button onclick="renderScreen('preparation')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderPreparationScreen() {
    return `
        <div class="p-8 text-center">
            <div class="bg-yellow-100 p-8 rounded-lg border-4 border-yellow-400">
                <h2 class="text-3xl font-bold text-yellow-900 mb-6">⚠️ Atenção!</h2>
                <p class="text-xl text-yellow-900 font-medium">
                    Pedimos que leia com atenção as informações que serão apresentadas a seguir, elas serão importantes para a conclusão do estudo
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
            
            <div class="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
                <div class="border-b border-gray-300 pb-4 mb-4">
                    <p class="text-sm text-gray-600 mb-1">Assunto:</p>
                    <p class="font-semibold text-lg">${email.subject}</p>
                </div>
                
                <div class="space-y-4 text-gray-800">
                    <p>${email.greeting.replace('[Nome da pessoa]', displayName)}</p>
                    <p>${email.body1}</p>
                    <p>${email.body2}</p>
                    <p>${email.body3}</p>
                    <p>${email.body4}</p>
                    <p class="mt-4">${email.body5}</p>
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
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">Perguntas de exclusão</h2>
            <p class="text-gray-700 mb-6">Responda às seguintes questões com base no e-mail que acabou de ler</p>
            
            <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-lg">
                    <p class="font-medium mb-4">"O e-mail refere qual tipo de benefício?"</p>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="exclusion_type" value="Desconto" class="mr-3" onchange="surveyData.exclusionBenefitType = this.value">
                            <span>Desconto</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="exclusion_type" value="Cashback" class="mr-3" onchange="surveyData.exclusionBenefitType = this.value">
                            <span>Cashback</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="exclusion_type" value="Cupão" class="mr-3" onchange="surveyData.exclusionBenefitType = this.value">
                            <span>Cupão</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="exclusion_type" value="Nenhum destes" class="mr-3" onchange="surveyData.exclusionBenefitType = this.value">
                            <span>Nenhum destes</span>
                        </label>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-lg">
                    <p class="font-medium mb-4">"O benefício mencionado permite recebimento/subtração de até quantos % do valor gasto?"</p>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="exclusion_percent" value="50%" class="mr-3" onchange="surveyData.exclusionPercentage = this.value">
                            <span>50%</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="exclusion_percent" value="25%" class="mr-3" onchange="surveyData.exclusionPercentage = this.value">
                            <span>25%</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="exclusion_percent" value="10%" class="mr-3" onchange="surveyData.exclusionPercentage = this.value">
                            <span>10%</span>
                        </label>
                        <label class="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="exclusion_percent" value="100%" class="mr-3" onchange="surveyData.exclusionPercentage = this.value">
                            <span>100%</span>
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
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">Manipulation Check</h2>
            
            <div class="space-y-6">
                <div>
                    <p class="mb-3">"A mensagem apresentada enfatizou principalmente:"</p>
                    <p class="text-sm text-gray-600 mb-3">Perdas por NÃO usar o benefício <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Benefícios de USAR o benefício.</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="manip_loss" onchange="surveyData.manipulationLossEmphasis = parseInt(this.value); updateLikertLabel('manip_loss', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="manip_loss_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">"Globalmente, a mensagem transmite mais a ideia de…"</p>
                    <p class="text-sm text-gray-600 mb-3">Não deixar passar algo que poderia me beneficiar <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Tirar partido de algo que pode trazer benefícios</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="manip_global" onchange="surveyData.manipulationGlobalIdea = parseInt(this.value); updateLikertLabel('manip_global', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="manip_global_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
            </div>
            
            <button onclick="renderScreen('message_involvement')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderMessageInvolvementScreen() {
    return `
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">Avaliação do envolvimento causado pela mensagem</h2>
            
            <div class="space-y-6">
                <div>
                    <p class="mb-3">1. Você diria que, enquanto lia, você:</p>
                    <p class="text-sm text-gray-600 mb-3">não estava interessado <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(9)</span> estava muito interessado</p>
                    <input type="range" min="1" max="9" value="5" class="slider w-full" id="inv_interested" onchange="surveyData.involvementInterested = parseInt(this.value); updateLikertLabel('inv_interested', this.value, 9)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="inv_interested_label" class="font-medium">5</span>
                        <span>9</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">2. não estava absorvido <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(9)</span> estava muito absorvido</p>
                    <input type="range" min="1" max="9" value="5" class="slider w-full" id="inv_absorbed" onchange="surveyData.involvementAbsorbed = parseInt(this.value); updateLikertLabel('inv_absorbed', this.value, 9)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="inv_absorbed_label" class="font-medium">5</span>
                        <span>9</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">3. leu a mensagem rapidamente por alto <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(9)</span> leu a mensagem com atenção</p>
                    <input type="range" min="1" max="9" value="5" class="slider w-full" id="inv_attention" onchange="surveyData.involvementAttention = parseInt(this.value); updateLikertLabel('inv_attention', this.value, 9)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="inv_attention_label" class="font-medium">5</span>
                        <span>9</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">4. Você diria que achou a mensagem:</p>
                    <p class="text-sm text-gray-600 mb-3">irrelevante <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(9)</span> relevante para si</p>
                    <input type="range" min="1" max="9" value="5" class="slider w-full" id="inv_relevant_msg" onchange="surveyData.involvementRelevant = parseInt(this.value); updateLikertLabel('inv_relevant_msg', this.value, 9)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="inv_relevant_msg_label" class="font-medium">5</span>
                        <span>9</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">5. chata <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(9)</span> interessante</p>
                    <input type="range" min="1" max="9" value="5" class="slider w-full" id="inv_interesting" onchange="surveyData.involvementInteresting = parseInt(this.value); updateLikertLabel('inv_interesting', this.value, 9)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="inv_interesting_label" class="font-medium">5</span>
                        <span>9</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">6. não envolvente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(9)</span> envolvente</p>
                    <input type="range" min="1" max="9" value="5" class="slider w-full" id="inv_engaging" onchange="surveyData.involvementEngaging = parseInt(this.value); updateLikertLabel('inv_engaging', this.value, 9)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="inv_engaging_label" class="font-medium">5</span>
                        <span>9</span>
                    </div>
                </div>
            </div>
            
            <button onclick="renderScreen('intention')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderIntentionScreen() {
    return `
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">INTENÇÃO DE USO</h2>
            <p class="text-gray-700 mb-6">Imagine que está prestes a fazer uma reserva na <strong>Airpnp.</strong></p>
            <p class="text-gray-700 mb-6">Por favor, indique o quanto é provável que você utilize este novo benefício na sua próxima reserva, respondendo às perguntas abaixo</p>
            
            <div class="space-y-6">
                <div>
                    <p class="mb-3">1. improvável <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> provável</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="int_probable" onchange="surveyData.intentionProbable = parseInt(this.value); updateLikertLabel('int_probable', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="int_probable_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">2. impossível <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> possível</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="int_possible" onchange="surveyData.intentionPossible = parseInt(this.value); updateLikertLabel('int_possible', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="int_possible_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">3. definitivamente não usaria <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> definitivamente usaria</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="int_definitely" onchange="surveyData.intentionDefinitelyUse = parseInt(this.value); updateLikertLabel('int_definitely', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="int_definitely_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">4. nada frequente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> muito frequente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="int_frequent" onchange="surveyData.intentionFrequent = parseInt(this.value); updateLikertLabel('int_frequent', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="int_frequent_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
            </div>
            
            <button onclick="renderScreen('website')" class="btn-primary mt-8 w-full">
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
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">Avaliação das Emoções Sentidas</h2>
            <h3 class="text-2xl font-semibold mb-4">1. Facilidade de uso</h3>
            <p class="text-gray-700 mb-6">De acordo com as informações apresentadas anteriormente, avalie as seguintes afirmações:</p>
            
            <div class="space-y-6">
                <div>
                    <p class="mb-3">"É difícil de utilizar o benefício"</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="ease_difficult" onchange="surveyData.easeDifficult = parseInt(this.value); updateLikertLabel('ease_difficult', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="ease_difficult_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">"Eu acredito que é fácil utilizar o benefício"</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="ease_easy" onchange="surveyData.easeEasy = parseInt(this.value); updateLikertLabel('ease_easy', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="ease_easy_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
            </div>
            
            <h3 class="text-2xl font-semibold mt-8 mb-4">2. Visão generalizada do produto</h3>
            <p class="text-gray-700 mb-6">De acordo com as informações apresentadas anteriormente, avalie as seguintes afirmações:</p>
            
            <div class="space-y-6">
                <div>
                    <p class="mb-3">"Poderia explicar facilmente o funcionamento associado ao benefício"</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="product_explain" onchange="surveyData.productExplainEasy = parseInt(this.value); updateLikertLabel('product_explain', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="product_explain_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">"Não é difícil de dar fazer uma descrição precisa sobre o benefício."</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="product_desc" onchange="surveyData.productDescriptionEasy = parseInt(this.value); updateLikertLabel('product_desc', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="product_desc_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
            </div>
            
            <h3 class="text-2xl font-semibold mt-8 mb-4">3. Clareza na utilização</h3>
            
            <div class="space-y-6">
                <div>
                    <p class="mb-3">"As etapas do processo de utilização do benefício são claras para mim"</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="clarity_steps" onchange="surveyData.clarityStepsClear = parseInt(this.value); updateLikertLabel('clarity_steps', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="clarity_steps_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">"Sinto‑me segura/o quanto à forma de utilizar o benefício de forma eficaz."</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="clarity_secure" onchange="surveyData.clarityFeelSecure = parseInt(this.value); updateLikertLabel('clarity_secure', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="clarity_secure_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
            </div>
            
            <button onclick="renderScreen('emotions_2')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderEmotionsScreen2() {
    return `
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">Avaliação das Emoções Sentidas (continuação)</h2>
            
            <h3 class="text-2xl font-semibold mb-4">4. Percepção de vantagem em relação a outros benefícios</h3>
            <p class="text-gray-700 mb-6">Avalie as seguintes afirmações:</p>
            
            <div class="space-y-6">
                <div>
                    <p class="mb-3">"Este benefício parece‑me mais vantajoso do que outras opções de desconto ou cashback que conheço."</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="advantage_more" onchange="surveyData.advantageMoreAdvantageous = parseInt(this.value); updateLikertLabel('advantage_more', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="advantage_more_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">"Com este benefício, sinto que fico em melhor posição do que com benefícios tradicionais."</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="advantage_better" onchange="surveyData.advantageBetterPosition = parseInt(this.value); updateLikertLabel('advantage_better', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="advantage_better_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
            </div>
            
            <h3 class="text-2xl font-semibold mt-8 mb-4">5. Vontade/interesse de utilização</h3>
            <p class="text-gray-700 mb-6">Avalie as seguintes afirmações:</p>
            
            <div class="space-y-6">
                <div>
                    <p class="mb-3">"Tenho interesse em usar este benefício."</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="willingness_interest" onchange="surveyData.willingnessInterest = parseInt(this.value); updateLikertLabel('willingness_interest', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="willingness_interest_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">"É provável que eu utilize este benefício sempre que tiver oportunidade."</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="willingness_likely" onchange="surveyData.willingnessLikelyUse = parseInt(this.value); updateLikertLabel('willingness_likely', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="willingness_likely_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
                
                <div>
                    <p class="mb-3">"Pretendo utilizar este benefício no futuro."</p>
                    <p class="text-sm text-gray-600 mb-3">Discordo totalmente <span class="text-gray-500">(1)</span> ○ ○ ○ ○ ○ ○ ○ <span class="text-gray-500">(7)</span> Concordo totalmente</p>
                    <input type="range" min="1" max="7" value="4" class="slider w-full" id="willingness_future" onchange="surveyData.willingnessIntendFuture = parseInt(this.value); updateLikertLabel('willingness_future', this.value)">
                    <div class="flex justify-between text-sm text-gray-600 mt-1">
                        <span>1</span>
                        <span id="willingness_future_label" class="font-medium">4</span>
                        <span>7</span>
                    </div>
                </div>
            </div>
            
            <button onclick="renderScreen('concerns')" class="btn-primary mt-8 w-full">
                Continuar
            </button>
        </div>
    `;
}

function renderConcernsScreen() {
    return `
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-center mb-6">Perceber se os consumidores possuem ainda algum receio</h2>
            <p class="text-gray-700 mb-6">Após as informações apresentadas sobre o produto, há alguma dúvida ou receio que ainda tenha em mente? (pergunta aberta com obrigatoriedade de resposta)</p>
            
            <div>
                <textarea id="concerns" rows="6" class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="Escreva aqui as suas dúvidas ou receios..." required onchange="surveyData.concernsText = this.value"></textarea>
            </div>
            
            <button onclick="validateConcernsAndSubmit()" class="btn-primary mt-8 w-full">
                Submeter
            </button>
        </div>
    `;
}

function renderThankYouScreen() {
    return `
        <div class="text-center space-y-6">
            <h1 class="text-4xl font-bold mb-4">Obrigado(a) pela sua Participação!</h1>
            <p class="text-lg text-gray-700 mb-4">O seu estudo está completo e as suas respostas foram guardadas com sucesso.</p>
            <p class="text-lg text-gray-700 mb-8">Agradecemos o seu tempo e contribuição!</p>
            
            <div class="bg-gray-50 p-6 rounded-lg mt-8">
                <p class="text-sm text-gray-600 mb-2">O seu ID de Utilizador para verificação é:</p>
                <p class="text-xl font-mono font-bold text-blue-600">${userId}</p>
            </div>
        </div>
    `;
}

// --- HELPER FUNCTIONS ---

function updateLikertLabel(id, value, max = 7) {
    const label = document.getElementById(id + '_label');
    if (label) {
        label.textContent = value;
    }
}

function validateAndContinue(currentScreen, nextScreen) {
    // Basic validation - can be enhanced
    let isValid = true;
    
    if (currentScreen === 'demographics') {
        if (!surveyData.age || !surveyData.gender || !surveyData.monthlyIncome || !surveyData.shoppingPreference) {
            alert('Por favor, preencha todas as questões obrigatórias.');
            isValid = false;
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
    }
}

function validateConcernsAndSubmit() {
    const concernsText = document.getElementById('concerns').value.trim();
    if (!concernsText || concernsText.length < 5) {
        alert('Por favor, escreva pelo menos algumas palavras sobre as suas dúvidas ou receios.');
        return;
    }
    
    surveyData.concernsText = concernsText;
    saveResults();
}

// --- SAVE RESULTS ---

async function saveResults() {
    try {
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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Results saved successfully');
        renderScreen('thank_you');
    } catch (error) {
        console.error('Error saving results:', error);
        // Still show thank you screen even if save fails
        renderScreen('thank_you');
    }
}

// Make functions globally accessible
window.renderScreen = renderScreen;
window.validateAndContinue = validateAndContinue;
window.validateConcernsAndSubmit = validateConcernsAndSubmit;
window.updateLikertLabel = updateLikertLabel;
window.assignFramingCondition = assignFramingCondition;
window.surveyData = surveyData;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeSupabase();
    renderScreen('welcome');
});
