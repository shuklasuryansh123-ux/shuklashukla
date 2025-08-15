// Blog Page Functionality
class BlogPage {
    constructor() {
        this.blogData = [];
        this.filteredBlogs = [];
        this.currentPage = 1;
        this.blogsPerPage = 6;
        this.currentCategory = 'all';
        this.searchTerm = '';
        
        this.initializeEventListeners();
        this.loadBlogs();
    }
    
    async loadBlogs() {
        try {
            const res = await fetch('/api/content/blog');
            if (!res.ok) throw new Error('Failed to load blogs');
            const data = await res.json();
            this.blogData = (data.blogPosts || []).sort((a,b) => new Date(b.date) - new Date(a.date));
            this.filteredBlogs = [...this.blogData];
            this.renderLatestArticles();
        } catch (error) {
            console.error('Error loading blogs:', error);
            this.blogData = [];
            this.filteredBlogs = [];
        }
    }
    
    initializeEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput') || document.getElementById('blogSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterBlogs();
            });
        }
        
        // Category filters (blog.html uses .filter-tab)
        const filterButtons = document.querySelectorAll('.filter-tab, .filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category || 'all';
                this.currentPage = 1;
                this.filterBlogs();
            });
        });
        
        // Load more (blog.html)
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.appendMoreArticles();
            });
        }
    }
    
    filterBlogs() {
        this.filteredBlogs = this.blogData.filter(blog => {
            const matchesCategory = this.currentCategory === 'all' || blog.category === this.currentCategory;
            const matchesSearch = (blog.title || '').toLowerCase().includes(this.searchTerm) || 
                                (blog.excerpt || '').toLowerCase().includes(this.searchTerm);
            return matchesCategory && matchesSearch;
        });
        this.currentPage = 1;
        this.renderLatestArticles();
    }

    renderLatestArticles() {
        const container = document.getElementById('articlesGrid');
        if (!container) return;
        container.innerHTML = '';
        this.appendMoreArticles();
    }

    appendMoreArticles() {
        const container = document.getElementById('articlesGrid');
        if (!container) return;
        const startIndex = (this.currentPage - 1) * this.blogsPerPage;
        const endIndex = startIndex + this.blogsPerPage;
        const blogsToShow = this.filteredBlogs.slice(startIndex, endIndex);
        const html = blogsToShow.map(blog => this.renderArticleCard(blog)).join('');
        container.insertAdjacentHTML('beforeend', html);
        
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            const hasMore = endIndex < this.filteredBlogs.length;
            loadMoreBtn.disabled = !hasMore;
            loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
        }
    }

    renderArticleCard(blog) {
        const categoryName = this.getCategoryName(blog.category);
        const dateString = new Date(blog.date).toLocaleDateString();
        return `
            <article class="article-card" id="post-${blog.id}">
                <div class="article-image">
                    <div class="image-placeholder"><div class="placeholder-icon">${blog.image || '📚'}</div></div>
                    <div class="article-category">${categoryName}</div>
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        <span class="article-date">${dateString}</span>
                    </div>
                    <h3 class="article-title">${blog.title}</h3>
                    <p class="article-excerpt">${blog.excerpt || ''}</p>
                    <a href="#post-${blog.id}" class="read-more" onclick="blogPage.openModalById(${blog.id}); return false;">Read Full Article →</a>
                </div>
            </article>
        `;
    }

    openModalById(id) {
        const blog = this.blogData.find(b => b.id === id);
        if (!blog) return;
        const modal = document.getElementById('blogModal');
        const content = document.getElementById('blogModalContent');
        if (!modal || !content) return;
        content.innerHTML = `
            <div class="blog-modal-content">
                <div class="blog-modal-header">
                    <h2 class="blog-modal-title">${blog.title}</h2>
                    <div class="blog-modal-meta">
                        <span>By ${blog.author || 'Legal Team'}</span>
                        <span>${new Date(blog.date).toLocaleDateString()}</span>
                        <span>${this.getCategoryName(blog.category)}</span>
                    </div>
                </div>
                <div class="blog-modal-image">${blog.image || '📚'}</div>
                <div class="blog-modal-body">${blog.content}</div>
            </div>
        `;
        modal.style.display = 'block';
    }
    
    getCategoryName(category) {
        const categories = {
            'corporate': 'Corporate Law',
            'family': 'Family Law',
            'criminal': 'Criminal Law',
            'real-estate': 'Real Estate',
            'legal': 'Legal'
        };
        return categories[category] || category || 'Legal';
    }
}

// Initialize the blog page when DOM is loaded
let blogPage;
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        blogPage = new BlogPage();
    });
}
