// Rich Text Notepad Functionality
class RichTextNotepad {
    constructor() {
        this.editor = document.getElementById('notepadEditor');
        this.titleInput = document.getElementById('noteTitle');
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        this.notesList = document.getElementById('notesList');
        this.currentNoteId = null;
        
        this.initializeEventListeners();
        this.loadNotes();
        this.updateCounts();
    }
    
    initializeEventListeners() {
        // Toolbar buttons
        document.querySelectorAll('.toolbar-btn[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                this.executeCommand(command);
            });
        });
        
        // Heading select
        document.getElementById('headingSelect').addEventListener('change', (e) => {
            this.executeCommand('formatBlock', e.target.value);
        });
        
        // Save, Load, Clear buttons
        document.getElementById('saveBtn').addEventListener('click', () => this.saveNote());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadNote());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearEditor());
        
        // Editor events
        this.editor.addEventListener('input', () => this.updateCounts());
        this.editor.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Mobile navigation
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    executeCommand(command, value = null) {
        document.execCommand(command, false, value);
        this.editor.focus();
    }
    
    handleKeyDown(e) {
        // Auto-save on Ctrl+S
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            this.saveNote();
        }
        
        // Tab to indent
        if (e.key === 'Tab') {
            e.preventDefault();
            this.executeCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    }
    
    updateCounts() {
        const text = this.editor.innerText || this.editor.textContent;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        this.wordCount.textContent = `${words} words`;
        this.charCount.textContent = `${chars} characters`;
    }
    
    saveNote() {
        const title = this.titleInput.value.trim() || 'Untitled Note';
        const content = this.editor.innerHTML;
        const timestamp = new Date().toISOString();
        
        const note = {
            id: this.currentNoteId || Date.now().toString(),
            title: title,
            content: content,
            timestamp: timestamp,
            preview: this.getTextPreview(content)
        };
        
        // Save to localStorage
        const notes = this.getNotesFromStorage();
        const existingIndex = notes.findIndex(n => n.id === note.id);
        
        if (existingIndex >= 0) {
            notes[existingIndex] = note;
        } else {
            notes.unshift(note); // Add to beginning
        }
        
        localStorage.setItem('notepad_notes', JSON.stringify(notes));
        
        // Update UI
        this.loadNotes();
        this.currentNoteId = note.id;
        
        // Show success message
        this.showNotification('Note saved successfully!', 'success');
    }
    
    loadNote() {
        const notes = this.getNotesFromStorage();
        if (notes.length === 0) {
            this.showNotification('No saved notes found.', 'info');
            return;
        }
        
        // Create modal for note selection
        this.showNoteSelectionModal(notes);
    }
    
    showNoteSelectionModal(notes) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Select a Note to Load</h3>
                <div class="notes-selection">
                    ${notes.map(note => `
                        <div class="note-selection-item" data-id="${note.id}">
                            <div class="note-selection-title">${note.title}</div>
                            <div class="note-selection-preview">${note.preview}</div>
                            <div class="note-selection-date">${new Date(note.timestamp).toLocaleDateString()}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Add click handlers
        modal.querySelectorAll('.note-selection-item').forEach(item => {
            item.addEventListener('click', () => {
                const noteId = item.dataset.id;
                const note = notes.find(n => n.id === noteId);
                if (note) {
                    this.loadNoteById(note);
                }
                modal.remove();
            });
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    loadNoteById(note) {
        this.titleInput.value = note.title;
        this.editor.innerHTML = note.content;
        this.currentNoteId = note.id;
        this.updateCounts();
        this.showNotification('Note loaded successfully!', 'success');
    }
    
    clearEditor() {
        if (confirm('Are you sure you want to clear the editor? This action cannot be undone.')) {
            this.titleInput.value = '';
            this.editor.innerHTML = '<p>Start typing your note here...</p>';
            this.currentNoteId = null;
            this.updateCounts();
            this.showNotification('Editor cleared!', 'info');
        }
    }
    
    getNotesFromStorage() {
        const notes = localStorage.getItem('notepad_notes');
        return notes ? JSON.parse(notes) : [];
    }
    
    loadNotes() {
        const notes = this.getNotesFromStorage();
        this.notesList.innerHTML = notes.map(note => `
            <div class="note-item" data-id="${note.id}">
                <div class="note-item-title">${note.title}</div>
                <div class="note-item-preview">${note.preview}</div>
                <div class="note-item-meta">
                    <span>${new Date(note.timestamp).toLocaleDateString()}</span>
                    <div class="note-item-actions">
                        <button class="note-action-btn" onclick="notepad.loadNoteById(${JSON.stringify(note)})">Load</button>
                        <button class="note-action-btn delete" onclick="notepad.deleteNote('${note.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    deleteNote(noteId) {
        if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            const notes = this.getNotesFromStorage();
            const filteredNotes = notes.filter(note => note.id !== noteId);
            localStorage.setItem('notepad_notes', JSON.stringify(filteredNotes));
            
            if (this.currentNoteId === noteId) {
                this.clearEditor();
            }
            
            this.loadNotes();
            this.showNotification('Note deleted successfully!', 'success');
        }
    }
    
    getTextPreview(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const text = tempDiv.textContent || tempDiv.innerText || '';
        return text.substring(0, 100) + (text.length > 100 ? '...' : '');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the notepad when DOM is loaded
let notepad;
document.addEventListener('DOMContentLoaded', () => {
    notepad = new RichTextNotepad();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notes-selection {
        max-height: 400px;
        overflow-y: auto;
        margin-bottom: 1rem;
    }
    
    .note-selection-item {
        padding: 1rem;
        border: 1px solid var(--gray-200);
        border-radius: 4px;
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .note-selection-item:hover {
        background: var(--gray-100);
        border-color: var(--black);
    }
    
    .note-selection-title {
        font-weight: 600;
        color: var(--black);
        margin-bottom: 0.5rem;
    }
    
    .note-selection-preview {
        color: var(--gray-600);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }
    
    .note-selection-date {
        color: var(--gray-500);
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style);
