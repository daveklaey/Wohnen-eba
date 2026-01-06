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
    
    // Erstelle Word-Dokument mit docx.js
    const doc = new docx.Document({
        sections: [{
            properties: {},
            children: [
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "Meine Notizen: Fake-Inserate erkennen",
                            bold: true,
                            size: 32,
                            color: "667eea"
                        })
                    ],
                    spacing: { after: 400 }
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "Modul 2 - Meine erste Wohnung",
                            italics: true,
                            size: 24,
                            color: "666666"
                        })
                    ],
                    spacing: { after: 600 }
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: notes,
                            size: 24
                        })
                    ]
                })
            ]
        }]
    });
    
    // Download
    docx.Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meine-notizen-fake-inserate.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
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
    const date = new Date().toLocaleDateString('de-CH');
    
    // Vorteile und Nachteile als Aufzählungen formatieren
    const prosArray = apartmentData.pros.split('\n').filter(line => line.trim().length > 0)
        .map(pro => pro.replace(/^[-•*]\s*/, '').trim());
    const consArray = apartmentData.cons.split('\n').filter(line => line.trim().length > 0)
        .map(con => con.replace(/^[-•*]\s*/, '').trim());
    
    // Word-Dokument erstellen
    const doc = new docx.Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1440,
                        right: 1440,
                        bottom: 1440,
                        left: 1440
                    }
                }
            },
            children: [
                // Titel
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "🏠 Meine Wohnungsanalyse",
                            bold: true,
                            size: 36,
                            color: "667eea"
                        })
                    ],
                    spacing: { after: 200 }
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: `Erstellt am: ${date}`,
                            italics: true,
                            size: 20,
                            color: "666666"
                        })
                    ],
                    spacing: { after: 600 }
                }),
                
                // Grunddaten Section
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "📋 Grunddaten",
                            bold: true,
                            size: 28,
                            color: "667eea"
                        })
                    ],
                    spacing: { before: 400, after: 300 }
                }),
                new docx.Table({
                    rows: [
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [new docx.Paragraph({ text: "Adresse:", bold: true })],
                                    shading: { fill: "f5f7fa" },
                                    width: { size: 30, type: docx.WidthType.PERCENTAGE }
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(apartmentData.address)],
                                    width: { size: 70, type: docx.WidthType.PERCENTAGE }
                                })
                            ]
                        }),
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [new docx.Paragraph({ text: "Zimmer:", bold: true })],
                                    shading: { fill: "f5f7fa" }
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(apartmentData.rooms)]
                                })
                            ]
                        }),
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [new docx.Paragraph({ text: "Grösse:", bold: true })],
                                    shading: { fill: "f5f7fa" }
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(`${apartmentData.size} m²`)]
                                })
                            ]
                        }),
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [new docx.Paragraph({ text: "Verfügbar ab:", bold: true })],
                                    shading: { fill: "f5f7fa" }
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(apartmentData.available)]
                                })
                            ]
                        })
                    ],
                    width: { size: 100, type: docx.WidthType.PERCENTAGE }
                }),
                
                // Kosten Section
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "💰 Kosten",
                            bold: true,
                            size: 28,
                            color: "667eea"
                        })
                    ],
                    spacing: { before: 600, after: 300 }
                }),
                new docx.Table({
                    rows: [
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [new docx.Paragraph({ text: "Nettomiete:", bold: true })],
                                    shading: { fill: "f5f7fa" }
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(`CHF ${apartmentData.rent}`)]
                                })
                            ]
                        }),
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [new docx.Paragraph({ text: "Nebenkosten:", bold: true })],
                                    shading: { fill: "f5f7fa" }
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(`CHF ${apartmentData.extra}`)]
                                })
                            ]
                        }),
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [new docx.Paragraph({ text: "Bruttomiete:", bold: true })],
                                    shading: { fill: "d1fae5" }
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph({
                                        text: `CHF ${parseInt(apartmentData.rent) + parseInt(apartmentData.extra)}`,
                                        bold: true
                                    })],
                                    shading: { fill: "d1fae5" }
                                })
                            ]
                        })
                    ],
                    width: { size: 100, type: docx.WidthType.PERCENTAGE }
                }),
                
                // Begründung
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "💭 Warum diese Wohnung?",
                            bold: true,
                            size: 28,
                            color: "667eea"
                        })
                    ],
                    spacing: { before: 600, after: 300 }
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: apartmentData.why,
                            size: 24
                        })
                    ],
                    spacing: { after: 400 }
                }),
                
                // Vorteile
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "✅ Vorteile",
                            bold: true,
                            size: 28,
                            color: "10b981"
                        })
                    ],
                    spacing: { before: 600, after: 300 }
                }),
                ...prosArray.map(pro => new docx.Paragraph({
                    text: pro,
                    bullet: { level: 0 },
                    spacing: { after: 120 }
                })),
                
                // Nachteile
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "❌ Nachteile",
                            bold: true,
                            size: 28,
                            color: "ef4444"
                        })
                    ],
                    spacing: { before: 600, after: 300 }
                }),
                ...consArray.map(con => new docx.Paragraph({
                    text: con,
                    bullet: { level: 0 },
                    spacing: { after: 120 }
                })),
                
                // Link
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "🔗 Link zum Inserat",
                            bold: true,
                            size: 24,
                            color: "667eea"
                        })
                    ],
                    spacing: { before: 600, after: 200 }
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: apartmentData.link,
                            size: 20,
                            color: "667eea",
                            underline: {}
                        })
                    ]
                })
            ]
        }]
    });
    
    // Download
    docx.Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wohnungsanalyse.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

function finishModule() {
    // Modul als abgeschlossen markieren (Funktion aus main.js)
    completeModule(2);
    
    // Zurück zur Übersicht
    if (confirm('Modul 2 abschliessen und zur Übersicht zurückkehren?')) {
        window.location.href = 'index.html';
    }
}
