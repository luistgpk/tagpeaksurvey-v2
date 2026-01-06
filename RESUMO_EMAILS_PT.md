# Resumo de Todas as Combinações de Emails Possíveis (Português)

## Informação Geral

- **Total de Framings**: 3 (Positivo, Negativo, Neutro)
- **Total de Marcas**: 13
- **Total de Combinações**: 39 emails únicos

---

## Marcas Disponíveis

1. Adidas
2. Booking.com
3. Sephora
4. Samsung
5. New Balance
6. Conforama
7. Sonos
8. Temu
9. Fila
10. Tous
11. Converse
12. Gocco
13. Pikolin

---

## Estrutura dos Emails por Framing

### 1. FRAMING POSITIVO

**Assunto:**
```
Ganhe mais com as suas compras [NOME_DA_MARCA]
```

**Saudação:**
```
Olá, [Nome da pessoa],
```

**Corpo do Email:**
```
[NOME_DA_MARCA] em parceria com a Tagpeak, uniu forças para multiplicar as vantagens sempre que faz compras connosco.

Agora pode ter uma percentagem do valor que paga nas suas compras automaticamente investida em ações de empresas cotadas em bolsa pela equipa especializada da Tagpeak, sem qualquer custo e risco para si.

Tudo isto para permitir que ganhe um cashback de até 100% do valor gasto nas suas compras. Aproveite estes benefícios exclusivos!

Comece a ganhar agora! É muito simples, basta escrever "tagpeak" no campo de desconto/cupão no checkout da sua próxima compra na [NOME_DA_MARCA].

Para mais informações, visite: www.tagpeak.com
```

**Características:**
- Foco em ganhos e benefícios
- Linguagem positiva e encorajadora
- Ênfase em "ganhar" e "aproveitar"

---

### 2. FRAMING NEGATIVO

**Assunto:**
```
Não deixe escapar os benefícios nas suas compras [NOME_DA_MARCA]
```

**Saudação:**
```
Olá, [Nome da pessoa],
```

**Corpo do Email:**
```
[NOME_DA_MARCA] em parceria com a Tagpeak, uniu forças para aumentar as vantagens sempre que faz compras connosco.

Agora pode ter uma percentagem do valor que paga nas suas compras automaticamente investida em ações de empresas cotadas em bolsa pela equipa especializada da Tagpeak, sem qualquer custo e risco para si, mas somente se ativar a parceria.

Tudo isto para permitir que evite perder um cashback de até 100% do valor gasto nas suas compras. Vai mesmo renunciar a esta oportunidade?

Para não perder, basta escrever "tagpeak" no campo de desconto/cupão no checkout da sua próxima compra na [NOME_DA_MARCA].

Para mais informações, visite: www.tagpeak.com
```

**Características:**
- Foco em evitar perdas
- Linguagem de urgência e perda de oportunidade
- Ênfase em "não perder" e "não deixar escapar"
- Pergunta retórica: "Vai mesmo renunciar a esta oportunidade?"

---

### 3. FRAMING NEUTRO

**Assunto:**
```
Nova parceria [NOME_DA_MARCA] e Tagpeak
```

**Saudação:**
```
Olá, [Nome da pessoa],
```

**Corpo do Email:**
```
[NOME_DA_MARCA] estabeleceu uma parceria com a Tagpeak com o objetivo de disponibilizar um benefício adicional às compras.

Este benefício permite que uma percentagem do valor pago nas compras seja automaticamente investido em ações de empresas cotadas em bolsa, geridas pela equipa especializada da Tagpeak, sem custos ou riscos para o utilizador.

Este mecanismo permite obter um cashback de até 100% do valor gasto na compra.

Para utilizar, basta inserir "tagpeak" no campo de desconto/cupão durante o checkout da sua próxima compra na [NOME_DA_MARCA].

Para mais informações, visite: www.tagpeak.com
```

**Características:**
- Linguagem objetiva e informativa
- Sem apelo emocional forte
- Foco em informações factuais
- Tom neutro e profissional

---

## Todas as 39 Combinações Possíveis

### Framing Positivo (13 emails)
1. Adidas - Positivo
2. Booking.com - Positivo
3. Sephora - Positivo
4. Samsung - Positivo
5. New Balance - Positivo
6. Conforama - Positivo
7. Sonos - Positivo
8. Temu - Positivo
9. Fila - Positivo
10. Tous - Positivo
11. Converse - Positivo
12. Gocco - Positivo
13. Pikolin - Positivo

### Framing Negativo (13 emails)
14. Adidas - Negativo
15. Booking.com - Negativo
16. Sephora - Negativo
17. Samsung - Negativo
18. New Balance - Negativo
19. Conforama - Negativo
20. Sonos - Negativo
21. Temu - Negativo
22. Fila - Negativo
23. Tous - Negativo
24. Converse - Negativo
25. Gocco - Negativo
26. Pikolin - Negativo

### Framing Neutro (13 emails)
27. Adidas - Neutro
28. Booking.com - Neutro
29. Sephora - Neutro
30. Samsung - Neutro
31. New Balance - Neutro
32. Conforama - Neutro
33. Sonos - Neutro
34. Temu - Neutro
35. Fila - Neutro
36. Tous - Neutro
37. Converse - Neutro
38. Gocco - Neutro
39. Pikolin - Neutro

---

## Diferenças Principais entre os Framings

| Aspecto | Positivo | Negativo | Neutro |
|---------|----------|----------|--------|
| **Assunto** | "Ganhe mais..." | "Não deixe escapar..." | "Nova parceria..." |
| **Tom** | Entusiasmado | Urgente/Perda | Informativo |
| **Foco** | Benefícios de usar | Perdas por não usar | Informação objetiva |
| **Call-to-action** | "Comece a ganhar agora!" | "Para não perder..." | "Para utilizar..." |
| **Pergunta retórica** | Não | Sim ("Vai mesmo renunciar?") | Não |
| **Condição** | Não menciona | "mas somente se ativar" | Não menciona |

---

## Notas Técnicas

- O nome da marca é inserido dinamicamente em 3 locais no email:
  1. No assunto (apenas no framing neutro)
  2. No início do primeiro parágrafo
  3. No final do penúltimo parágrafo (antes do checkout)

- O nome da pessoa é substituído por `[Nome da pessoa]` ou pelo primeiro nome fornecido no formulário demográfico

- Todos os emails terminam com: "Para mais informações, visite: www.tagpeak.com"

- O código do cupão é sempre: **"tagpeak"**

- O benefício máximo mencionado é sempre: **100% do valor gasto**

