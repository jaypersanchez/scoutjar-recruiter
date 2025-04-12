# LooKK

## Overview
ScoutJar is a recruitment platform that connects **Talent Scouts** (recruiters) with **Talents** (job seekers). The application allows users to sign in using social authentication and navigate to their respective dashboards.

## Features
- **Role Selection**: Users can choose to sign in as either a **Talent Scout** or **Talent**.
- **Social Authentication**: Users can sign in using Google, LinkedIn, X (Twitter), or Instagram.
- **Role-Based Navigation**: Once authenticated, users are redirected to their respective dashboards.
- **Modern UI Design**: Styled to match a professional recruitment platform, following LinkedIn and Upwork themes.

## Folder Structure
```
/components
  /Talent
    - index.js
  /TalentScout
    - index.js
/public
/src
  - App.js
  - App.css
  - index.js
  - README.md
```
## Example of .env content

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_SCOUTJAR_SERVER_BASE_URL="http://localhost:"
VITE_SCOUTJAR_SERVER_BASE_PORT=5000
VITE_SCOUTJAR_AI_BASE_URL="http://localhost:"
VITE_SCOUTJAR_AI_BASE_URL=5001

## Installation & Setup
### Prerequisites
- **Node.js** (v18.20.17 or later)
- **npm** (installed with Node.js)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/scoutjar.git
   cd scoutjar
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Install React Router:
   ```sh
   npm install react-router-dom
   ```
4. Start the development server:
   ```sh
   npm start
   ```

## Usage
### Selecting a Role
- On the homepage, users can select either **Talent Scout** or **Talent**.
- Clicking any social sign-in button will navigate the user to the appropriate dashboard.

### User Dashboards
- **Talent Scout Dashboard**: Designed for recruiters to find talent.
- **Talent Dashboard**: Provides job seekers access to opportunities.

## Technologies Used
- **React.js**: Frontend framework
- **React Router**: Navigation and routing
- **Firebase Authentication**: (To be implemented) for handling social logins
- **CSS**: Styling based on LinkedIn and Upwork themes

## Future Improvements
- **Implement Firebase Authentication** for actual user sign-in
- **Enhance Dashboards** with interactive job search and management features
- **Add API Integration** to fetch real job listings and applications

## Contributors
- **[Your Name]** - Developer

## License
This project is licensed under the **MIT License**.

