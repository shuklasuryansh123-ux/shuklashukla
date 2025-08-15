// Blog Page Functionality
class BlogPage {
    constructor() {
        this.blogData = this.getBlogData();
        this.filteredBlogs = [...this.blogData];
        this.currentPage = 1;
        this.blogsPerPage = 6;
        this.currentCategory = 'all';
        this.searchTerm = '';
        
        this.initializeEventListeners();
        this.renderBlogs();
        this.renderPagination();
    }
    
    getBlogData() {
        return [
            {
                id: 1,
                title: "Understanding Corporate Law in India",
                excerpt: "A comprehensive guide to corporate law practices and regulations in India, covering business formation, compliance, and governance.",
                content: `
                    <h2>Corporate Law in India: A Complete Overview</h2>
                    <p>Corporate law in India is governed by the Companies Act, 2013, which provides a comprehensive framework for the incorporation, regulation, and winding up of companies. This legislation ensures transparency, accountability, and good corporate governance practices across all business entities operating in India.</p>
                    
                    <h3>Key Areas of Corporate Law</h3>
                    <ul>
                        <li><strong>Company Formation:</strong> Process of incorporating private and public companies</li>
                        <li><strong>Corporate Governance:</strong> Board structure, shareholder rights, and compliance</li>
                        <li><strong>Mergers & Acquisitions:</strong> Legal framework for business combinations</li>
                        <li><strong>Securities Law:</strong> Regulations governing capital markets and investments</li>
                    </ul>
                    
                    <h3>Recent Developments</h3>
                    <p>The Indian corporate law landscape has seen significant changes in recent years, with amendments focusing on:</p>
                    <ul>
                        <li>Enhanced disclosure requirements</li>
                        <li>Stricter compliance norms</li>
                        <li>Digital transformation initiatives</li>
                        <li>Environmental, Social, and Governance (ESG) compliance</li>
                    </ul>
                    
                    <p>Understanding these legal frameworks is crucial for businesses operating in India to ensure compliance and avoid legal complications.</p>
                `,
                category: 'corporate',
                image: '📄',
                date: '2025-01-15',
                author: 'Legal Team'
            },
            {
                id: 2,
                title: "Family Law: Recent Changes and Implications",
                excerpt: "Exploring the latest amendments in family law and their impact on divorce, custody, and property division cases.",
                content: `
                    <h2>Recent Changes in Family Law</h2>
                    <p>Recent amendments to family law have introduced significant changes in how divorce, child custody, and property division cases are handled. These changes aim to provide faster resolution and better protection for all parties involved.</p>
                    
                    <h3>Key Changes in Divorce Proceedings</h3>
                    <ul>
                        <li><strong>Mutual Consent Divorce:</strong> Simplified process for uncontested divorces</li>
                        <li><strong>Maintenance Guidelines:</strong> Clearer framework for alimony calculations</li>
                        <li><strong>Property Division:</strong> More equitable distribution of marital assets</li>
                        <li><strong>Child Custody:</strong> Enhanced focus on child welfare and best interests</li>
                    </ul>
                    
                    <h3>Impact on Legal Practice</h3>
                    <p>These changes have significant implications for legal practitioners and clients:</p>
                    <ul>
                        <li>Faster resolution of family disputes</li>
                        <li>Reduced litigation costs</li>
                        <li>Better protection of vulnerable parties</li>
                        <li>Increased emphasis on mediation and settlement</li>
                    </ul>
                    
                    <p>It's essential for individuals going through family law proceedings to understand these changes and their rights under the new framework.</p>
                `,
                category: 'family',
                image: '👨‍👩‍👧‍👦',
                date: '2025-01-10',
                author: 'Family Law Division'
            },
            {
                id: 3,
                title: "Real Estate Law: Property Rights and Disputes",
                excerpt: "Essential information about property rights, title verification, and dispute resolution in real estate transactions.",
                content: `
                    <h2>Real Estate Law: Property Rights and Disputes</h2>
                    <p>Real estate law encompasses various aspects including property rights, title verification, land acquisition, and dispute resolution. Understanding these legal frameworks is crucial for both buyers and sellers in real estate transactions.</p>
                    
                    <h3>Property Rights and Title Verification</h3>
                    <ul>
                        <li><strong>Title Search:</strong> Comprehensive verification of property ownership</li>
                        <li><strong>Encumbrance Certificate:</strong> Checking for liens and mortgages</li>
                        <li><strong>Land Records:</strong> Verification through government databases</li>
                        <li><strong>Legal Due Diligence:</strong> Ensuring clear and marketable title</li>
                    </ul>
                    
                    <h3>Common Disputes and Resolution</h3>
                    <p>Real estate disputes can arise from various issues:</p>
                    <ul>
                        <li>Boundary disputes and encroachment</li>
                        <li>Title defects and ownership claims</li>
                        <li>Construction and development issues</li>
                        <li>Rental and lease disputes</li>
                    </ul>
                    
                    <h3>Legal Remedies Available</h3>
                    <p>Various legal remedies are available for real estate disputes:</p>
                    <ul>
                        <li>Civil suits for specific performance</li>
                        <li>Injunction orders for property protection</li>
                        <li>Arbitration and mediation</li>
                        <li>Consumer protection remedies</li>
                    </ul>
                    
                    <p>Proper legal guidance is essential to navigate complex real estate transactions and resolve disputes effectively.</p>
                `,
                category: 'real-estate',
                image: '🏠',
                date: '2025-01-05',
                author: 'Real Estate Law Team'
            },
            {
                id: 4,
                title: "Criminal Defense: Understanding Your Rights",
                excerpt: "A comprehensive guide to criminal defense rights and the legal process in India.",
                content: `
                    <h2>Criminal Defense: Understanding Your Rights</h2>
                    <p>Every individual accused of a crime has fundamental rights that must be protected throughout the legal process. Understanding these rights is crucial for ensuring fair treatment and proper legal representation.</p>
                    
                    <h3>Fundamental Rights in Criminal Proceedings</h3>
                    <ul>
                        <li><strong>Right to Legal Representation:</strong> Access to competent legal counsel</li>
                        <li><strong>Right to Remain Silent:</strong> Protection against self-incrimination</li>
                        <li><strong>Right to Bail:</strong> Presumption of innocence until proven guilty</li>
                        <li><strong>Right to Fair Trial:</strong> Due process and equal protection</li>
                    </ul>
                    
                    <h3>The Criminal Justice Process</h3>
                    <p>The criminal justice process involves several stages:</p>
                    <ul>
                        <li>Arrest and detention</li>
                        <li>First Information Report (FIR)</li>
                        <li>Investigation and evidence collection</li>
                        <li>Charging and trial</li>
                        <li>Sentencing and appeals</li>
                    </ul>
                    
                    <h3>Role of Criminal Defense Attorney</h3>
                    <p>A skilled criminal defense attorney plays a crucial role in:</p>
                    <ul>
                        <li>Protecting constitutional rights</li>
                        <li>Investigating the case thoroughly</li>
                        <li>Negotiating with prosecutors</li>
                        <li>Presenting strong defense strategies</li>
                        <li>Ensuring fair treatment throughout the process</li>
                    </ul>
                    
                    <p>Early legal intervention is often critical in criminal cases to protect rights and achieve the best possible outcome.</p>
                `,
                category: 'criminal',
                image: '⚖️',
                date: '2024-12-28',
                author: 'Criminal Defense Team'
            },
            {
                id: 5,
                title: "Labor Law: Employee Rights and Employer Obligations",
                excerpt: "Understanding the legal framework governing employment relationships and workplace rights.",
                content: `
                    <h2>Labor Law: Employee Rights and Employer Obligations</h2>
                    <p>Labor law in India provides a comprehensive framework for regulating employment relationships, protecting worker rights, and ensuring fair workplace practices.</p>
                    
                    <h3>Employee Rights and Protections</h3>
                    <ul>
                        <li><strong>Fair Wages:</strong> Minimum wage and equal pay for equal work</li>
                        <li><strong>Working Conditions:</strong> Safe and healthy workplace environment</li>
                        <li><strong>Social Security:</strong> Provident fund, insurance, and benefits</li>
                        <li><strong>Anti-Discrimination:</strong> Protection against workplace discrimination</li>
                    </ul>
                    
                    <h3>Employer Obligations</h3>
                    <p>Employers have various legal obligations:</p>
                    <ul>
                        <li>Compliance with labor laws and regulations</li>
                        <li>Maintenance of proper employment records</li>
                        <li>Provision of statutory benefits</li>
                        <li>Implementation of workplace safety measures</li>
                        <li>Fair treatment and non-discrimination</li>
                    </ul>
                    
                    <h3>Dispute Resolution</h3>
                    <p>Labor disputes can be resolved through:</p>
                    <ul>
                        <li>Internal grievance procedures</li>
                        <li>Conciliation and mediation</li>
                        <li>Labor courts and tribunals</li>
                        <li>Collective bargaining agreements</li>
                    </ul>
                    
                    <p>Understanding labor law is essential for both employers and employees to maintain harmonious workplace relationships and ensure compliance with legal requirements.</p>
                `,
                category: 'corporate',
                image: '👷',
                date: '2024-12-20',
                author: 'Labor Law Division'
            },
            {
                id: 6,
                title: "Intellectual Property Rights in India",
                excerpt: "Comprehensive guide to protecting intellectual property through patents, trademarks, and copyrights.",
                content: `
                    <h2>Intellectual Property Rights in India</h2>
                    <p>Intellectual Property (IP) rights are crucial for protecting innovation, creativity, and business interests. India has a robust legal framework for IP protection.</p>
                    
                    <h3>Types of Intellectual Property</h3>
                    <ul>
                        <li><strong>Patents:</strong> Protection for inventions and technological innovations</li>
                        <li><strong>Trademarks:</strong> Protection for brand names, logos, and symbols</li>
                        <li><strong>Copyrights:</strong> Protection for literary, artistic, and creative works</li>
                        <li><strong>Trade Secrets:</strong> Protection for confidential business information</li>
                    </ul>
                    
                    <h3>Registration and Protection Process</h3>
                    <p>The IP protection process involves:</p>
                    <ul>
                        <li>Filing applications with appropriate authorities</li>
                        <li>Examination and publication</li>
                        <li>Opposition proceedings</li>
                        <li>Grant of rights and maintenance</li>
                    </ul>
                    
                    <h3>Enforcement and Litigation</h3>
                    <p>IP rights can be enforced through:</p>
                    <ul>
                        <li>Civil litigation for infringement</li>
                        <li>Criminal proceedings for counterfeiting</li>
                        <li>Alternative dispute resolution</li>
                        <li>Border enforcement measures</li>
                    </ul>
                    
                    <p>Proper IP protection is essential for businesses to safeguard their innovations and maintain competitive advantages in the market.</p>
                `,
                category: 'corporate',
                image: '💡',
                date: '2024-12-15',
                author: 'IP Law Team'
            }
        ];
    }
    
    initializeEventListeners() {
        // Search functionality
        document.getElementById('blogSearch').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterBlogs();
        });
        
        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.currentPage = 1;
                this.filterBlogs();
            });
        });
        
        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderBlogs();
                this.renderPagination();
            }
        });
        
        document.getElementById('nextPage').addEventListener('click', () => {
            const maxPages = Math.ceil(this.filteredBlogs.length / this.blogsPerPage);
            if (this.currentPage < maxPages) {
                this.currentPage++;
                this.renderBlogs();
                this.renderPagination();
            }
        });
        
        // Modal close
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                document.getElementById('blogModal').style.display = 'none';
            });
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('blogModal');
            if (e.target === modal) {
                modal.style.display = 'none';
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
    
    filterBlogs() {
        this.filteredBlogs = this.blogData.filter(blog => {
            const matchesCategory = this.currentCategory === 'all' || blog.category === this.currentCategory;
            const matchesSearch = blog.title.toLowerCase().includes(this.searchTerm) || 
                                blog.excerpt.toLowerCase().includes(this.searchTerm);
            return matchesCategory && matchesSearch;
        });
        
        this.currentPage = 1;
        this.renderBlogs();
        this.renderPagination();
    }
    
    renderBlogs() {
        const startIndex = (this.currentPage - 1) * this.blogsPerPage;
        const endIndex = startIndex + this.blogsPerPage;
        const blogsToShow = this.filteredBlogs.slice(startIndex, endIndex);
        
        const blogGrid = document.getElementById('blogGrid');
        blogGrid.innerHTML = blogsToShow.map(blog => `
            <div class="blog-card" onclick="blogPage.openBlogModal(${blog.id})">
                <div class="blog-image">${blog.image}</div>
                <div class="blog-content-card">
                    <h3 class="blog-title">${blog.title}</h3>
                    <p class="blog-excerpt">${blog.excerpt}</p>
                    <div class="blog-meta">
                        <span class="blog-category">${this.getCategoryName(blog.category)}</span>
                        <span class="blog-date">${new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderPagination() {
        const totalPages = Math.ceil(this.filteredBlogs.length / this.blogsPerPage);
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
                        onclick="blogPage.goToPage(${i})">${i}</button>
            `;
        }
        pageNumbers.innerHTML = pageNumbersHTML;
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderBlogs();
        this.renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    openBlogModal(blogId) {
        const blog = this.blogData.find(b => b.id === blogId);
        if (!blog) return;
        
        const modal = document.getElementById('blogModal');
        const content = document.getElementById('blogModalContent');
        
        content.innerHTML = `
            <div class="blog-modal-content">
                <div class="blog-modal-header">
                    <h2 class="blog-modal-title">${blog.title}</h2>
                    <div class="blog-modal-meta">
                        <span>By ${blog.author}</span>
                        <span>${new Date(blog.date).toLocaleDateString()}</span>
                        <span>${this.getCategoryName(blog.category)}</span>
                    </div>
                </div>
                <div class="blog-modal-image">${blog.image}</div>
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
            'real-estate': 'Real Estate'
        };
        return categories[category] || category;
    }
}

// Initialize the blog page when DOM is loaded
let blogPage;
document.addEventListener('DOMContentLoaded', () => {
    blogPage = new BlogPage();
});
