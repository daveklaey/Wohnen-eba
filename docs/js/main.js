// ================================
// FORTSCHRITTSVERWALTUNG
// ================================

// Fortschritt aus localStorage laden
function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('lernpfad-progress')) || {
        completed: [],
        currentModule: 1
    };
    return progress;
}

// Fortschritt speichern
function saveProgress(progress) {
    localStorage.setItem('lernpfad-progress', JSON.stringify(progress));
}

// Modul als abgeschlossen markieren
function completeModule(moduleNumber) {
    const progress = loadProgress();
    if (!progress.completed.includes(moduleNumber)) {
        progress.completed.push(moduleNumber);
        progress.currentModule = Math.min(moduleNumber + 1, 5);
        saveProgress(progress);
    }
    updateProgressDisplay();
}

// Fortschrittsanzeige aktualisieren
function updateProgressDisplay() {
    const progress = loadProgress();
    const completed = progress.completed.length;
    const total = 5;
    const percentage = (completed / total) * 100;
    
    // Fortschrittsbalken
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        if (percentage > 20) {
            progressFill.textContent = Math.round(percentage) + '%';
        }
    }
    
    // Zahlen aktualisieren
    const progressModules = document.getElementById('progressModules');
    if (progressModules) {
        progressModules.textContent = completed;
    }
    
    // Status-Labels aktualisieren
    for (let i = 1; i <= 5; i++) {
        const statusElement = document.getElementById('status-' + i);
        if (statusElement) {
            if (progress.completed.includes(i)) {
                statusElement.textContent = 'Abgeschlossen ✓';
                statusElement.classList.add('completed');
            } else if (i === progress.currentModule) {
                statusElement.textContent = 'Aktuell';
                statusElement.style.background = 'var(--accent-color)';
                statusElement.style.color = 'var(--white)';
            } else {
                statusElement.textContent = 'Nicht begonnen';
            }
        }
    }
    
    // Button-Texte anpassen
    progress.completed.forEach(moduleNum => {
        const moduleCard = document.querySelector(`[data-module="${moduleNum}"]`);
        if (moduleCard) {
            const btn = moduleCard.querySelector('.btn');
            if (btn) {
                btn.textContent = 'Nochmals anschauen';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            }
        }
    });
}

// ================================
// INITIALISIERUNG
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Fortschritt beim Laden der Seite anzeigen
    updateProgressDisplay();
    
    // Smooth Scroll für Anker-Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ================================
// UTILITY FUNCTIONS
// ================================

// Fortschritt zurücksetzen (für Testzwecke)
function resetProgress() {
    if (confirm('Willst du wirklich den gesamten Fortschritt zurücksetzen?')) {
        localStorage.removeItem('lernpfad-progress');
        updateProgressDisplay();
        alert('Fortschritt wurde zurückgesetzt.');
    }
}

// Funktion um zu prüfen, ob ein Modul bereits abgeschlossen ist
function isModuleCompleted(moduleNumber) {
    const progress = loadProgress();
    return progress.completed.includes(moduleNumber);
}

// Export für andere Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadProgress,
        saveProgress,
        completeModule,
        updateProgressDisplay,
        isModuleCompleted,
        resetProgress
    };
}
