// Gallery Page Functionality
class GalleryPage {
    constructor() {
        this.galleryData = this.getGalleryData();
        this.filteredGallery = [...this.galleryData];
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.currentCategory = 'all';
        this.searchTerm = '';
        
        this.initializeEventListeners();
        this.renderGallery();
        this.renderPagination();
    }
    
    getGalleryData() {
        return [
            {
                id: 1,
                title: "Court Proceedings",
                description: "Professional court proceedings and legal consultations in action",
                category: "court",
                image: "⚖️",
                date: "2025-01-15",
                location: "High Court, Indore"
            },
            {
                id: 2,
                title: "Client Consultation",
                description: "Meeting with clients to discuss case strategies and legal advice",
                category: "office",
                image: "🤝",
                date: "2025-01-12",
                location: "Office, Indore"
            },
            {
                id: 3,
                title: "Legal Documents",
                description: "Preparation and review of important legal documents and contracts",
                category: "office",
                image: "📋",
                date: "2025-01-10",
                location: "Office, Indore"
            },
            {
                id: 4,
                title: "Office Environment",
                description: "Our professional office environment and modern legal workspace",
                category: "office",
                image: "🏢",
                date: "2025-01-08",
                location: "Office, Indore"
            },
            {
                id: 5,
                title: "Team Collaboration",
                description: "Our legal team working together on complex cases",
                category: "team",
                image: "👥",
                date: "2025-01-05",
                location: "Office, Indore"
            },
            {
                id: 6,
                title: "Legal Library",
                description: "Our comprehensive legal library and research resources",
                category: "office",
                image: "📚",
                date: "2025-01-03",
                location: "Office, Indore"
            },
            {
                id: 7,
                title: "Court Appearance",
                description: "Professional court appearances and legal representation",
                category: "court",
                image: "👨‍⚖️",
                date: "2024-12-28",
                location: "District Court, Indore"
            },
            {
                id: 8,
                title: "Legal Seminar",
                description: "Participating in legal seminars and professional development",
                category: "events",
                image: "🎓",
                date: "2024-12-25",
                location: "Conference Center, Indore"
            },
            {
                id: 9,
                title: "Client Meeting Room",
                description: "Private consultation rooms for confidential client meetings",
                category: "office",
                image: "🚪",
                date: "2024-12-20",
                location: "Office, Indore"
            },
            {
                id: 10,
                title: "Legal Research",
                description: "In-depth legal research and case preparation",
                category: "office",
                image: "🔍",
                date: "2024-12-18",
                location: "Office, Indore"
            },
            {
                id: 11,
                title: "Team Meeting",
                description: "Regular team meetings to discuss case strategies",
                category: "team",
                image: "📊",
                date: "2024-12-15",
                location: "Office, Indore"
            },
            {
                id: 12,
                title: "Legal Workshop",
                description: "Conducting legal workshops and training sessions",
                category: "events",
                image: "🎯",
                date: "2024-12-12",
                location: "Training Center, Indore"
            },
            {
                id: 13,
                title: "Court Filing",
                description: "Filing important legal documents and petitions",
                category: "court",
                image: "📄",
                date: "2024-12-10",
                location: "Court Registry, Indore"
            },
            {
                id: 14,
                title: "Client Success",
                description: "Celebrating successful case outcomes with clients",
                category: "events",
                image: "🎉",
                date: "2024-12-08",
                location: "Office, Indore"
            },
            {
                id: 15,
                title: "Legal Technology",
                description: "Modern legal technology and digital case management",
                category: "office",
                image: "💻",
                date: "2024-12-05",
                location: "Office, Indore"
            }
        ];
    }
    
    initializeEventListeners() {
        // Search functionality
        document.getElementById('gallerySearch').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterGallery();
        });
        
        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.currentPage = 1;
                this.filterGallery();
            });
        });
        
        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderGallery();
                this.renderPagination();
            }
        });
        
        document.getElementById('nextPage').addEventListener('click', () => {
            const maxPages = Math.ceil(this.filteredGallery.length / this.itemsPerPage);
            if (this.currentPage < maxPages) {
                this.currentPage++;
                this.renderGallery();
                this.renderPagination();
            }
        });
        
        // Modal close
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                document.getElementById('galleryModal').style.display = 'none';
            });
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('galleryModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Keyboard navigation for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('galleryModal').style.display = 'none';
            }
        });
        
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
    
    filterGallery() {
        this.filteredGallery = this.galleryData.filter(item => {
            const matchesCategory = this.currentCategory === 'all' || item.category === this.currentCategory;
            const matchesSearch = item.title.toLowerCase().includes(this.searchTerm) || 
                                item.description.toLowerCase().includes(this.searchTerm);
            return matchesCategory && matchesSearch;
        });
        
        this.currentPage = 1;
        this.renderGallery();
        this.renderPagination();
    }
    
    renderGallery() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const itemsToShow = this.filteredGallery.slice(startIndex, endIndex);
        
        const galleryGrid = document.getElementById('galleryGrid');
        
        if (itemsToShow.length === 0) {
            galleryGrid.innerHTML = `
                <div class="gallery-empty">
                    <div class="gallery-empty-icon">📷</div>
                    <h3>No photos found</h3>
                    <p>Try adjusting your search terms or filters to find what you're looking for.</p>
                </div>
            `;
            return;
        }
        
        galleryGrid.innerHTML = itemsToShow.map(item => `
            <div class="gallery-item" onclick="galleryPage.openGalleryModal(${item.id})">
                <div class="gallery-image">
                    ${item.image}
                    <div class="gallery-overlay">
                        <div class="gallery-overlay-icon">👁️</div>
                    </div>
                </div>
                <div class="gallery-content-card">
                    <h3 class="gallery-title">${item.title}</h3>
                    <p class="gallery-description">${item.description}</p>
                    <div class="gallery-meta">
                        <span class="gallery-category">${this.getCategoryName(item.category)}</span>
                        <span class="gallery-date">${new Date(item.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderPagination() {
        const totalPages = Math.ceil(this.filteredGallery.length / this.itemsPerPage);
        const pageNumbers = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        // Update prev/next buttons
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
        
        // Generate page numbers
        let pageNumbersHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            pageNumbersHTML += `
                <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="galleryPage.goToPage(${i})">${i}</button>
            `;
        }
        pageNumbers.innerHTML = pageNumbersHTML;
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderGallery();
        this.renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    openGalleryModal(itemId) {
        const item = this.galleryData.find(g => g.id === itemId);
        if (!item) return;
        
        const modal = document.getElementById('galleryModal');
        const content = document.getElementById('galleryModalContent');
        
        content.innerHTML = `
            <div class="gallery-modal-content">
                <div class="gallery-modal-image">
                    ${item.image}
                </div>
                <h2 class="gallery-modal-title">${item.title}</h2>
                <p class="gallery-modal-description">${item.description}</p>
                <div class="gallery-modal-meta">
                    <span>📅 ${new Date(item.date).toLocaleDateString()}</span>
                    <span>📍 ${item.location}</span>
                    <span>🏷️ ${this.getCategoryName(item.category)}</span>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }
    
    getCategoryName(category) {
        const categories = {
            'office': 'Office',
            'court': 'Court',
            'team': 'Team',
            'events': 'Events'
        };
        return categories[category] || category;
    }
}

// Initialize the gallery page when DOM is loaded
let galleryPage;
document.addEventListener('DOMContentLoaded', () => {
    galleryPage = new GalleryPage();
});
