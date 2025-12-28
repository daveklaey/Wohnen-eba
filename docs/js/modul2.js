// ================================
// MODUL 2 JAVASCRIPT
// ================================

// Globale Variablen
let videoElement = null;
let videoPlaying = false;
let videoCurrentTime = 0;
let videoInterval = null;
let currentPauseIndex = 0;
let apartmentData = {};

// Video-Pausen mit Zeitstempeln (in Sekunden)
const videoPauses = [
    { time: 312, name: "Pause 1" },   // 5:12
    { time: 540, name: "Pause 2" },   // 9:00
    { time: 830, name: "Pause 3" },   // 13:50
    { time: 1031, name: "Pause 4" }   // 17:11 (Ende)
];

// Fragen für jede Pause
const pauseQuestions = {
    0: [ // Pause 1 bei 5:12
        {
            question: "Welche der folgenden sind typische Merkmale von Fake-Inseraten?",
            options: [
                { text: "Sehr hoher Preis für die Lage", correct: false },
                { text: "Zu günstig für die Lage und Ausstattung", correct: true },
                { text: "Viele Details zur Wohnung", correct: false }
            ]
        },
        {
            question: "Was zeigt der Selbstversuch von Kevin (Yuruma-Gründer)?",
            options: [
                { text: "Fake-Inserate sind selten geworden", correct: false },
                { text: "Auch auf neuen Plattformen gibt es schnell Betrugsversuche", correct: true },
                { text: "Man bekommt nur seriöse Angebote", correct: false }
            ]
        }
    ],
    1: [ // Pause 2 bei 9:00
        {
            question: "Wie versuchte die Betrügerin, Emily zu täuschen?",
            options: [
                { text: "Mit einem echten Airbnb-Inserat", correct: false },
                { text: "Mit einer gefälschten Airbnb-Seite für die Zahlung", correct: true },
                { text: "Mit einem persönlichen Treffen", correct: false }
            ]
        },
        {
            question: "Was hätte Emily tun können, um den Betrug zu erkennen?",
            options: [
                { text: "Sofort bezahlen, bevor die Wohnung weg ist", correct: false },
                { text: "Direkt auf der echten Airbnb-Plattform nach dem Inserat suchen", correct: true },
                { text: "Mehr Geld überweisen für die Sicherheit", correct: false }
            ]
        },
        {
            question: "Wie hoch waren die Chancen, dass Emily ihr Geld zurückbekommt?",
            options: [
                { text: "Sehr hoch, die Polizei hilft sofort", correct: false },
                { text: "Mittel, Airbnb zahlt zurück", correct: false },
                { text: "Sehr gering, solche Fälle sind schwer zu verfolgen", correct: true }
            ]
        }
    ],
    2: [ // Pause 3 bei 13:50
        {
            question: "Was schreiben die grossen Plattformen (Comparis, Homegate) über Fake-Inserate?",
            options: [
                { text: "Es gibt keine Fake-Inserate mehr", correct: false },
                { text: "Die Qualität der Fake-Inserate hat sich verbessert", correct: true },
                { text: "Nur ausländische Plattformen haben Probleme", correct: false }
            ]
        },
        {
            question: "Welche Rolle spielte die Corona-Pandemie für Betrüger:innen?",
            options: [
                { text: "Geld vor Besichtigung zu überweisen wurde plausibler", correct: true },
                { text: "Es gab weniger Betrugsversuche", correct: false },
                { text: "Alle Wohnungen wurden persönlich besichtigt", correct: false }
            ]
        },
        {
            question: "Wie viele Fake-Inserate löschte Comparis im Jahr 2021 teilweise pro Monat?",
            options: [
                { text: "Ca. 30", correct: false },
                { text: "Ca. 100", correct: false },
                { text: "Über 300", correct: true }
            ]
        }
    ],
    3: [ // Pause 4 am Ende
        {
            question: "Wie viele Betrugsanzeigen wegen Fake-Wohnungsinseraten gingen 2020 bei der Polizei Zürich ein?",
            options: [
                { text: "Ca. 50", correct: false },
                { text: "180", correct: true },
                { text: "Über 1000", correct: false }
            ]
        },
        {
            question: "Wer ist besonders anfällig für Wohnungsbetrug?",
            options: [
                { text: "Nur Schweizer:innen", correct: false },
                { text: "Austauschstudierende und Menschen unter Zeitdruck", correct: true },
                { text: "Menschen mit viel Geld", correct: false }
            ]
        },
        {
            question: "Wie hoch war die Leerwohnungsziffer in Zürich 2021?",
            options: [
                { text: "5%", correct: false },
                { text: "1,7%", correct: false },
                { text: "0,17% (381 Wohnungen)", correct: true }
            ]
        }
    ]
};

// ================================
// VIDEO-STEUERUNG
// ================================

function toggleVideo() {
    const btn = document.getElementById('playPauseBtn');
    
    if (!videoPlaying) {
        startVideo();
        btn.textContent = '⏸ Video pausieren';
    } else {
        pauseVideo();
        btn.textContent = '▶ Video fortsetzen';
    }
}

function startVideo() {
    videoPlaying = true;
    
    // Starte Video-Timer
    videoInterval = setInterval(() => {
        videoCurrentTime++;
        updateVideoProgress();
        checkForPause();
    }, 1000);
}

function pauseVideo() {
    videoPlaying = false;
    if (videoInterval) {
        clearInterval(videoInterval);
    }
}

function updateVideoProgress() {
    const totalSeconds = 1031; // 17:11
    const percentage = (videoCurrentTime / totalSeconds) * 100;
    document.getElementById('videoProgressFill').style.width = percentage + '%';
    
    const minutes = Math.floor(videoCurrentTime / 60);
    const seconds = videoCurrentTime % 60;
    document.getElementById('videoTime').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')} / 17:11`;
}

function checkForPause() {
    if (currentPauseIndex < videoPauses.length) {
        const nextPause = videoPauses[currentPauseIndex];
        
        if (videoCurrentTime >= nextPause.time) {
            pauseVideo();
            showPauseQuestions(currentPauseIndex);
        }
    }
}

function showPauseQuestions(pauseIndex) {
    // Video Overlay anzeigen
    document.getElementById('videoOverlay').classList.add('active');
    document.getElementById('playPauseBtn').disabled = true;
    
    // Fragen-Container anzeigen
    const container = document.getElementById('questionsContainer');
    container.style.display = 'block';
    
    // Fragen laden
    const questions = pauseQuestions[pauseIndex];
    const content = document.getElementById('questionContent');
    content.innerHTML = '';
    
    questions.forEach((q, index) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'video-question';
        qDiv.dataset.questionIndex = index;
        
        let optionsHTML = '';
        q.options.forEach((option, optIndex) => {
            optionsHTML += `
                <label class="radio-card">
                    <input type="radio" name="pause${pauseIndex}_q${index}" value="${optIndex}" data-correct="${option.correct}">
                    <span>${option.text}</span>
                </label>
            `;
        });
        
        qDiv.innerHTML = `
            <h4>${index + 1}. ${q.question}</h4>
            ${optionsHTML}
            <div class="feedback" style="display: none;"></div>
        `;
        
        content.appendChild(qDiv);
    });
}

function checkQuestionAnswers() {
    const questions = document.querySelectorAll('.video-question');
    let allCorrect = true;
    
    questions.forEach((qDiv) => {
        const radios = qDiv.querySelectorAll('input[type="radio"]');
        const feedback = qDiv.querySelector('.feedback');
        let answered = false;
        let correct = false;
        
        radios.forEach(radio => {
            if (radio.checked) {
                answered = true;
                correct = radio.dataset.correct === 'true';
            }
        });
        
        if (!answered) {
            allCorrect = false;
            feedback.textContent = 'Bitte wähle eine Antwort!';
            feedback.className = 'feedback wrong';
            feedback.style.display = 'block';
        } else if (correct) {
            feedback.textContent = '✓ Richtig!';
            feedback.className = 'feedback correct';
            feedback.style.display = 'block';
        } else {
            allCorrect = false;
            feedback.textContent = '✗ Leider falsch. Versuche es nochmal!';
            feedback.className = 'feedback wrong';
            feedback.style.display = 'block';
        }
    });
    
    if (allCorrect) {
        setTimeout(() => {
            continueVideo();
        }, 1500);
    }
}

function continueVideo() {
    // Overlay verstecken
    document.getElementById('videoOverlay').classList.remove('active');
    document.getElementById('questionsContainer').style.display = 'none';
    document.getElementById('playPauseBtn').disabled = false;
    
    // Nächste Pause vorbereiten
    currentPauseIndex++;
    
    // Video fortsetzen (falls nicht am Ende)
    if (currentPauseIndex < videoPauses.length) {
        startVideo();
        document.getElementById('playPauseBtn').textContent = '⏸ Video pausieren';
    } else {
        // Video ist fertig
        document.getElementById('videoComplete').style.display = 'block';
        document.getElementById('playPauseBtn').style.display = 'none';
    }
}

// ================================
// GLOSSAR
// ================================

function toggleGlossary(element) {
    const item = element.closest('.glossary-item');
    item.classList.toggle('active');
}

// ================================
// WOHNUNGSFORMULAR
// ================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('apartmentForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveApartment();
        });
    }
});

function saveApartment() {
    // Daten sammeln
    apartmentData = {
        link: document.getElementById('apartmentLink').value,
        address: document.getElementById('apartmentAddress').value,
        rooms: document.getElementById('apartmentRooms').value,
        rent: parseInt(document.getElementById('apartmentRent').value),
        extra: parseInt(document.getElementById('apartmentExtra').value),
        size: document.getElementById('apartmentSize').value || 'Nicht angegeben',
        available: document.getElementById('apartmentAvailable').value || 'Nicht angegeben',
        why: document.getElementById('apartmentWhy').value,
        pros: document.getElementById('apartmentPros').value,
        cons: document.getElementById('apartmentCons').value
    };
    
    // Zusammenfassung erstellen
    displaySummary();
    
    // Zur Phase 4
    showPhase(4);
}

function displaySummary() {
    const summary = document.getElementById('apartmentSummary');
    
    // Vor- und Nachteile als Listen aufbereiten
    const prosList = apartmentData.pros.split('\n').filter(line => line.trim().length > 0);
    const consList = apartmentData.cons.split('\n').filter(line => line.trim().length > 0);
    
    const prosHTML = prosList.map(pro => `<li>${pro.replace(/^[-•*]\s*/, '')}</li>`).join('');
    const consHTML = consList.map(con => `<li>${con.replace(/^[-•*]\s*/, '')}</li>`).join('');
    
    summary.innerHTML = `
        <h3>Deine Wohnungsanalyse</h3>
        
        <div class="summary-section">
            <h4>📍 Grunddaten</h4>
            <div class="summary-detail">
                <span class="label">Adresse:</span>
                <span class="value">${apartmentData.address}</span>
            </div>
            <div class="summary-detail">
                <span class="label">Zimmer:</span>
                <span class="value">${apartmentData.rooms}</span>
            </div>
            <div class="summary-detail">
                <span class="label">Grösse:</span>
                <span class="value">${apartmentData.size} m²</span>
            </div>
            <div class="summary-detail">
                <span class="label">Verfügbar ab:</span>
                <span class="value">${apartmentData.available}</span>
            </div>
            <div class="summary-detail">
                <span class="label">Link:</span>
                <span class="value"><a href="${apartmentData.link}" target="_blank">Zum Inserat →</a></span>
            </div>
        </div>
        
        <div class="summary-section">
            <h4>💰 Kosten</h4>
            <div class="summary-costs">
                <div class="cost-row">
                    <span>Nettomiete:</span>
                    <span>CHF ${apartmentData.rent}</span>
                </div>
                <div class="cost-row">
                    <span>Nebenkosten:</span>
                    <span>CHF ${apartmentData.extra}</span>
                </div>
                <div class="cost-row total">
                    <span>Bruttomiete:</span>
                    <span>CHF ${apartmentData.rent + apartmentData.extra}</span>
                </div>
            </div>
        </div>
        
        <div class="summary-section">
            <h4>💭 Warum diese Wohnung?</h4>
            <p>${apartmentData.why}</p>
        </div>
        
        <div class="summary-section">
            <div class="summary-lists">
                <div class="pros-list">
                    <h4>✓ Vorteile</h4>
                    <ul>${prosHTML}</ul>
                </div>
                <div class="cons-list">
                    <h4>✗ Nachteile</h4>
                    <ul>${consHTML}</ul>
                </div>
            </div>
        </div>
    `;
}

// ================================
// PDF-EXPORT
// ================================

function downloadPDF() {
    // jsPDF nutzen
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Titel
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Meine Wohnungsanalyse', 20, 20);
    
    // Datum
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const date = new Date().toLocaleDateString('de-CH');
    doc.text(`Erstellt am: ${date}`, 20, 28);
    
    // Grunddaten
    let y = 40;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Grunddaten', 20, y);
    
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Adresse: ${apartmentData.address}`, 20, y);
    y += 6;
    doc.text(`Zimmer: ${apartmentData.rooms}`, 20, y);
    y += 6;
    doc.text(`Grösse: ${apartmentData.size} m²`, 20, y);
    y += 6;
    doc.text(`Verfügbar ab: ${apartmentData.available}`, 20, y);
    
    // Kosten
    y += 12;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Kosten', 20, y);
    
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Nettomiete: CHF ${apartmentData.rent}`, 20, y);
    y += 6;
    doc.text(`Nebenkosten: CHF ${apartmentData.extra}`, 20, y);
    y += 6;
    doc.setFont(undefined, 'bold');
    doc.text(`Bruttomiete: CHF ${apartmentData.rent + apartmentData.extra}`, 20, y);
    
    // Begründung
    y += 12;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Warum diese Wohnung?', 20, y);
    
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const whyLines = doc.splitTextToSize(apartmentData.why, 170);
    doc.text(whyLines, 20, y);
    y += whyLines.length * 6 + 6;
    
    // Vorteile
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Vorteile', 20, y);
    
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const prosList = apartmentData.pros.split('\n').filter(line => line.trim().length > 0);
    prosList.forEach(pro => {
        const cleanPro = pro.replace(/^[-•*]\s*/, '');
        doc.text(`• ${cleanPro}`, 25, y);
        y += 6;
    });
    
    // Nachteile
    y += 6;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Nachteile', 20, y);
    
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const consList = apartmentData.cons.split('\n').filter(line => line.trim().length > 0);
    consList.forEach(con => {
        const cleanCon = con.replace(/^[-•*]\s*/, '');
        doc.text(`• ${cleanCon}`, 25, y);
        y += 6;
    });
    
    // Link (ganz unten)
    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Link zum Inserat: ${apartmentData.link}`, 20, y);
    
    // PDF speichern
    doc.save('meine-wohnung.pdf');
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
