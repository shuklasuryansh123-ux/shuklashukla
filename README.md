# 🏛️ Shukla & Shukla Associates - Law Firm Website

A modern, responsive law firm website with a comprehensive admin panel for content management. Built with HTML, CSS, JavaScript, and Node.js.

## ✨ Features

### 🌐 Website Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Minimalistic Black & White Theme**: Professional and elegant design
- **Multiple Sections**: Hero, About, Founders, Practice Areas, Blog, Gallery, Reviews, FAQ, Contact
- **Interactive Elements**: Modals, animations, smooth scrolling
- **Rich Text Editor**: For blog posts and content management
- **Social Media Integration**: WhatsApp, LinkedIn, Instagram, Google Business
- **Contact Forms**: With validation and submission handling

### 🛠️ Admin Panel Features
- **Secure Login System**: Email/password authentication
- **Password Reset**: Email-based password recovery
- **Content Management**: Edit all website sections
- **Rich Text Editing**: Full formatting capabilities
- **File Management**: Upload and manage images
- **Real-time Updates**: Changes reflect immediately on the website
- **Backup & Restore**: Export/import website data
- **GitHub Integration**: Automatic deployment to GitHub
- **Deployment Status**: Monitor deployment progress

### 📱 Pages
- **Home Page** (`index.html`): Main landing page with all sections
- **Blog Page** (`blog.html`): Dedicated blog listing with search/filter
- **Gallery Page** (`gallery.html`): Photo gallery with modal view
- **Practice Areas** (`practice-areas.html`): Detailed practice area descriptions
- **Notepad** (`more.html`): Rich text editor for notes
- **Admin Panel** (`admin.html`): Complete website management
- **Password Reset** (`admin-reset.html`): Secure password recovery

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/shukla-law-firm.git
   cd shukla-law-firm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the website**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin.html
   - Test page: http://localhost:3000/test

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# GitHub Integration (Optional)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO=your-username/shukla-law-firm
GITHUB_BRANCH=main

# Email Configuration (Optional)
EMAIL_USER=shukla.suryansh123@gmail.com
EMAIL_PASS=your_app_password

# Deployment Configuration (Optional)
DEPLOYMENT_WEBHOOK_URL=your_render_webhook_url
RAILWAY_TOKEN=your_railway_token
RAILWAY_SERVICE_ID=your_railway_service_id

# Site Configuration
SITE_URL=http://localhost:3000
```

### Admin Panel Credentials
- **Email**: `shukla.suryansh123@gmail.com`
- **Password**: `12032003`

## 📁 Project Structure

```
shukla-law-firm/
├── content/                 # Content files (JSON)
│   ├── hero.json
│   ├── about.json
│   ├── founders.json
│   ├── practice-areas.json
│   ├── blog.json
│   ├── gallery.json
│   ├── contact.json
│   └── settings.json
├── services/               # Backend services
│   ├── github-service.js
│   └── password-reset.js
├── index.html             # Main website
├── admin.html             # Admin panel
├── admin-reset.html       # Password reset page
├── blog.html              # Blog page
├── gallery.html           # Gallery page
├── practice-areas.html    # Practice areas page
├── more.html              # Notepad page
├── styles.css             # Main stylesheet
├── admin.css              # Admin panel styles
├── script.js              # Main JavaScript
├── admin.js               # Admin panel JavaScript
├── server.js              # Express server
├── package.json           # Dependencies
└── README.md              # This file
```

## 🎨 Customization

### Styling
- **Main Styles**: Edit `styles.css` for website appearance
- **Admin Styles**: Edit `admin.css` for admin panel appearance
- **Colors**: Modify CSS custom properties in `styles.css`
- **Fonts**: Change font imports in HTML files

### Content
- **Static Content**: Edit JSON files in `content/` directory
- **Dynamic Content**: Use admin panel for real-time updates
- **Images**: Replace placeholder images in gallery and blog sections

### Functionality
- **JavaScript**: Modify `script.js` for website functionality
- **Admin Logic**: Edit `admin.js` for admin panel features
- **Server**: Update `server.js` for backend functionality

## 🚀 Deployment

### Render Deployment

1. **Connect to GitHub**
   - Push your code to GitHub
   - Connect your repository to Render

2. **Configure Environment Variables**
   - Add all required environment variables in Render dashboard

3. **Deploy**
   - Render will automatically deploy your application

### Railway Deployment

1. **Connect Repository**
   - Connect your GitHub repository to Railway

2. **Set Environment Variables**
   - Configure all environment variables in Railway dashboard

3. **Deploy**
   - Railway will automatically deploy your application

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload files**
   - Upload all files to your hosting provider

3. **Configure server**
   - Set up Node.js environment
   - Configure environment variables
   - Start the server

## 🔐 Security Features

- **Password Reset**: Secure email-based password recovery
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Configured for security
- **Helmet.js**: Security headers
- **Rate Limiting**: Protection against abuse
- **Environment Variables**: Secure configuration management

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `EMAIL_PASS` environment variable

### Email Templates
- Password reset emails are automatically generated
- Professional HTML templates included
- Customizable styling and content

## 🔄 GitHub Integration

### Setup
1. Create GitHub personal access token
2. Configure repository settings
3. Set environment variables

### Features
- **Automatic Deployment**: Changes trigger automatic deployment
- **File Management**: Update content files via API
- **Version Control**: Track all changes in Git
- **Backup**: Automatic backup to GitHub

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start development server
npm run dev        # Start with nodemon (auto-restart)
npm run build      # Build for production
npm test           # Run tests (if configured)
```

### Adding New Features
1. **Frontend**: Add HTML/CSS/JS files
2. **Backend**: Add routes to `server.js`
3. **Admin**: Add functionality to `admin.js`
4. **Content**: Add JSON files to `content/` directory

## 📊 Monitoring

### Health Check
- Endpoint: `/health`
- Returns server status and uptime
- Useful for monitoring services

### Logs
- Server logs in console
- Error tracking and debugging
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

**Admin Panel Not Loading**
- Check if server is running
- Verify admin credentials
- Check browser console for errors

**Password Reset Not Working**
- Verify email configuration
- Check environment variables
- Ensure email service is working

**GitHub Integration Issues**
- Verify GitHub token permissions
- Check repository access
- Validate environment variables

### Getting Help
- Check the documentation
- Review error logs
- Contact support team

## 🔄 Updates

### Version History
- **v1.0.0**: Initial release with basic features
- **v1.1.0**: Added admin panel and content management
- **v1.2.0**: Added GitHub integration and deployment
- **v1.3.0**: Added password reset functionality

### Upcoming Features
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Client portal
- [ ] Online consultation booking
- [ ] Payment integration

---

**Built with ❤️ for Shukla & Shukla Associates**

For more information, visit: [Website URL]
Contact: shukla.suryansh123@gmail.com
