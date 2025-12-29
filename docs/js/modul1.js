// ================================
// MODUL 1 JAVASCRIPT
// ================================

// Globale Variablen
let currentQuestionIndex = 1;
let questionnaireData = {};
let budgetType = null;
let currentBudget = {};
let draggedElement = null;

// ================================
// PHASE 1: Einstieg
// ================================

function startQuestionnaire() {
    showPhase(2);
}

// ================================
// PHASE 2: Fragebogen
// ================================

function nextQuestion() {
    const currentQuestion = document.querySelector(`.question[data-question="${currentQuestionIndex}"]`);
    const selected = currentQuestion.querySelector('input[type="radio"]:checked');
    
    if (!selected) {
        alert('Bitte wähle eine Antwort aus!');
        return;
    }
    
    // Antwort speichern
    questionnaireData[`q${currentQuestionIndex}`] = parseInt(selected.value);
    
    // Nächste Frage anzeigen
    currentQuestion.classList.remove('active');
    currentQuestionIndex++;
    
    if (currentQuestionIndex <= 10) {
        document.querySelector(`.question[data-question="${currentQuestionIndex}"]`).classList.add('active');
        document.getElementById('currentQuestion').textContent = currentQuestionIndex;
        document.getElementById('questionProgress').style.width = (currentQuestionIndex / 10 * 100) + '%';
        
        // Buttons anpassen
        document.getElementById('prevBtn').style.display = 'block';
        
        if (currentQuestionIndex === 10) {
            document.getElementById('nextBtn').style.display = 'none';
            document.getElementById('submitBtn').style.display = 'block';
        }
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 1) {
        document.querySelector(`.question[data-question="${currentQuestionIndex}"]`).classList.remove('active');
        currentQuestionIndex--;
        document.querySelector(`.question[data-question="${currentQuestionIndex}"]`).classList.add('active');
        document.getElementById('currentQuestion').textContent = currentQuestionIndex;
        document.getElementById('questionProgress').style.width = (currentQuestionIndex / 10 * 100) + '%';
        
        // Buttons anpassen
        if (currentQuestionIndex === 1) {
            document.getElementById('prevBtn').style.display = 'none';
        }
        
        document.getElementById('nextBtn').style.display = 'block';
        document.getElementById('submitBtn').style.display = 'none';
    }
}

function submitQuestionnaire() {
    const lastQuestion = document.querySelector(`.question[data-question="10"]`);
    const selected = lastQuestion.querySelector('input[type="radio"]:checked');
    
    if (!selected) {
        alert('Bitte wähle eine Antwort aus!');
        return;
    }
    
    questionnaireData.q10 = parseInt(selected.value);
    
    // Budget-Typ berechnen
    calculateBudgetType();
    
    // Zur nächsten Phase
    showPhase(3);
    displayBudgetResult();
}

function calculateBudgetType() {
    // Summe aller Antworten (ohne Frage 10, die ist nur für Sparziel)
    let sum = 0;
    for (let i = 1; i <= 9; i++) {
        sum += questionnaireData[`q${i}`];
    }
    
    // Budgettyp zuweisen basierend auf Summe
    // Min: 9 (alle 1), Max: 27 (alle 3)
    if (sum <= 15) {
        budgetType = 'minimalistisch';
    } else if (sum <= 21) {
        budgetType = 'ausgeglichen';
    } else {
        budgetType = 'luxuriös';
    }
    
    // Budget erstellen
    createBudget();
}

function createBudget() {
    const budgets = {
        minimalistisch: {
            name: 'Minimalistisch',
            description: 'Du lebst sparsam und achtest auf deine Ausgaben.',
            color: '#10b981',
            income: [
                { name: 'Lohn (netto)', amount: 3750, category: 'income' }
            ],
            fixed: [
                { name: 'Miete', amount: 1400, category: 'fixed', adjustable: true, min: 1200 },
                { name: 'Krankenkasse', amount: 350, category: 'fixed' },
                { name: 'Handy-Abo', amount: 25, category: 'fixed' },
                { name: 'Internet', amount: 50, category: 'fixed' },
                { name: 'Strom/Heizung (akonto)', amount: 100, category: 'fixed' }
            ],
            variable: [
                { name: 'Lebensmittel', amount: 400, category: 'variable', adjustable: true, min: 300 },
                { name: 'Ausgang', amount: 80, category: 'variable', adjustable: true, min: 0 },
                { name: 'Kleider/Schuhe', amount: 50, category: 'variable', adjustable: true, min: 20 },
                { name: 'Streaming-Dienste', amount: 15, category: 'variable', adjustable: true, min: 0 },
                { name: 'Hobbys', amount: 50, category: 'variable', adjustable: true, min: 0 },
                { name: 'Essen auswärts', amount: 60, category: 'variable', adjustable: true, min: 0 },
                { name: 'Transport (ÖV)', amount: 80, category: 'variable' },
                { name: 'Beauty/Barber', amount: 30, category: 'variable', adjustable: true, min: 0 }
            ],
            savings: [
                { name: getGoalName(questionnaireData.q10), amount: 200, category: 'savings', adjustable: true, min: 100 }
            ]
        },
        ausgeglichen: {
            name: 'Ausgeglichen',
            description: 'Du gönnst dir etwas, achtest aber auf dein Budget.',
            color: '#f59e0b',
            income: [
                { name: 'Lohn (netto)', amount: 3750, category: 'income' }
            ],
            fixed: [
                { name: 'Miete', amount: 1400, category: 'fixed', adjustable: true, min: 1200 },
                { name: 'Krankenkasse', amount: 350, category: 'fixed' },
                { name: 'Handy-Abo', amount: 45, category: 'fixed' },
                { name: 'Internet', amount: 50, category: 'fixed' },
                { name: 'Strom/Heizung (akonto)', amount: 100, category: 'fixed' }
            ],
            variable: [
                { name: 'Lebensmittel', amount: 450, category: 'variable', adjustable: true, min: 300 },
                { name: 'Ausgang', amount: 150, category: 'variable', adjustable: true, min: 0 },
                { name: 'Kleider/Schuhe', amount: 100, category: 'variable', adjustable: true, min: 20 },
                { name: 'Streaming-Dienste', amount: 30, category: 'variable', adjustable: true, min: 0 },
                { name: 'Hobbys', amount: 80, category: 'variable', adjustable: true, min: 0 },
                { name: 'Essen auswärts', amount: 120, category: 'variable', adjustable: true, min: 0 },
                { name: 'Rauchen/Vapes', amount: 80, category: 'variable', adjustable: true, min: 0 },
                { name: 'Transport (ÖV)', amount: 120, category: 'variable' },
                { name: 'Beauty/Barber', amount: 50, category: 'variable', adjustable: true, min: 0 }
            ],
            savings: [
                { name: getGoalName(questionnaireData.q10), amount: 250, category: 'savings', adjustable: true, min: 100 }
            ]
        },
        luxuriös: {
            name: 'Luxuriös',
            description: 'Du geniesst das Leben und gibst gerne Geld aus.',
            color: '#8b5cf6',
            income: [
                { name: 'Lohn (netto)', amount: 3750, category: 'income' }
            ],
            fixed: [
                { name: 'Miete', amount: 1400, category: 'fixed', adjustable: true, min: 1200 },
                { name: 'Krankenkasse', amount: 350, category: 'fixed' },
                { name: 'Handy-Abo', amount: 70, category: 'fixed' },
                { name: 'Internet', amount: 50, category: 'fixed' },
                { name: 'Strom/Heizung (akonto)', amount: 100, category: 'fixed' },
                { name: 'Fitness-Abo', amount: 80, category: 'fixed', adjustable: true, min: 0 }
            ],
            variable: [
                { name: 'Lebensmittel', amount: 500, category: 'variable', adjustable: true, min: 300 },
                { name: 'Ausgang', amount: 250, category: 'variable', adjustable: true, min: 0 },
                { name: 'Kleider/Schuhe', amount: 200, category: 'variable', adjustable: true, min: 20 },
                { name: 'Streaming-Dienste', amount: 50, category: 'variable', adjustable: true, min: 0 },
                { name: 'Hobbys/Gaming', amount: 120, category: 'variable', adjustable: true, min: 0 },
                { name: 'Essen auswärts', amount: 200, category: 'variable', adjustable: true, min: 0 },
                { name: 'Rauchen/Vapes', amount: 120, category: 'variable', adjustable: true, min: 0 },
                { name: 'Transport (Auto)', amount: 300, category: 'variable', adjustable: true, min: 80 },
                { name: 'Beauty/Barber', amount: 80, category: 'variable', adjustable: true, min: 0 }
            ],
            savings: [
                { name: getGoalName(questionnaireData.q10), amount: 300, category: 'savings', adjustable: true, min: 100 }
            ]
        }
    };
    
    currentBudget = budgets[budgetType];
}

function getGoalName(value) {
    const goals = {
        1: 'Notfall-Reserve',
        2: 'Ferien/Reisen',
        3: 'Auto/Führerschein'
    };
    return goals[value] || 'Sparen';
}

function displayBudgetResult() {
    const resultDiv = document.getElementById('budgetResult');
    resultDiv.innerHTML = `
        <h3>${currentBudget.name}</h3>
        <p>${currentBudget.description}</p>
        <div class="budget-badge" style="background: ${currentBudget.color};">${currentBudget.name}</div>
    `;
}

// ================================
// PHASE 4: Drag & Drop
// ================================

function startDragDrop() {
    showPhase(4);
    populateItemPool();
}

function populateItemPool() {
    const pool = document.getElementById('itemPool');
    pool.innerHTML = '';
    
    // Alle Items zusammenfassen
    const allItems = [
        ...currentBudget.income,
        ...currentBudget.fixed,
        ...currentBudget.variable,
        ...currentBudget.savings
    ];
    
    // Items in zufälliger Reihenfolge
    shuffleArray(allItems);
    
    allItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'budget-item';
        itemDiv.draggable = true;
        itemDiv.id = `item-${index}`;
        itemDiv.dataset.category = item.category;
        itemDiv.dataset.name = item.name;
        itemDiv.dataset.amount = item.amount;
        itemDiv.dataset.adjustable = item.adjustable || false;
        itemDiv.dataset.min = item.min || 0;
        
        itemDiv.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-amount">CHF ${item.amount}</span>
        `;
        
        itemDiv.addEventListener('dragstart', dragStart);
        itemDiv.addEventListener('dragend', dragEnd);
        
        pool.appendChild(itemDiv);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function allowDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function dragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

function drop(e) {
    e.preventDefault();
    const dropZone = e.currentTarget;
    dropZone.classList.remove('drag-over');
    
    if (draggedElement) {
        const itemCategory = draggedElement.dataset.category;
        const zoneCategory = dropZone.id.replace('-zone', '');
        
        // Prüfen ob richtige Zone
        if (itemCategory === zoneCategory) {
            dropZone.appendChild(draggedElement);
            updateCategoryTotals();
            checkIfComplete();
        } else {
            // Falsche Zone - visuelles Feedback
            dropZone.style.background = '#fee2e2';
            setTimeout(() => {
                dropZone.style.background = '';
            }, 500);
        }
    }
}

function updateCategoryTotals() {
    const categories = ['income', 'fixed', 'variable', 'savings'];
    
    categories.forEach(cat => {
        const zone = document.getElementById(`${cat}-zone`);
        const items = zone.querySelectorAll('.budget-item');
        let total = 0;
        
        items.forEach(item => {
            total += parseInt(item.dataset.amount);
        });
        
        document.getElementById(`${cat}-total`).textContent = `CHF ${total}`;
    });
    
    updateBalance();
}

function updateBalance() {
    const income = calculateCategoryTotal('income');
    const fixed = calculateCategoryTotal('fixed');
    const variable = calculateCategoryTotal('variable');
    const savings = calculateCategoryTotal('savings');
    
    const expenses = fixed + variable + savings;
    const balance = income - expenses;
    
    document.getElementById('balance-income').textContent = `CHF ${income}`;
    document.getElementById('balance-expenses').textContent = `CHF ${expenses}`;
    
    const balanceElement = document.getElementById('balance-result');
    balanceElement.textContent = `CHF ${balance}`;
    
    if (balance < 0) {
        balanceElement.classList.remove('positive', 'neutral');
        balanceElement.classList.add('negative');
    } else if (balance === 0) {
        balanceElement.classList.remove('positive', 'negative');
        balanceElement.classList.add('neutral');
    } else {
        balanceElement.classList.remove('negative', 'neutral');
        balanceElement.classList.add('positive');
    }
}

function calculateCategoryTotal(category) {
    const zone = document.getElementById(`${category}-zone`);
    const items = zone.querySelectorAll('.budget-item');
    let total = 0;
    
    items.forEach(item => {
        total += parseInt(item.dataset.amount);
    });
    
    return total;
}

function checkIfComplete() {
    const pool = document.getElementById('itemPool');
    
    if (pool.children.length === 0) {
        document.getElementById('checkBudgetBtn').disabled = false;
    }
}

function checkBudget() {
    const balance = calculateCategoryTotal('income') - 
                   (calculateCategoryTotal('fixed') + 
                    calculateCategoryTotal('variable') + 
                    calculateCategoryTotal('savings'));
    
    if (balance < 0) {
        showPhase(5);
        prepareOptimization(Math.abs(balance));
    } else {
        alert('Wow! Dein Budget ist bereits ausgeglichen. Das ist toll!');
        showPhase(6);
    }
}

// ================================
// PHASE 5: Optimierung
// ================================

function prepareOptimization(deficit) {
    document.getElementById('deficitMessage').textContent = 
        `Dein Budget hat ein Defizit von CHF ${deficit}. Das bedeutet: Am Ende des Monats fehlen dir CHF ${deficit}. So machst du jeden Monat Schulden!`;
    
    const zone = document.getElementById('optimizationZone');
    zone.innerHTML = '';
    
    // Alle anpassbaren Items sammeln
    const adjustableItems = [];
    
    ['fixed', 'variable', 'savings'].forEach(cat => {
        const zoneElement = document.getElementById(`${cat}-zone`);
        const items = zoneElement.querySelectorAll('.budget-item');
        
        items.forEach(item => {
            if (item.dataset.adjustable === 'true') {
                adjustableItems.push({
                    name: item.dataset.name,
                    amount: parseInt(item.dataset.amount),
                    min: parseInt(item.dataset.min),
                    category: cat,
                    element: item
                });
            }
        });
    });
    
    // Items anzeigen
    adjustableItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'optimization-item';
        itemDiv.dataset.index = index;
        
        const canReduce = item.amount > item.min;
        const canDelete = item.min === 0;
        
        itemDiv.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-hint">Aktuell: CHF ${item.amount} ${canReduce ? `(Min: CHF ${item.min})` : ''}</span>
            </div>
            <div class="item-controls">
                ${canReduce ? `<input type="number" value="${item.amount}" min="${item.min}" max="${item.amount}" step="10" onchange="updateItemAmount(${index}, this.value)">` : ''}
                ${canDelete ? `<button onclick="removeItem(${index})">Entfernen</button>` : ''}
            </div>
        `;
        
        zone.appendChild(itemDiv);
    });
    
    // Speichere adjustable items global
    window.adjustableItems = adjustableItems;
    
    updateOptimizationBalance();
}

function updateItemAmount(index, newAmount) {
    const item = window.adjustableItems[index];
    newAmount = parseInt(newAmount);
    
    if (newAmount >= item.min && newAmount <= item.amount) {
        item.element.dataset.amount = newAmount;
        item.element.querySelector('.item-amount').textContent = `CHF ${newAmount}`;
        updateCategoryTotals();
        updateOptimizationBalance();
    }
}

function removeItem(index) {
    const item = window.adjustableItems[index];
    
    if (confirm(`Möchtest du "${item.name}" wirklich entfernen?`)) {
        item.element.remove();
        document.querySelector(`[data-index="${index}"]`).remove();
        updateCategoryTotals();
        updateOptimizationBalance();
    }
}

function updateOptimizationBalance() {
    const income = calculateCategoryTotal('income');
    const expenses = calculateCategoryTotal('fixed') + 
                    calculateCategoryTotal('variable') + 
                    calculateCategoryTotal('savings');
    const balance = income - expenses;
    
    document.getElementById('opt-balance-income').textContent = `CHF ${income}`;
    document.getElementById('opt-balance-expenses').textContent = `CHF ${expenses}`;
    
    const balanceElement = document.getElementById('opt-balance-result');
    balanceElement.textContent = `CHF ${balance}`;
    
    if (balance < 0) {
        balanceElement.classList.remove('positive', 'neutral');
        balanceElement.classList.add('negative');
        document.getElementById('finalizeBtn').disabled = true;
    } else {
        balanceElement.classList.remove('negative');
        balanceElement.classList.add('positive');
        document.getElementById('finalizeBtn').disabled = false;
    }
}

function finalizeBudget() {
    showPhase(6);
}

// ================================
// PHASE 6: Abschluss & Quiz
// ================================

function submitFinalQuiz() {
    const questions = ['quiz1', 'quiz2', 'quiz3'];
    let correct = 0;
    
    questions.forEach(q => {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        if (selected) {
            const label = selected.parentElement;
            if (selected.value === 'correct') {
                label.classList.add('correct');
                correct++;
            } else {
                label.classList.add('wrong');
            }
            
            // Richtige Antwort auch markieren
            document.querySelectorAll(`input[name="${q}"]`).forEach(input => {
                if (input.value === 'correct') {
                    input.parentElement.classList.add('correct');
                }
            });
        }
    });
    
    // Modul als abgeschlossen markieren
    completeModule(1);
    
    alert(`Du hast ${correct} von 3 Fragen richtig beantwortet! ${correct === 3 ? 'Perfekt! 🎉' : 'Nicht schlecht!'}`);
}

// ================================
// HILFSFUNKTIONEN
// ================================

function showPhase(phaseNumber) {
    document.querySelectorAll('.phase').forEach(phase => {
        phase.classList.remove('active');
    });
    document.getElementById(`phase${phaseNumber}`).classList.add('active');
    window.scrollTo(0, 0);
}

// ================================
// INITIALISIERUNG
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Erstes Phase anzeigen
    showPhase(1);
});
