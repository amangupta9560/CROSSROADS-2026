<h1 align="center" style="color:#E91E63; font-size: 44px;">🎓 Crossroads 2026 – Technical Fest Registration Portal</h1>
<h3 align="center" style="color:gray;">
A full-stack MERN web application built to manage a college technical fest, allowing students to explore events, view schedules, and register online while enabling administrators to manage and export participant data efficiently.
</h3>

<p align="center">
  <a href="https://crossroads-hiet.netlify.app/"><b>🌐 Live Website</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Email-Nodemailer-red?style=for-the-badge" />
</p>

<hr>

<h2>📚 Table of Contents</h2>
<ul>
  <li><a href="#about">About the Platform</a></li>
  <li><a href="#features">Platform Features</a></li>
  <li><a href="#roles">User Roles</a></li>
  <li><a href="#tech">Tech Stack</a></li>
  <li><a href="#frontend-deps">Frontend Dependencies</a></li>
  <li><a href="#backend-deps">Backend Dependencies</a></li>
  <li><a href="#structure">Project Structure</a></li>
  <li><a href="#env">Environment Variables</a></li>
  <li><a href="#scripts">Available Scripts</a></li>
  <li><a href="#api">Backend API Overview</a></li>
  <li><a href="#security">Security Features</a></li>
  <li><a href="#performance">Performance Optimizations</a></li>
  <li><a href="#enhancements">Future Enhancements</a></li>
  <li><a href="#screenshots">Screenshots</a></li>
  <li><a href="#creator">Creator</a></li>
</ul>

<hr>

<h2 id="about">🧭 About the Platform</h2>
<p>
Crossroads 2026 is a centralized technical fest management system designed to simplify how students discover and register for college events. The platform provides complete details about each event including descriptions, dates, venues, judging criteria, and schedules.
</p>
<p>
Students can register online in just a few steps and receive confirmation emails instantly. On the administrative side, organizers have access to a secure dashboard where they can view all registrations and export participant data into Excel sheets for offline coordination.
</p>
<p>
This system replaces manual paperwork with a fast, reliable, and fully digital registration workflow.
</p>

<hr>

<h2 id="features">✨ Platform Features</h2>
<ul>
<li>📌 Detailed event information pages</li>
<li>📅 Structured and easy-to-read event schedule</li>
<li>📝 Online event registration system</li>
<li>📧 Automated confirmation emails via Nodemailer</li>
<li>📬 Contact form integrated using Getform.io</li>
<li>🔐 Secure Admin Login with authentication</li>
<li>📊 Admin Dashboard to monitor registrations</li>
<li>📊 Real-time registration analytics</li>
<li>📥 Export registration data to Excel format</li>
<li>📱 Fully responsive modern UI</li>
</ul>

<hr>

<h2 id="roles">👥 User Roles</h2>
<table border="1" cellpadding="8">
<tr><th>Role</th><th>Access</th></tr>
<tr><td>Visitor / Student</td><td>View events, schedules, and register for events</td></tr>
<tr><td>Admin</td><td>Login securely, view registrations, download Excel reports</td></tr>
</table>

<hr>

<h2 id="tech">🧰 Tech Stack</h2>
<table border="1" cellpadding="8">
<tr><th>Layer</th><th>Technology</th></tr>
<tr><td>Frontend</td><td>React, Vite, Tailwind CSS</td></tr>
<tr><td>Backend</td><td>Node.js, Express.js</td></tr>
<tr><td>Database</td><td>MongoDB with Mongoose</td></tr>
<tr><td>Authentication</td><td>JWT (Admin)</td></tr>
<tr><td>Email Service</td><td>Nodemailer</td></tr>
<tr><td>File Export</td><td>ExcelJS</td></tr>
</table>

<hr>

<h2 id="frontend-deps">📦 Frontend Dependencies</h2>
<table border="1" cellpadding="8">
<tr><th>Package</th><th>Purpose</th></tr>
<tr><td>react-router-dom</td><td>Routing</td></tr>
<tr><td>axios</td><td>API Requests</td></tr>
<tr><td>react-hook-form</td><td>Form Handling</td></tr>
<tr><td>framer-motion / gsap</td><td>Animations</td></tr>
<tr><td>react-hot-toast / toastify</td><td>Notifications</td></tr>
<tr><td>lucide-react / react-icons</td><td>Icons</td></tr>
<tr><td>tailwindcss</td><td>Styling</td></tr>
</table>

<hr>

<h2 id="backend-deps">📦 Backend Dependencies</h2>
<table border="1" cellpadding="8">
<tr><th>Package</th><th>Purpose</th></tr>
<tr><td>express</td><td>Server Framework</td></tr>
<tr><td>mongoose</td><td>MongoDB ORM</td></tr>
<tr><td>jsonwebtoken</td><td>Admin Authentication</td></tr>
<tr><td>nodemailer</td><td>Email Service</td></tr>
<tr><td>exceljs</td><td>Excel Export</td></tr>
<tr><td>multer</td><td>File Upload Handling</td></tr>
<tr><td>cors</td><td>Cross-Origin Requests</td></tr>
<tr><td>dotenv</td><td>Environment Variables</td></tr>
</table>

<hr>

<h2 id="structure">🗂️ Project Structure</h2>

<pre>
CROSSROADS-2026/
├── FRONTEND/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── Teams/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── RegistrationForm.jsx
│   │   ├── Pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Schedule.jsx
│   │   │   ├── Team.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── netlify.toml
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│
├── BACKEND/
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   ├── emailTemplates.js
│   │   ├── nodemailer.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── registrationController.js
│   ├── middleware/
│   │   ├── auth.js
│   ├── models/
│   │   ├── AdMadShow.js
│   │   ├── CodePuzzle.js
│   │   ├── Counter.js
│   │   ├── CulturalEvents.js
│   │   ├── DanceCompetition.js
│   │   ├── FoodWithoutFire.js
│   │   ├── NukkadNatak.js
│   │   ├── ProjectExhibition.js
│   │   ├── RangoliCompetition.js
│   │   ├── Registration.js
│   │   ├── RoboRace.js
│   │   ├── RockBand.js
│   │   ├── ShortFilmMaker.js
│   │   ├── Singing.js
│   │   ├── TechnicalPoster.js
│   │   ├── TreasureHunt.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── registrationRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
</pre>

<hr>

<h2 id="env">🔐 Environment Variables</h2>
<table border="1" cellpadding="8">
<tr><th>File</th><th>Variable</th><th>Description</th></tr>
<tr><td>Backend</td><td>MONGO_URI</td><td>MongoDB database connection string</td></tr>
<tr><td>Backend</td><td>JWT_SECRET</td><td>Secret key used to sign and verify admin authentication tokens</td></tr>
<tr><td>Backend</td><td>EMAIL_USER</td><td>Email address used to send registration confirmation emails</td></tr>
<tr><td>Backend</td><td>EMAIL_PASS</td><td>Email account password or app-specific password for Nodemailer</td></tr>
<tr><td>Backend</td><td>PORT</td><td>Port number on which the backend server runs</td></tr>
<tr><td>Backend</td><td>CLOUDINARY_CLOUD_NAME</td><td>Cloudinary cloud name for media storage</td></tr>
<tr><td>Backend</td><td>CLOUDINARY_API_KEY</td><td>Cloudinary API key for authentication</td></tr>
<tr><td>Backend</td><td>CLOUDINARY_API_SECRET</td><td>Cloudinary API secret for secure uploads</td></tr>
<tr><td>Backend</td><td>ADMIN_USERNAME</td><td>Username used for admin panel login</td></tr>
<tr><td>Backend</td><td>ADMIN_PASSWORD</td><td>Password used for admin panel login (should be securely stored)</td></tr>
<tr><td>Frontend</td><td>VITE_BACKEND_URL</td><td>Base URL of the backend API used by the frontend</td></tr>

</table>


<hr>

<h2 id="scripts">📜 Available Scripts</h2>
<table border="1" cellpadding="8">
<tr><th>Command</th><th>Description</th></tr>
<tr><td>npm run dev</td><td>Start frontend dev server</td></tr>
<tr><td>npm run build</td><td>Build frontend for production</td></tr>
<tr><td>npm start</td><td>Run backend server</td></tr>
</table>

<hr>

<h2 id="api">🔗 Backend API Overview</h2>
<table border="1" cellpadding="8">
<tr><th>Route</th><th>Purpose</th></tr>
<tr><td>/api/registrations</td><td>Student event registrations</td></tr>
<tr><td>/api/admin</td><td>Admin login & data management</td></tr>
</table>

<hr>

<h2 id="security">🔐 Security Features</h2>
<ul>
<li>JWT-based Admin Authentication</li>
<li>Protected Admin Routes</li>
<li>Environment Variable Protection</li>
<li>Server-side validation</li>
</ul>

<hr>

<h2 id="performance">⚡ Performance Optimizations</h2>
<ul>
<li>Fast builds with Vite</li>
<li>Optimized React component structure</li>
<li>Lazy loading where applicable</li>
<li>Efficient API handling</li>
</ul>

<hr>

<h2 id="enhancements">🚀 Future Enhancements</h2>
<ul>
<li>🎟️ QR-based event entry system</li>
<li>📱 SMS notification system</li>
<li>👥 Multi-admin roles</li>
</ul>

<hr>

<h2 id="creator" align="center" style="color:#E91E63; font-size:34px;">👨‍💻 Built & Designed By</h2>

<p align="center" style="font-size:22px; font-weight:bold; color:#111827; margin-bottom:4px;">
  Aman Gupta
</p>

<p align="center" style="font-size:15px; color:#6b7280; margin-bottom:14px;">
  Full Stack Web Developer • MERN Stack Specialist • Problem Solver
</p>

<p align="center" style="max-width:750px; margin:auto; font-size:16px; color:#374151; line-height:1.7;">
  I enjoy building real-world, scalable web applications that combine clean design,
  strong performance, and meaningful functionality. <b>Crossroads 2026</b> reflects my
  passion for creating digital systems that simplify processes and improve user
  experiences through modern web technologies.
</p>

<p align="center" style="margin-top:16px; font-size:15px; color:#6b7280;">
  🚀 Turning ideas into impactful digital products &nbsp; | &nbsp;
  💡 Constant learner & builder &nbsp; | &nbsp;
  🎯 Focused on practical innovation
</p>

<br>

<p align="center">
  <a href="https://github.com/amangupta9454" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-amangupta9454-black?style=for-the-badge&logo=github" />
  </a>
  <a href="https://linkedin.com/in/amangupta9454" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin" />
  </a>
  <a href="mailto:ag0567688@gmail.com">
    <img src="https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail" />
  </a>
  <a href="http://gupta-aman-portfolio.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-Visit-0A66C2?style=for-the-badge&logo=google-chrome" />
  </a>
</p>

<br>

<p align="center">
  <img src="https://img.shields.io/badge/Open%20Source-Contributor-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Made%20with-MERN-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge" />
</p>

<p align="center" style="margin-top:18px; font-size:15px; color:#374151;">
  ⭐ If this project inspired you or helped you, consider starring the repository —  
  your support keeps innovation going!
</p>

<hr>

<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 id="screenshots" style="color: #4CAF50; font-size: 28px; font-weight: bold; margin-bottom: 20px;">📸 Screenshots</h2>
   <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
    Explore the Crossroads 2026 platform to discover exciting technical and cultural events, check detailed schedules, learn event rules and judging criteria, and register online with ease. Stay updated with fest announcements and connect with organizers through a fast, simple, and student-friendly interface designed for a smooth digital fest experience. 🎓🚀
</p>
    <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
        <div style="flex: 1 1 280px; background-color: #fff; padding: 15px; text-align: center; border: 1px solid #ddd;">
            <h3 style="color: #333; font-size: 20px; font-weight: bold; margin: 0 0 10px;">🏠 Home Page</h3>
            <img src="https://res.cloudinary.com/dnmtainqq/image/upload/v1769613340/Screenshot_2026-01-28_204216_sxitd1.png" alt="Home Page" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
        </div>
        <div style="flex: 1 1 280px; background-color: #fff; padding: 15px; text-align: center; border: 1px solid #ddd;">
            <h3 style="color: #333; font-size: 20px; font-weight: bold; margin: 0 0 10px;">ℹ️ About Us</h3>
            <img src="https://res.cloudinary.com/dnmtainqq/image/upload/v1769613358/Screenshot_2026-01-28_204228_xtjbd0.png" alt="About Us" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
        </div>
        <div style="flex: 1 1 280px; background-color: #fff; padding: 15px; text-align: center; border: 1px solid #ddd;">
            <h3 style="color: #333; font-size: 20px; font-weight: bold; margin: 0 0 10px;">🛠️ Our Events</h3>
            <img src="https://res.cloudinary.com/dnmtainqq/image/upload/v1769613362/Screenshot_2026-01-28_204239_dlw4ju.png" alt="Our Services" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
        </div>
        <div style="flex: 1 1 280px; background-color: #fff; padding: 15px; text-align: center; border: 1px solid #ddd;">
            <h3 style="color: #333; font-size: 20px; font-weight: bold; margin: 0 0 10px;">📞 Contact Us </h3>
            <img src="https://res.cloudinary.com/dnmtainqq/image/upload/v1769613382/Screenshot_2026-01-28_204306_aqw5nn.png" alt="Contact Us" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
        </div>
        <div style="flex: 1 1 280px; background-color: #fff; padding: 15px; text-align: center; border: 1px solid #ddd;">
            <h3 style="color: #333; font-size: 20px; font-weight: bold; margin: 0 0 10px;">📜 Dashboard</h3>
            <img src="https://res.cloudinary.com/dnmtainqq/image/upload/v1769613394/Screenshot_2026-01-28_204448_lprzxa.png" alt="Dashboard" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
        </div>
         <div style="flex: 1 1 280px; background-color: #fff; padding: 15px; text-align: center; border: 1px solid #ddd;">
            <h3 style="color: #333; font-size: 20px; font-weight: bold; margin: 0 0 10px;">📜 Login</h3>
            <img src="https://res.cloudinary.com/dnmtainqq/image/upload/v1769613396/Screenshot_2026-01-28_204406_ygwgko.png" alt="Login Page" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
        </div>
        <div style="flex: 1 1 280px; background-color: #fff; padding: 15px; text-align: center; border: 1px solid #ddd;">
            <h3 style="color: #333; font-size: 20px; font-weight: bold; margin: 0 0 10px;">📜 Events Schedule </h3>
            <img src="https://res.cloudinary.com/dnmtainqq/image/upload/v1769613374/Screenshot_2026-01-28_204250_txdn7o.png" alt="Navbar & Footer" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
        </div>
         <div style="flex: 1 1 280px; background-color: #fff; padding: 15px; text-align: center; border: 1px solid #ddd;">
            <h3 style="color: #333; font-size: 20px; font-weight: bold; margin: 0 0 10px;">📜 Our Teams </h3>
            <img src="https://res.cloudinary.com/dnmtainqq/image/upload/v1769613394/Screenshot_2026-01-28_204332_xjoepb.png" alt="Navbar & Footer" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
        </div>
        <div style="flex: 1 1 280px; background-color: #fff; padding: 15px; text-align: center; border: 1px solid #ddd;">
            <h3 style="color: #333; font-size: 20px; font-weight: bold; margin: 0 0 10px;">ℹ️Event Registration</h3>
            <img src="https://res.cloudinary.com/dnmtainqq/image/upload/v1769613388/Screenshot_2026-01-28_204345_sot1g5.png" alt="About Us" style="max-width: 100%; height: auto; border: 1px solid #ddd;">
        </div>
    </div>
</div>

<hr>
