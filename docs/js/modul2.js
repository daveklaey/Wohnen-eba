// ================================
// MODUL 2 V2 - JAVASCRIPT
// ================================

let apartmentData = {};

// ================================
// PHASE NAVIGATION
// ================================

function showPhase(phaseNumber) {
    // Alle Phasen verstecken
    document.querySelectorAll('.phase').forEach(phase => {
        phase.classList.remove('active');
    });
    
    // Gewünschte Phase anzeigen
    document.getElementById(`phase${phaseNumber}`).classList.add('active');
    
    // Progress Dots aktualisieren
    document.querySelectorAll('.dot').forEach((dot, index) => {
        if (index < phaseNumber) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================
// NOTIZEN FUNKTIONEN
// ================================

function saveNotesLocally() {
    const notes = document.getElementById('videoNotes').value;
    localStorage.setItem('modul2-notes', notes);
    
    // Zeichenzähler aktualisieren
    document.getElementById('notesCount').textContent = notes.length + ' Zeichen';
    
    // "Gespeichert" anzeigen
    const saved = document.getElementById('notesSaved');
    saved.style.display = 'flex';
}

function downloadNotes() {
    const notes = document.getElementById('videoNotes').value;
    
    if (notes.trim() === '') {
        alert('Du hast noch keine Notizen geschrieben!');
        return;
    }
    
    // Erstelle Textdatei
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meine-notizen-fake-inserate.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Notizen beim Laden wiederherstellen
document.addEventListener('DOMContentLoaded', function() {
    const savedNotes = localStorage.getItem('modul2-notes');
    if (savedNotes) {
        document.getElementById('videoNotes').value = savedNotes;
        document.getElementById('notesCount').textContent = savedNotes.length + ' Zeichen';
    }
    
    // Form Event Listener
    const form = document.getElementById('apartmentForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Live-Kostenberechnung
        document.getElementById('apartmentRent').addEventListener('input', updateCostPreview);
        document.getElementById('apartmentExtra').addEventListener('input', updateCostPreview);
    }
});

// ================================
// GLOSSAR KARTEN FLIP
// ================================

function toggleGlossaryCard(card) {
    card.classList.toggle('flipped');
}

// ================================
// FORMULAR & PDF
// ================================

function updateCostPreview() {
    const rent = parseInt(document.getElementById('apartmentRent').value) || 0;
    const extra = parseInt(document.getElementById('apartmentExtra').value) || 0;
    const total = rent + extra;
    
    document.getElementById('totalCost').textContent = `CHF ${total}`;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
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
    
    // Zusammenfassung anzeigen
    displaySummary();
    
    // Zur Phase 5
    showPhase(5);
}

function displaySummary() {
    const summary = document.getElementById('apartmentSummary');
    
    // Vor- und Nachteile als Listen
    const prosList = apartmentData.pros.split('\n').filter(line => line.trim().length > 0);
    const consList = apartmentData.cons.split('\n').filter(line => line.trim().length > 0);
    
    const prosHTML = prosList.map(pro => `<li>${pro.replace(/^[-•*]\s*/, '')}</li>`).join('');
    const consHTML = consList.map(con => `<li>${con.replace(/^[-•*]\s*/, '')}</li>`).join('');
    
    summary.innerHTML = `
        <h3 style="color: var(--primary-color); margin-bottom: 2rem;">📊 Deine Wohnungsanalyse</h3>
        
        <div style="display: grid; gap: 2rem;">
            <div style="padding: 1.5rem; background: #f5f7fa; border-radius: 12px;">
                <h4 style="margin-bottom: 1rem;">📍 Grunddaten</h4>
                <div style="display: grid; gap: 0.5rem;">
                    <p><strong>Adresse:</strong> ${apartmentData.address}</p>
                    <p><strong>Zimmer:</strong> ${apartmentData.rooms}</p>
                    <p><strong>Grösse:</strong> ${apartmentData.size} m²</p>
                    <p><strong>Verfügbar ab:</strong> ${apartmentData.available}</p>
                    <p><strong>Link:</strong> <a href="${apartmentData.link}" target="_blank">Zum Inserat →</a></p>
                </div>
            </div>
            
            <div style="padding: 1.5rem; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 12px;">
                <h4 style="margin-bottom: 1rem;">💰 Kosten</h4>
                <div style="display: grid; gap: 0.5rem;">
                    <p>Nettomiete: CHF ${apartmentData.rent}</p>
                    <p>Nebenkosten: CHF ${apartmentData.extra}</p>
                    <p style="font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem;">
                        Total: CHF ${apartmentData.rent + apartmentData.extra}
                    </p>
                </div>
            </div>
            
            <div style="padding: 1.5rem; background: #f5f7fa; border-radius: 12px;">
                <h4 style="margin-bottom: 1rem;">💭 Warum diese Wohnung?</h4>
                <p style="line-height: 1.8;">${apartmentData.why}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="padding: 1.5rem; background: #d1fae5; border-radius: 12px;">
                    <h4 style="color: #065f46; margin-bottom: 1rem;">✅ Vorteile</h4>
                    <ul style="margin-left: 1rem;">${prosHTML}</ul>
                </div>
                <div style="padding: 1.5rem; background: #fee2e2; border-radius: 12px;">
                    <h4 style="color: #991b1b; margin-bottom: 1rem;">⚠️ Nachteile</h4>
                    <ul style="margin-left: 1rem;">${consHTML}</ul>
                </div>
            </div>
        </div>
    `;
}

function downloadApartmentPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Titel
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('Wohnungsanalyse', 20, 20);
    
    // Datum
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const date = new Date().toLocaleDateString('de-CH');
    doc.text(`Erstellt am: ${date}`, 20, 28);
    
    let y = 40;
    
    // Grunddaten
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Grunddaten', 20, y);
    
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Adresse: ${apartmentData.address}`, 20, y);
    y += 6;
    doc.text(`Zimmer: ${apartmentData.rooms}`, 20, y);
    y += 6;
    doc.text(`Grosse: ${apartmentData.size} m²`, 20, y);
    y += 6;
    doc.text(`Verfugbar ab: ${apartmentData.available}`, 20, y);
    
    // Kosten
    y += 12;
    doc.setFontSize(16);
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
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Warum diese Wohnung?', 20, y);
    
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const whyLines = doc.splitTextToSize(apartmentData.why, 170);
    doc.text(whyLines, 20, y);
    y += whyLines.length * 6 + 6;
    
    // Neue Seite wenn nötig
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    
    // Vorteile
    doc.setFontSize(16);
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
    doc.setFontSize(16);
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
    
    // Link
    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Link: ${apartmentData.link}`, 20, y);
    
    // PDF speichern
    doc.save('wohnungsanalyse.pdf');
}

function completeModule() {
    // Modul als abgeschlossen markieren
    if (typeof completeModule === 'function') {
        completeModule(2);
    }
    
    // Zurück zur Übersicht
    if (confirm('Modul 2 abschliessen und zur Übersicht zurückkehren?')) {
        window.location.href = 'index.html';
    }
}
