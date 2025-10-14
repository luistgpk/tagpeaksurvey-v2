// --- VARIÁVEIS DE CONFIGURAÇÃO (Supabase) ---
// Environment variables are injected by Vercel at build time
const supabaseUrl = 'VERCEL_SUPABASE_URL_PLACEHOLDER';
const supabaseAnonKey = 'VERCEL_SUPABASE_ANON_KEY_PLACEHOLDER';

// --- ESTADO DA APLICAÇÃO ---
let userId = 'initializing...'; // Inicialização
let isApiReady = false;
let selectedLanguage = 'pt'; // Default to Portuguese
// Email collection removed - contact info provided instead

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
        contactInfo: "Para questões ou feedback:",
        contactEmail: "luis@tagpeak.com",
        next: "Avançar",
        
        // Attention Screen
        attentionTitle: "Aviso Importante",
        attentionText1: "A seguir, será apresentado uma notícia sobre um novo modelo de benefício.",
        attentionText2: "É fundamental que compreenda a sua descrição para a realização do estudo.",
        understood: "Compreendi, Avançar para a Explicação",
        
        // Explanation Screen
        explanationTitle: "NOVO MODELO DE CASHBACK CHEGA AO MERCADO",
        explanationText1: "O novo benefício tem como missão oferecer aos consumidores um <strong>cashback elevado</strong>, que pode chegar a até <strong>100% do valor da compra inicial</strong>, sem custo adicional.",
        explanationText2: "A cada compra realizada, a marca financia um investimento em <strong>empresas cotadas em bolsa</strong>, escolhidas por <strong>especialistas em mercados financeiros</strong>. Os resultados desses investimentos determinam o valor do cashback, que nunca será inferior a <strong>0,5%</strong>.",
        explanationText3: "Os utilizadores podem acompanhar todo o processo <strong>em tempo real</strong> durante os <strong>6 meses</strong> em que o investimento está ativo e realizar o resgate <strong>a qualquer momento desde o primeiro dia</strong>.",
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
        imagineBuying: "Imagina que vais comprar {product}.",
        whichOptionPrefer: "Qual das seguintes opções preferes?",
        optionA: "Opção A",
        optionB: "Opção B",
        cashbackInvestido: "Cashback Investido",
        descontoImediato: "Desconto Imediato",
        
        // Demographics
        demographicsTitle: "Informação Sociodemográfica",
        demographicsSubtitle: "Por favor, preencha as seguintes questões. Os seus dados serão mantidos confidenciais e utilizados apenas para fins de análise estatística.",
        
        // Thank You
        thankYouTitle: "Obrigado(a) pela sua Participação!",
        thankYouText1: "O seu estudo está completo e as suas respostas foram guardadas com sucesso.",
        thankYouText2: "Agradecemos o seu tempo e contribuição.",
        userIdLabel: "O seu ID de Utilizador para verificação é:",
        feedbackTitle: "Feedback (Opcional):",
        feedbackLabel: "Tem algum comentário ou sugestão sobre este estudo?",
        feedbackPlaceholder: "Partilhe os seus pensamentos...",
        feedbackOptional: "Opcional - os seus comentários são muito valiosos para nós",
        
        // Common
        age: "Idade",
        gender: "Género",
        education: "Nível de Escolaridade (Consoante Portugal)",
        selectOption: "Selecione...",
        submit: "Concluir e Submeter Dados",
        
        // Quiz Questions
        quizQ1: "Qual é o valor mínimo de cashback que tem garantido em qualquer compra neste novo modelo?",
        quizQ1A1: "100%",
        quizQ1A2: "0,5%",
        quizQ1A3: "5%",
        quizQ2: "Qual é o valor máximo que cashback pode atingir?",
        quizQ2A1: "O dobro do valor da compra.",
        quizQ2A2: "100% do valor da compra.",
        quizQ2A3: "50% do valor da compra.",
        quizQ3: "Por quanto tempo o valor do cashback fica investido e qual a flexibilidade de levantamento?",
        quizQ3A1: "Fica investido por 6 meses e não pode ser levantado antes.",
        quizQ3A2: "Fica investido por 12 meses, mas pode levantar a qualquer momento.",
        quizQ3A3: "Fica investido por 6 meses e pode ser levantado a qualquer momento (mesmo após os 6 meses)",
        
        // Quiz Feedback
        quizCorrect: "✅ Correto!",
        quizIncorrect: "❌ Incorreto. Tente novamente.",
        quizQ1Correct: "Exato! O cashback tem uma garantia mínima de 0,5% do valor da compra, independentemente do desempenho dos investimentos.",
        quizQ1Incorrect: "Não é correto. O texto menciona que o cashback nunca será inferior a 0,5%, garantindo um retorno mínimo mesmo se os investimentos não correrem bem.",
        quizQ2Correct: "Perfeito! O cashback pode chegar até 100% do valor da compra inicial, dependendo do sucesso dos investimentos em empresas de alto potencial.",
        quizQ2Incorrect: "Incorreto. O texto indica que o cashback pode chegar a 100% do valor da compra através dos investimentos em empresas listadas nos mercados de ações.",
        quizQ3Correct: "Correto! O cashback fica investido por 6 meses em empresas de alto potencial e pode ser resgatado a qualquer momento desde o primeiro dia.",
        quizQ3Incorrect: "Não é a resposta correta. O texto menciona que pode ser resgatado a qualquer momento desde o primeiro dia, durante os 6 meses de investimento.",
        
        // Demographics Questions
        demoQ1: "Costuma fazer pesquisa de preços extensiva antes de realizar uma compra?",
        demoQ2: "Prefere fazer compras presencialmente ou online?",
        demoQ3: "Sobre a sua experiência com benefícios:",
        demoQ3_1: "Alguma vez já utilizou cashback tradicional?",
        demoQ3_2: "Como classifica a sua experiência?",
        demoQ3_2_justification: "Justifique brevemente o porquê de classificar sua experiencia desta forma?",
        demoQ4: "Idade",
        demoQ5: "Género",
        demoQ6: "Nível de Escolaridade",
        demoQ7: "Tem o hábito de investir em mercados financeiros ou considera-se familiarizado(a) com este tópico?",
        demoQ8: "Qual o benefício que mais atrai na hora de fazer uma compra?",
        demoQ9: "Costuma fumar habitualmente?",
        demoQ10: "Costuma fazer apostas (ex: lotaria, jogos de casino, apostas desportivas)?",
        demoQ11: "Qual é o seu rendimento mensal líquido? Por favor, selecione a faixa que melhor representa o seu rendimento médio mensal.",
        
        // Options
        yes: "Sim",
        no: "Não",
        online: "Online",
        presencial: "Presencial",
        feminino: "Feminino",
        masculino: "Masculino",
        outro: "Outro",
        preferNotSay: "Prefiro não dizer",
        ensinoBasico: "Ensino Básico (até 9.º ano)",
        ensinoSecundario: "Ensino Secundário (12.º ano / Profissional)",
        licenciatura: "Licenciatura",
        mestrado: "Mestrado / Pós-graduação",
        doutoramento: "Doutoramento",
        desconto: "Desconto",
        cashback: "Cashback",
        nenhumDosDois: "Nenhum dos dois",
        menos1000: "Menos de €1.000",
        entre1000_1499: "Entre €1.000 e €1.499",
        entre1500_2499: "Entre €1.500 e €2.499",
        entre2500_3499: "Entre €2.500 e €3.499",
        mais3500: "€3.500 ou mais",
        preferNotRespond: "Prefiro não responder",
        
        // Likert Scale
        muitoNegativa: "1 - Muito Negativa",
        muitoPositiva: "5 - Muito Positiva",
        
        // Product names
        tshirt: "uma T-shirt",
        mesa: "uma Mesa", 
        computador: "um Computador",
        
        // Justification placeholder
        justificationPlaceholder: "Descreva brevemente o motivo da sua avaliação.",
        
        // Justification label
        justificationOptional: "Justificação (opcional):",
        
        // Error messages
        fillRequiredQuestions: "Por favor, preencha as questões obrigatórias sobre a sua experiência antes de submeter.",
        justificationMinLength: "A justificação deve ter pelo menos 5 caracteres.",
        
        // Product description
        withCost: "com o custo de",
        
        // Cashback guarantee
        cashbackGuarantee: "garantia de 0,5%",
        cashbackGuaranteeAmount: "do valor da compra e com",
        cashbackFlexibility: "resgate a qualquer momento",
        
        // Discount option
        immediateDiscount: "Desconto imediato de",
        
        // Time period
        during6Months: "durante os 6 meses",
        
        // Cashback text
        ofCashback: "de cashback",
        
        // Up to
        upTo: "Até",
        
        // With
        with: "com a",
        
        // Language selection
        studyInPortuguese: "Estudo em português",
        studyInEnglish: "Study in English",
        studyInSpanish: "Estudio en español",
        
        // Welcome screen
        toStartResearch: "para iniciar a pesquisa",
        
        // Error messages
        errorScreenNotFound: "Erro: Ecrã não encontrado.",
        
        // Testimonial names and locations
        testimonial1Name: "João, 32 anos",
        testimonial1Location: "Lisboa",
        testimonial2Name: "Raquel, 28 anos", 
        testimonial2Location: "Porto",
        testimonial3Name: "Miguel, 34 anos",
        testimonial3Location: "Madrid",
        
        // Language names
        portuguese: "Português",
        english: "English",
        spanish: "Español"
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
        contactInfo: "For questions or feedback:",
        contactEmail: "luis@tagpeak.com",
        next: "Next",
        
        // Attention Screen
        attentionTitle: "Important Notice",
        attentionText1: "Next, you will be presented with news about a new benefit model.",
        attentionText2: "It is essential that you understand its description for the study.",
        understood: "I understand, proceed to explanation",
        
        // Explanation Screen
        explanationTitle: "NEW CASHBACK MODEL ARRIVES IN THE MARKET",
        explanationText1: "The new benefit aims to offer consumers <strong>high cashback</strong>, which can reach <strong>100% of the initial purchase value</strong>, without additional costs or risks.",
        explanationText2: "With each purchase made, the brand finances an investment in <strong>high-potential companies listed on stock markets</strong>, chosen by <strong>investment specialists</strong>. The results of these investments determine cashback growth, which will never be less than <strong>0.5%</strong>.",
        explanationText3: "Users can follow the entire process <strong>in real time</strong> during the <strong>6 months</strong> that the investment is active and withdraw <strong>at any time from day 1</strong>.",
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
        imagineBuying: "Imagine you are buying {product}.",
        whichOptionPrefer: "Which of the following options do you prefer?",
        optionA: "Option A",
        optionB: "Option B",
        cashbackInvestido: "Invested Cashback",
        descontoImediato: "Immediate Discount",
        
        // Demographics
        demographicsTitle: "Sociodemographic Information",
        demographicsSubtitle: "Please fill out the following questions. Your data will be kept confidential and used only for statistical analysis purposes.",
        
        // Thank You
        thankYouTitle: "Thank you for your participation!",
        thankYouText1: "Your study is complete and your responses have been saved successfully.",
        thankYouText2: "We appreciate your time and contribution.",
        userIdLabel: "Your User ID for verification is:",
        feedbackTitle: "Feedback (Optional):",
        feedbackLabel: "Do you have any comments or suggestions about this study?",
        feedbackPlaceholder: "Share your thoughts...",
        feedbackOptional: "Optional - your comments are very valuable to us",
        
        // Common
        age: "Age",
        gender: "Gender",
        education: "Education Level",
        selectOption: "Select...",
        submit: "Complete and Submit Data",
        
        // Quiz Questions
        quizQ1: "What is the minimum cashback value guaranteed in any purchase in this new model?",
        quizQ1A1: "100%",
        quizQ1A2: "0.5%",
        quizQ1A3: "5%",
        quizQ2: "What is the maximum value that cashback can reach?",
        quizQ2A1: "Double the purchase value.",
        quizQ2A2: "100% of the purchase value.",
        quizQ2A3: "50% of the purchase value.",
        quizQ3: "For how long is the cashback value invested and what is the withdrawal flexibility?",
        quizQ3A1: "It stays invested for 6 months and cannot be withdrawn before.",
        quizQ3A2: "It stays invested for 12 months, but can be withdrawn at any time.",
        quizQ3A3: "It stays invested for 6 months and can be withdrawn at any time (even after 6 months)",
        
        // Quiz Feedback
        quizCorrect: "✅ Correct!",
        quizIncorrect: "❌ Incorrect. Please try again.",
        quizQ1Correct: "Exactly! The cashback has a minimum guarantee of 0.5% of the purchase value, regardless of investment performance.",
        quizQ1Incorrect: "Not correct. The text mentions that cashback will never be less than 0.5%, ensuring a minimum return even if the investments don't perform well.",
        quizQ2Correct: "Perfect! The cashback can reach up to 100% of the initial purchase value, depending on the success of investments in high-potential companies.",
        quizQ2Incorrect: "Incorrect. The text indicates that cashback can reach 100% of the purchase value through investments in companies listed on stock markets.",
        quizQ3Correct: "Correct! The cashback stays invested for 6 months in high-potential companies and can be withdrawn at any time from day 1.",
        quizQ3Incorrect: "Not the correct answer. The text mentions it can be withdrawn at any time from day 1, during the 6 months of investment.",
        
        // Demographics Questions
        demoQ1: "Do you usually do extensive price research before making a purchase?",
        demoQ2: "Do you prefer to shop in person or online?",
        demoQ3: "About your experience with benefits:",
        demoQ3_1: "Have you ever used traditional cashback?",
        demoQ3_2: "How do you rate your experience?",
        demoQ3_2_justification: "Briefly justify why you rate your experience this way?",
        demoQ4: "Age",
        demoQ5: "Gender",
        demoQ6: "Education Level",
        demoQ7: "Do you have the habit of investing in financial markets or consider yourself familiar with this topic?",
        demoQ8: "What benefit attracts you most when making a purchase?",
        demoQ9: "Do you smoke regularly?",
        demoQ10: "Do you usually place bets (e.g., lottery, casino games, sports betting)?",
        demoQ11: "What is your net monthly income? Please select the range that best represents your average monthly income.",
        
        // Options
        yes: "Yes",
        no: "No",
        online: "Online",
        presencial: "In Person",
        feminino: "Female",
        masculino: "Male",
        outro: "Other",
        preferNotSay: "Prefer not to say",
        ensinoBasico: "Basic Education (up to 9th grade)",
        ensinoSecundario: "Secondary Education (12th grade / Professional)",
        licenciatura: "Bachelor's Degree",
        mestrado: "Master's / Postgraduate",
        doutoramento: "Doctorate",
        desconto: "Discount",
        cashback: "Cashback",
        nenhumDosDois: "Neither",
        menos1000: "Less than €1,000",
        entre1000_1499: "Between €1,000 and €1,499",
        entre1500_2499: "Between €1,500 and €2,499",
        entre2500_3499: "Between €2,500 and €3,499",
        mais3500: "€3,500 or more",
        preferNotRespond: "Prefer not to respond",
        
        // Likert Scale
        muitoNegativa: "1 - Very Negative",
        muitoPositiva: "5 - Very Positive",
        
        // Product names
        tshirt: "a T-shirt",
        mesa: "a Table", 
        computador: "a Computer",
        
        // Justification placeholder
        justificationPlaceholder: "Briefly describe the reason for your evaluation.",
        
        // Justification label
        justificationOptional: "Justification (optional):",
        
        // Error messages
        fillRequiredQuestions: "Please fill out the required questions about your experience before submitting.",
        justificationMinLength: "The justification must be at least 5 characters long.",
        
        // Product description
        withCost: "with a cost of",
        
        // Cashback guarantee
        cashbackGuarantee: "guarantee of 0.5%",
        cashbackGuaranteeAmount: "of the purchase value and with",
        cashbackFlexibility: "withdrawal at any time",
        
        // Discount option
        immediateDiscount: "Immediate discount of",
        
        // Time period
        during6Months: "during the 6 months",
        
        // Cashback text
        ofCashback: "cashback",
        
        // Up to
        upTo: "Up to",
        
        // With
        with: "with a",
        
        // Language selection
        studyInPortuguese: "Study in Portuguese",
        studyInEnglish: "Study in English",
        studyInSpanish: "Study in Spanish",
        
        // Welcome screen
        toStartResearch: "to start the research",
        
        // Error messages
        errorScreenNotFound: "Error: Screen not found.",
        
        // Testimonial names and locations
        testimonial1Name: "João, 32 years old",
        testimonial1Location: "Lisbon",
        testimonial2Name: "Raquel, 28 years old",
        testimonial2Location: "Porto", 
        testimonial3Name: "Miguel, 34 years old",
        testimonial3Location: "Madrid",
        
        // Language names
        portuguese: "Portuguese",
        english: "English",
        spanish: "Spanish"
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
        contactInfo: "Para preguntas o comentarios:",
        contactEmail: "luis@tagpeak.com",
        next: "Siguiente",
        
        // Attention Screen
        attentionTitle: "Aviso Importante",
        attentionText1: "A continuación, se te presentará una noticia sobre un nuevo modelo de beneficio.",
        attentionText2: "Es fundamental que comprendas su descripción para la realización del estudio.",
        understood: "Entendido, proceder a la explicación",
        
        // Explanation Screen
        explanationTitle: "NUEVO MODELO DE CASHBACK LLEGA AL MERCADO",
        explanationText1: "El nuevo beneficio tiene como misión ofrecer a los consumidores un <strong>cashback elevado</strong>, que puede llegar al <strong>100% del valor de la compra inicial</strong>, sin costos o riesgos adicionales.",
        explanationText2: "Con cada compra realizada, la marca financia una inversión en <strong>empresas de alto potencial listadas en los mercados de valores</strong>, elegidas por <strong>especialistas en inversiones</strong>. Los resultados de estas inversiones determinan el crecimiento del cashback, que nunca será inferior al <strong>0,5%</strong>.",
        explanationText3: "Los usuarios pueden seguir todo el proceso <strong>en tiempo real</strong> durante los <strong>6 meses</strong> en que la inversión está activa y realizar el rescate <strong>en cualquier momento desde el primer día</strong>.",
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
        imagineBuying: "Imagina que estás comprando {product}.",
        whichOptionPrefer: "¿Cuál de las siguientes opciones prefieres?",
        optionA: "Opción A",
        optionB: "Opción B",
        cashbackInvestido: "Cashback Invertido",
        descontoImediato: "Descuento Inmediato",
        
        // Demographics
        demographicsTitle: "Información Sociodemográfica",
        demographicsSubtitle: "Por favor, completa las siguientes preguntas. Tus datos serán mantenidos confidenciales y utilizados únicamente para fines de análisis estadístico.",
        
        // Thank You
        thankYouTitle: "¡Gracias por tu participación!",
        thankYouText1: "Tu estudio está completo y tus respuestas han sido guardadas exitosamente.",
        thankYouText2: "Agradecemos tu tiempo y contribución.",
        userIdLabel: "Tu ID de Usuario para verificación es:",
        feedbackTitle: "Feedback (Opcional):",
        feedbackLabel: "¿Tienes algún comentario o sugerencia sobre este estudio?",
        feedbackPlaceholder: "Comparte tus pensamientos...",
        feedbackOptional: "Opcional - tus comentarios son muy valiosos para nosotros",
        
        // Common
        age: "Edad",
        gender: "Género",
        education: "Nivel de Escolaridad",
        selectOption: "Seleccionar...",
        submit: "Completar y Enviar Datos",
        
        // Quiz Questions
        quizQ1: "¿Cuál es el valor mínimo de cashback garantizado en cualquier compra en este nuevo modelo?",
        quizQ1A1: "100%",
        quizQ1A2: "0,5%",
        quizQ1A3: "5%",
        quizQ2: "¿Cuál es el valor máximo que el cashback puede alcanzar?",
        quizQ2A1: "El doble del valor de la compra.",
        quizQ2A2: "100% del valor de la compra.",
        quizQ2A3: "50% del valor de la compra.",
        quizQ3: "¿Por cuánto tiempo se mantiene invertido el valor del cashback y cuál es la flexibilidad de retiro?",
        quizQ3A1: "Se mantiene invertido por 6 meses y no se puede retirar antes.",
        quizQ3A2: "Se mantiene invertido por 12 meses, pero se puede retirar en cualquier momento.",
        quizQ3A3: "Se mantiene invertido por 6 meses y se puede retirar en cualquier momento (incluso después de los 6 meses)",
        
        // Quiz Feedback
        quizCorrect: "✅ ¡Correcto!",
        quizIncorrect: "❌ Incorrecto. Inténtalo de nuevo.",
        quizQ1Correct: "¡Exacto! El cashback tiene una garantía mínima del 0,5% del valor de la compra, independientemente del rendimiento de las inversiones.",
        quizQ1Incorrect: "No es correcto. El texto menciona que el cashback nunca será inferior al 0,5%, garantizando un retorno mínimo incluso si las inversiones no rinden bien.",
        quizQ2Correct: "¡Perfecto! El cashback puede llegar hasta el 100% del valor de la compra inicial, dependiendo del éxito de las inversiones en empresas de alto potencial.",
        quizQ2Incorrect: "Incorrecto. El texto indica que el cashback puede llegar al 100% del valor de la compra a través de inversiones en empresas listadas en los mercados de valores.",
        quizQ3Correct: "¡Correcto! El cashback se mantiene invertido por 6 meses en empresas de alto potencial y se puede retirar en cualquier momento desde el primer día.",
        quizQ3Incorrect: "No es la respuesta correcta. El texto menciona que se puede retirar en cualquier momento desde el primer día, durante los 6 meses de inversión.",
        
        // Demographics Questions
        demoQ1: "¿Sueles hacer investigación extensiva de precios antes de realizar una compra?",
        demoQ2: "¿Prefieres hacer compras presencialmente u online?",
        demoQ3: "Sobre tu experiencia con beneficios:",
        demoQ3_1: "¿Alguna vez has utilizado cashback tradicional?",
        demoQ3_2: "¿Cómo calificas tu experiencia?",
        demoQ3_2_justification: "Justifica brevemente por qué calificas tu experiencia de esta manera?",
        demoQ4: "Edad",
        demoQ5: "Género",
        demoQ6: "Nivel de Escolaridad",
        demoQ7: "¿Tienes el hábito de invertir en mercados financieros o te consideras familiarizado(a) con este tema?",
        demoQ8: "¿Qué beneficio te atrae más a la hora de hacer una compra?",
        demoQ9: "¿Sueles fumar habitualmente?",
        demoQ10: "¿Sueles hacer apuestas (ej: lotería, juegos de casino, apuestas deportivas)?",
        demoQ11: "¿Cuál es tu ingreso mensual neto? Por favor, selecciona el rango que mejor represente tu ingreso mensual promedio.",
        
        // Options
        yes: "Sí",
        no: "No",
        online: "Online",
        presencial: "Presencial",
        feminino: "Femenino",
        masculino: "Masculino",
        outro: "Otro",
        preferNotSay: "Prefiero no decir",
        ensinoBasico: "Educación Básica (hasta 9º grado)",
        ensinoSecundario: "Educación Secundaria (12º grado / Profesional)",
        licenciatura: "Licenciatura",
        mestrado: "Maestría / Posgrado",
        doutoramento: "Doctorado",
        desconto: "Descuento",
        cashback: "Cashback",
        nenhumDosDois: "Ninguno de los dos",
        menos1000: "Menos de €1.000",
        entre1000_1499: "Entre €1.000 y €1.499",
        entre1500_2499: "Entre €1.500 y €2.499",
        entre2500_3499: "Entre €2.500 y €3.499",
        mais3500: "€3.500 o más",
        preferNotRespond: "Prefiero no responder",
        
        // Likert Scale
        muitoNegativa: "1 - Muy Negativa",
        muitoPositiva: "5 - Muy Positiva",
        
        // Product names
        tshirt: "una Camiseta",
        mesa: "una Mesa", 
        computador: "una Computadora",
        
        // Justification placeholder
        justificationPlaceholder: "Describe brevemente el motivo de tu evaluación.",
        
        // Justification label
        justificationOptional: "Justificación (opcional):",
        
        // Error messages
        fillRequiredQuestions: "Por favor, completa las preguntas obligatorias sobre tu experiencia antes de enviar.",
        justificationMinLength: "La justificación debe tener al menos 5 caracteres.",
        
        // Product description
        withCost: "con un costo de",
        
        // Cashback guarantee
        cashbackGuarantee: "garantía del 0,5%",
        cashbackGuaranteeAmount: "del valor de la compra y con",
        cashbackFlexibility: "retiro en cualquier momento",
        
        // Discount option
        immediateDiscount: "Descuento inmediato de",
        
        // Time period
        during6Months: "durante los 6 meses",
        
        // Cashback text
        ofCashback: "de cashback",
        
        // Up to
        upTo: "Hasta",
        
        // With
        with: "con una",
        
        // Language selection
        studyInPortuguese: "Estudio en portugués",
        studyInEnglish: "Estudio en inglés",
        studyInSpanish: "Estudio en español",
        
        // Welcome screen
        toStartResearch: "para iniciar la investigación",
        
        // Error messages
        errorScreenNotFound: "Error: Pantalla no encontrada.",
        
        // Testimonial names and locations
        testimonial1Name: "João, 32 años",
        testimonial1Location: "Lisboa",
        testimonial2Name: "Raquel, 28 años",
        testimonial2Location: "Oporto",
        testimonial3Name: "Miguel, 34 años", 
        testimonial3Location: "Madrid",
        
        // Language names
        portuguese: "Portugués",
        english: "Inglés",
        spanish: "Español"
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
        { id: 'low', name: 'tshirt', price: 40, currency: '€' },
        { id: 'medium', name: 'mesa', price: 250, currency: '€' },
        { id: 'high', name: 'computador', price: 1000, currency: '€' }
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
            question: "quizQ1",
            options: [
                { text: "quizQ1A1", isCorrect: false },
                { text: "quizQ1A2", isCorrect: true },
                { text: "quizQ1A3", isCorrect: false }
            ]
        },
        {
            question: "quizQ2",
            options: [
                { text: "quizQ2A1", isCorrect: false },
                { text: "quizQ2A2", isCorrect: true },
                { text: "quizQ2A3", isCorrect: false }
            ]
        },
        {
            question: "quizQ3",
            options: [
                { text: "quizQ3A1", isCorrect: false },
                { text: "quizQ3A2", isCorrect: false },
                { text: "quizQ3A3", isCorrect: true }
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
                name: t(s.name).replace('uma ', '').replace('um ', '').replace('uns ', '').replace('a ', '').replace('an ', ''),
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
            },
            // QUIZ RESULTS FOR CONCEPT UNDERSTANDING
            conceptQuiz: state.quizResults || null,
            // NEW FIELDS
            userFeedback: state.userFeedback || null
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
                // Trigger discount animation if needed
                setTimeout(() => {
                    if (state.previousDiscount !== undefined && state.newDiscount !== undefined) {
                        animateDiscountTransition();
                    }
                }, 100);
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
                contentArea.innerHTML = `<p class="text-center text-red-500">${t('errorScreenNotFound')}</p>`;
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
    
    const previousDiscount = staircase.currentDiscount;
    
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
    
    // Store the previous discount for animation on next screen
    if (previousDiscount !== staircase.currentDiscount) {
        state.previousDiscount = previousDiscount;
        state.newDiscount = staircase.currentDiscount;
    }
    
    // Transição de 500ms (ver a seleção) + (fade out/in)
    setTimeout(() => runNextStaircase(), 500);
}


function selectQuizAnswer(qIndex, optIndex) {
    state.quizAnswers[qIndex] = optIndex;
    
    const optionsContainer = document.getElementById(`question-${qIndex}`);
    const optionCards = optionsContainer.querySelectorAll('.quiz-option');
    
    // Remove existing feedback if any
    const existingFeedback = optionsContainer.querySelector('.quiz-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    optionCards.forEach((card, index) => {
        // Remove all previous styling
        card.classList.remove('selected', 'accent-blue-border', 'correct-answer', 'incorrect-answer');
        
        // Adiciona ou remove a classe 'selected'
        if (index === optIndex) {
            card.classList.add('selected');
            // Garante que a borda de seleção seja azul (indigo) no quiz
            card.classList.add('accent-blue-border'); 
        }
    });
    
    // Check if answer is correct and provide immediate feedback
    const question = config.verificationQuestions[qIndex];
    const isCorrect = question.options[optIndex]?.isCorrect;
    
    // Add visual feedback to the selected option
    const selectedCard = optionCards[optIndex];
    if (isCorrect) {
        selectedCard.classList.add('correct-answer');
    } else {
        selectedCard.classList.add('incorrect-answer');
    }
    
    // Create feedback element
    const feedbackElement = document.createElement('div');
    feedbackElement.className = 'quiz-feedback mt-3 p-3 rounded-lg';
    
    if (isCorrect) {
        feedbackElement.className += ' bg-green-100 border border-green-300 text-green-800';
        feedbackElement.innerHTML = `
            <div class="font-semibold">${t('quizCorrect')}</div>
            <div class="text-sm mt-1">${t(`quizQ${qIndex + 1}Correct`)}</div>
        `;
    } else {
        feedbackElement.className += ' bg-red-100 border border-red-300 text-red-800';
        feedbackElement.innerHTML = `
            <div class="font-semibold">${t('quizIncorrect')}</div>
            <div class="text-sm mt-1">${t(`quizQ${qIndex + 1}Incorrect`)}</div>
        `;
    }
    
    optionsContainer.appendChild(feedbackElement);
    
    updateQuizSubmitButton();
}
window.selectQuizAnswer = selectQuizAnswer; // Torna a função global

// Function to animate discount transition from old to new value
function animateDiscountTransition() {
    const percentageElement = document.getElementById('discount-percentage');
    const amountElement = document.getElementById('discount-amount');
    
    if (percentageElement && amountElement) {
        // Add rotating class to trigger animation
        percentageElement.classList.add('rotating');
        amountElement.classList.add('rotating');
        
        // Update the values during the animation
        setTimeout(() => {
            const newPercentage = percentageElement.dataset.newValue;
            const newAmount = amountElement.dataset.newAmount;
            
            if (newPercentage && newAmount) {
                percentageElement.textContent = newPercentage;
                amountElement.textContent = newAmount;
            }
        }, 600); // Update values at the midpoint of rotation
        
        // Remove the class after animation completes
        setTimeout(() => {
            percentageElement.classList.remove('rotating');
            amountElement.classList.remove('rotating');
            
            // Clear the stored values
            state.previousDiscount = undefined;
            state.newDiscount = undefined;
        }, 1200);
    }
}

// Function to show discount change with rotating number animation (legacy)
function showDiscountChangeIndicator() {
    // This function is now handled by animateDiscountTransition
    // but kept for compatibility
}

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
        // Save quiz answers to state for database storage
        state.quizResults = {
            answers: state.quizAnswers.map((selectedOptIndex, qIndex) => ({
                questionIndex: qIndex,
                selectedOption: selectedOptIndex,
                isCorrect: config.verificationQuestions[qIndex].options[selectedOptIndex]?.isCorrect
            })),
            allCorrect: true,
            completedAt: new Date().toISOString()
        };
        
        quizMessage.className = 'text-center text-green-600 font-medium mb-4';
        quizMessage.innerHTML = `<strong>${t('congratulations')}</strong> ${t('quizSuccess')}`;
        document.getElementById('submit-quiz-btn').disabled = true;
        
        // Vai para a nova página de instruções antes de iniciar o estudo
        setTimeout(() => renderScreen('instruction_reminder'), 500); 
    } else {
        quizMessage.className = 'text-center text-red-600 font-medium mb-4';
        quizMessage.innerHTML = t('incorrectAnswers', {count: incorrectCount});
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
        
        // Utiliza a média dos últimos 3 pontos de reversão
        const relevantReversals = staircase.reversalPoints.slice(-3); 
        let indifferencePoint = 0;

        if (relevantReversals.length > 0) {
           const sum = relevantReversals.reduce((acc, val) => acc + val, 0);
           indifferencePoint = sum / relevantReversals.length;
        } else {
            // Caso não haja reversões suficientes (pode ocorrer se o participante parar cedo)
            indifferencePoint = staircase.currentDiscount; 
        }
        
        state.indifferencePoints[staircase.id] = {
            name: t(staircase.name).replace('uma ', '').replace('um ', '').replace('uns ', '').replace('a ', '').replace('an ', ''),
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
        alert(t('fillRequiredQuestions'));
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
            justificationLabel.innerHTML = `3.2. ${t('demoQ3_2_justification')}`;
            
            if (!isJustificationValid) {
                justificationTextarea.classList.add('border-red-500');
                justificationTextarea.classList.remove('border-gray-300');
                if (errorMessageElement) {
                    errorMessageElement.textContent = t('justificationMinLength');
                }
            } else {
                justificationTextarea.classList.remove('border-red-500');
                justificationTextarea.classList.add('border-gray-300');
                 if (errorMessageElement) {
                    errorMessageElement.textContent = ''; 
                }
            }
        } else {
            justificationLabel.innerHTML = `3.2. ${t('justificationOptional')}`;
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
        alert(t('fillRequiredQuestions'));
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
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${t('portuguese')}</h3>
                    <p class="text-gray-600">${t('studyInPortuguese')}</p>
                </div>
                
                <!-- English -->
                <div class="language-option option-card text-center" onclick="selectLanguage('en')">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <span class="text-white font-bold text-2xl">🇬🇧</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${t('english')}</h3>
                    <p class="text-gray-600">${t('studyInEnglish')}</p>
                </div>
                
                <!-- Spanish -->
                <div class="language-option option-card text-center" onclick="selectLanguage('es')">
                    <div class="mb-4">
                        <div class="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <span class="text-white font-bold text-2xl">🇪🇸</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${t('spanish')}</h3>
                    <p class="text-gray-600">${t('studyInSpanish')}</p>
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

window.handleWelcomeSubmit = () => {
    renderScreen('demographics');
};

window.handleFeedbackSubmit = () => {
    const feedbackInput = document.getElementById('user-feedback');
    let feedback = null;
    if (feedbackInput) {
        feedback = feedbackInput.value.trim() || null;
    }
    
    // Save feedback to state for database storage
    state.userFeedback = feedback;
    
    // Show completion message
    const feedbackSection = document.querySelector('#thank-you-screen .bg-gray-50');
    if (feedbackSection) {
        feedbackSection.innerHTML = `
            <div class="text-center">
                <div class="text-green-600 text-lg font-semibold mb-2">✅ ${t('thankYouText1')}</div>
                <p class="text-gray-600">${feedback ? t('thankYouText2') + ' ' + t('feedbackOptional') : t('thankYouText2')}</p>
            </div>
        `;
    }
};

window.updateAgeDisplay = (value) => {
    const ageDisplay = document.getElementById('age-display');
    if (ageDisplay) {
        ageDisplay.textContent = value;
    }
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
            
            <!-- Contact Information -->
            <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-sm text-blue-800 text-center">
                    <strong>${t('contactInfo')}</strong> 
                    <a href="mailto:luis@tagpeak.com" class="text-blue-600 hover:text-blue-800 underline">${t('contactEmail')}</a>
                </p>
            </div>
            
            <p class="text-gray-600 mt-8 mb-8 text-center text-xl">👉 ${t('next')} ${t('toStartResearch')}.</p>
            <div class="text-center">
                <button onclick="handleWelcomeSubmit()" class="btn-primary">${t('next')}</button>
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
            <p class="font-semibold mb-3 text-gray-800">3.1. ${t('demoQ3_1')}</p>
            <div class="grid grid-cols-2 gap-4">
                <div data-question-id="usedTraditionalCashback" data-answer="Sim" class="option-card traditional-quiz-option text-center ${state.usedTraditionalCashback === 'Sim' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('usedTraditionalCashback', 'Sim')">
                    <span class="text-lg font-medium">${t('yes')}</span>
                </div>
                <div data-question-id="usedTraditionalCashback" data-answer="Não" class="option-card traditional-quiz-option text-center ${state.usedTraditionalCashback === 'Não' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('usedTraditionalCashback', 'Não')">
                    <span class="text-lg font-medium">${t('no')}</span>
                </div>
            </div>
        </div>
        
        <div id="question-group-2" class="p-4 border border-gray-200 rounded-lg mt-4" style="display: ${q2InitialStyle};">
            <p class="font-semibold mb-3 text-gray-800">3.2. ${t('demoQ3_2')}</p>
            
            <div class="grid grid-cols-5 gap-2 mb-2">
                ${likertGrid}
            </div>
            
            <div class="flex justify-between text-sm text-gray-600 mt-1">
                <span class="text-red-600 font-semibold">${t('muitoNegativa')}</span>
                <span class="text-green-600 font-semibold">${t('muitoPositiva')}</span>
            </div>

             <div id="justification-group" class="mt-4" style="display: none;">
                <label id="justification-label" for="rating-justification" class="block text-sm font-medium text-gray-700 mb-1">
                    ${t('demoQ3_2_justification')}
                </label>
                <textarea id="rating-justification" rows="3" 
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="${t('justificationPlaceholder')}">${state.ratingJustification}</textarea>
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
                                <strong class="text-green-600">${t('testimonial1Name')}</strong> - ${t('testimonial1Location')}
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
                                <strong class="text-blue-600">${t('testimonial2Name')}</strong> - ${t('testimonial2Location')}
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
                                <strong class="text-purple-600">${t('testimonial3Name')}</strong> - ${t('testimonial3Location')}
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
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">${t('quizTitle')}</h2>
            
            <div id="quiz-content" class="space-y-4">
                </div>

            <div id="quiz-message" class="text-center font-medium mb-4"></div>
            
            <div class="text-center mt-6">
                <button id="submit-quiz-btn" onclick="submitQuiz()" class="btn-primary" disabled>${t('verifyAnswers')}</button>
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
        qElement.innerHTML = `<p class="font-semibold mb-3 text-gray-800">Q${qIndex + 1}: ${t(q.question)}</p>`;

        q.options.forEach((opt, optIndex) => {
            const optElement = document.createElement('div');
            optElement.className = "quiz-option option-card mb-2 p-3";
            // Usa a função global `selectQuizAnswer`
            optElement.onclick = () => selectQuizAnswer(qIndex, optIndex); 
            
            optElement.innerHTML = `<label class="cursor-pointer block text-gray-700">${t(opt.text)}</label>`;
            qElement.appendChild(optElement);
        });
        quizContent.appendChild(qElement);
    });
    updateQuizSubmitButton();
}

// Ecrã de Lembrete de Instruções (Após o Quiz, Antes da Tarefa)
function renderInstructionReminderScreen() {
    return `
        <div id="instruction-reminder-screen" class="text-center p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-red-600">${t('instructionsTitle')}</h2>
            <div class="bg-yellow-100 p-6 rounded-lg border-4 border-yellow-400 max-w-lg mx-auto">
                <p class="text-xl text-gray-800 font-semibold leading-relaxed">
                    ${t('instructionsText1')}
                </p>
                <p class="text-gray-800 mt-4 text-lg">
                    ${t('instructionsText2')}
                </p>
            </div>
            
            <div class="text-center mt-8">
                <button onclick="window.initializeStudy()" class="btn-primary">${t('startTask')}</button>
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
    
    // Check if we need to show transition from old to new discount
    const shouldAnimateDiscount = state.previousDiscount !== undefined && 
                                 state.newDiscount !== undefined && 
                                 state.previousDiscount !== state.newDiscount &&
                                 !isCatchTrial;

    const basePriceFormatted = formatCurrency(staircase.price, staircase.currency);
    const productNameAndPrice = `${t(staircase.name)} ${t('withCost')} ${basePriceFormatted}`;
    
    // Calculate discount values - use previous discount initially if animating
    const initialDiscount = shouldAnimateDiscount ? state.previousDiscount : displayDiscount;
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
    const initialDiscountFormatted = formatPercent(initialDiscount);
    
    // Opção A: Cashback Investido
    const optionADescription = `
        <p><strong>${t('cashbackInvestido')}</strong></p>
        <p>${t('upTo')} <strong class="${uniformValueClass}">${formatPercent(100)}%</strong> 
        (<strong class="${uniformValueClass}">${formattedCashbackMax}</strong>) 
        ${t('ofCashback')}.</p>
        <p>${t('with')} <strong class="${uniformValueClass}">${t('cashbackGuarantee')}</strong> 
        (<strong class="${uniformValueClass}">${formattedCashbackGuaranteed}</strong>) 
        ${t('cashbackGuaranteeAmount')} <strong class="${uniformValueClass}">${t('cashbackFlexibility')}</strong> ${t('during6Months')}.</p>
    `;

    // Opção B: Desconto Imediato
    const optionBDescription = `
        <p><strong>${t('descontoImediato')}</strong></p>
        <p>${t('immediateDiscount')} 
        <strong class="${uniformValueClass} discount-value" id="discount-percentage" data-old-value="${initialDiscountFormatted}%" data-new-value="${displayDiscountFormatted}%">${initialDiscountFormatted}%</strong> 
        (<strong class="${uniformValueClass} discount-amount" id="discount-amount" data-old-amount="${formatCurrency(staircase.price * (initialDiscount / 100), staircase.currency)}" data-new-amount="${formattedDiscount}">${formatCurrency(staircase.price * (initialDiscount / 100), staircase.currency)}</strong>).</p>
    `;


    return `
        <div id="question-screen">
            <div class="text-center mb-6">
                <p class="progress-indicator inline-block" id="progress-indicator">${t('productProgress', {current: state.currentStaircaseIndex + 1, total: config.priceLevels.length})}</p>
                <h2 class="text-2xl font-bold text-gray-800 mt-2">${t('imagineBuying', {product: `<span id="product-full-name" class="${accentClass} font-extrabold">${productNameAndPrice}</span>`})}</h2>
                <p class="text-lg text-gray-600 mt-4">${t('whichOptionPrefer')}</p>
            </div>

            <div class="product-image-container">
                <img src="${productImageURL}" alt="${staircase.name}" class="product-image"/>
            </div>
            <div class="grid md:grid-cols-2 gap-8">
                <div id="cashback-option" class="option-card flex flex-col items-center text-center p-8" onclick="handleStaircaseChoice('cashback')">
                    <div class="mb-6">
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">${t('optionA')}</h3>
                        <div class="text-gray-700 space-y-3 text-left">
                            ${optionADescription}
                        </div>
                    </div>
                </div>
                <div id="discount-option" class="option-card flex flex-col items-center text-center p-8" onclick="handleStaircaseChoice('discount')">
                    <div class="mb-6">
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">${t('optionB')}</h3>
                        <div class="text-gray-700 space-y-3 text-left">
                            ${optionBDescription}
                        </div>
                    </div>
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
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">${t('demographicsTitle')}</h2>
            <p class="text-gray-600 mb-6 text-center">${t('demographicsSubtitle')}</p>
            
            <form id="demographics-form" onsubmit="handleDemographicsSubmit(event)" class="space-y-6">
                
                <div id="question-group-new-1" class="p-4 border border-gray-200 rounded-lg">
                    <label class="block text-sm font-medium text-gray-700 mb-2">1. ${t('demoQ1')}</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div data-question-id="priceResearch" data-answer="Sim" class="option-card text-center ${state.priceResearch === 'Sim' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('priceResearch', 'Sim')">
                            <span class="text-lg font-medium">${t('yes')}</span>
                        </div>
                        <div data-question-id="priceResearch" data-answer="Não" class="option-card text-center ${state.priceResearch === 'Não' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('priceResearch', 'Não')">
                            <span class="text-lg font-medium">${t('no')}</span>
                        </div>
                    </div>
                </div>

                <div id="question-group-new-2" class="p-4 border border-gray-200 rounded-lg">
                    <label class="block text-sm font-medium text-gray-700 mb-2">2. ${t('demoQ2')}</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div data-question-id="purchasePreference" data-answer="Online" class="option-card text-center ${state.purchasePreference === 'Online' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('purchasePreference', 'Online')">
                            <span class="text-lg font-medium">${t('online')}</span>
                        </div>
                        <div data-question-id="purchasePreference" data-answer="Presencial" class="option-card text-center ${state.purchasePreference === 'Presencial' ? 'selected accent-blue-border' : ''}" onclick="selectTraditionalQuizAnswer('purchasePreference', 'Presencial')">
                            <span class="text-lg font-medium">${t('presencial')}</span>
                        </div>
                    </div>
                </div>

                <div id="question-group-moved-3" class="mt-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">3. ${t('demoQ3')}</h3>
                    ${traditionalQuizContentHTML}
                </div>
                
                <hr class="my-6 border-t border-gray-200">

                <div>
                    <label for="age" class="block text-sm font-medium text-gray-700 mb-2">4. ${t('demoQ4')}</label>
                    <div class="space-y-3">
                        <div class="flex items-center space-x-4">
                            <span class="text-sm text-gray-600">15</span>
                            <input type="range" id="age" name="age" min="15" max="99" value="25" 
                                   class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                   oninput="updateAgeDisplay(this.value)">
                            <span class="text-sm text-gray-600">99</span>
                        </div>
                        <div class="text-center">
                            <span id="age-display" class="text-lg font-semibold text-indigo-600">25</span>
                            <span class="text-gray-600 ml-1">anos</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">5. ${t('demoQ5')}</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gender" value="Feminino" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('feminino')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gender" value="Masculino" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('masculino')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gender" value="Outro" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('outro')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gender" value="Prefiro nao dizer" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('preferNotSay')}</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label for="education" class="block text-sm font-medium text-gray-700 mb-1">6. ${t('demoQ6')}</label>
                    <select id="education" name="education" required class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">${t('selectOption')}</option>
                        <option value="Ensino Básico">${t('ensinoBasico')}</option>
                        <option value="Ensino Secundário">${t('ensinoSecundario')}</option>
                        <option value="Licenciatura">${t('licenciatura')}</option>
                        <option value="Mestrado/Pos-graduacao">${t('mestrado')}</option>
                        <option value="Doutoramento">${t('doutoramento')}</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">7. ${t('demoQ7')}</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="invests" value="Sim" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('yes')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="invests" value="Nao" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('no')}</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">8. ${t('demoQ8')}</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="habit" value="Desconto" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('desconto')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="habit" value="Cashback" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('cashback')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="habit" value="Nenhum dos dois" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('nenhumDosDois')}</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">9. ${t('demoQ9')}</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="smokes" value="Sim" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('yes')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="smokes" value="Nao" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('no')}</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">10. ${t('demoQ10')}</label>
                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gambles" value="Sim" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('yes')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="gambles" value="Nao" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('no')}</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">11. ${t('demoQ11')}</label>
                    <div class="flex flex-col space-y-2">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="Menos de €1.000" required class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('menos1000')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="Entre €1.000 e €1.499" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('entre1000_1499')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="Entre €1.500 e €2.499" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('entre1500_2499')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="Entre €2.500 e €3.499" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('entre2500_3499')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="€3.500 ou mais" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('mais3500')}</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="monthly_income" value="Prefiro não responder" class="text-indigo-600 focus:ring-indigo-500">
                            <span>${t('preferNotRespond')}</span>
                        </label>
                    </div>
                </div>
                
                <div class="text-center pt-4">
                    <button type="submit" id="demog-submit-btn" class="btn-primary" disabled>${t('submit')}</button>
                </div>
            </form>
        </div>
    `;
}

function renderThankYouScreen() {
    return `
        <div id="thank-you-screen" class="text-center p-8">
            <h1 class="text-4xl font-bold text-indigo-600 mb-6">${t('thankYouTitle')}</h1>
            <p class="text-gray-700 text-lg mb-4">${t('thankYouText1')}</p>
            <p class="text-gray-500 text-md mb-8">${t('thankYouText2')}</p>
            
            <!-- Feedback Collection Section -->
            <div class="max-w-2xl mx-auto mb-8">
                <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 text-left">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">${t('feedbackTitle')}</h3>
                    <div class="space-y-4">
                        <div>
                            <label for="user-feedback" class="block text-sm font-medium text-gray-700 mb-2">${t('feedbackLabel')}</label>
                            <textarea id="user-feedback" rows="4" placeholder="${t('feedbackPlaceholder')}" 
                                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                            <p class="text-sm text-gray-500 mt-1">${t('feedbackOptional')}</p>
                        </div>
                        <div class="text-center">
                            <button onclick="handleFeedbackSubmit()" class="btn-primary">${t('submit')}</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-8 p-4 bg-yellow-100 rounded-lg max-w-xl mx-auto border border-yellow-300">
                <p class="text-sm font-medium text-gray-700">${t('userIdLabel')}</p>
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
