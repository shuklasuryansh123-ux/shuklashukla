class AdminLite {
	constructor() {
		this.loggedIn = false;
	}

	async login() {
		const email = document.getElementById('email').value.trim();
		const password = document.getElementById('password').value.trim();
		const status = document.getElementById('status');
		status.textContent = 'Logging in...';
		try {
			const res = await fetch('/api/admin/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			if (!res.ok) throw new Error('Invalid credentials');
			this.loggedIn = true;
			document.getElementById('login').style.display = 'none';
			document.getElementById('panel').style.display = 'block';
			status.textContent = '';
		} catch (e) {
			status.textContent = 'Login failed';
		}
	}

	async saveSection(section) {
		if (!this.loggedIn) return;
		let payload = {};
		if (section === 'hero') {
			payload = {
				title: document.getElementById('heroTitle').value,
				subtitle: document.getElementById('heroSubtitle').value
			};
		}
		if (section === 'about') {
			payload = {
				title: document.getElementById('aboutTitle').value,
				content: document.getElementById('aboutContent').value
			};
		}
		const res = await fetch(`/api/content/${encodeURIComponent(section)}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		alert(res.ok ? 'Saved and committed to GitHub' : 'Save failed');
	}

	async createBlog() {
		if (!this.loggedIn) return;
		const title = document.getElementById('blogTitle').value.trim();
		const content = document.getElementById('blogContent').value.trim();
		if (!title || !content) return alert('Title and content required');
		// Load existing blog
		const current = await fetch('/api/content/blog').then(r => r.json()).catch(() => ({ blogPosts: [] }));
		const blogPosts = current.blogPosts || [];
		const nextId = (blogPosts.reduce((m,p)=>Math.max(m,p.id||0),0)||0)+1;
		const post = { id: nextId, title, excerpt: content.slice(0,160)+'...', content, category: 'legal', image: '📚', date: new Date().toISOString().slice(0,10), author: 'Legal Team' };
		const updated = { ...current, blogPosts: [post, ...blogPosts], lastUpdated: new Date().toISOString() };
		const res = await fetch('/api/content/blog', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updated)
		});
		alert(res.ok ? 'Blog published and committed to GitHub' : 'Publish failed');
	}

	async uploadFile() {
		const input = document.getElementById('fileInput');
		const file = input.files && input.files[0];
		if (!file) return alert('Choose an image');
		const b64 = await new Promise((resolve,reject)=>{
			const r = new FileReader();
			r.onload=()=>resolve(r.result);
			r.onerror=reject;
			r.readAsDataURL(file);
		});
		const rel = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
		const res = await fetch('/api/upload', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ path: rel, base64: b64, contentType: file.type })
		});
		const data = await res.json();
		document.getElementById('uploadResult').textContent = res.ok ? `Uploaded: ${data.url}` : 'Upload failed';
	}
}

const adminLite = new AdminLite();