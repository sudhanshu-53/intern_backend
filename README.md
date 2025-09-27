# AI Internship Recommendation Engine - Backend API

A complete Node.js backend API for an AI-powered internship recommendation system with user authentication, profile management, and intelligent matching algorithms.

## 🚀 Features

- **User Authentication**: JWT-based auth with bcrypt password hashing
- **Profile Management**: Detailed user profiles with skills, interests, and education
- **Smart Recommendations**: AI-powered matching algorithm based on user profiles
- **Application System**: Apply for internships and track application status
- **Bookmark System**: Save favorite internships for later
- **Admin Panel**: Admin-only endpoints for managing internships and applications
- **Chatbot Integration**: Ready-to-use chatbot endpoint for AI assistance
- **SQLite Database**: Lightweight, file-based database perfect for prototypes

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd ai-internship-backend
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following variables:
   ```env
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. **Initialize the database:**
   ```bash
   npm run setup
   ```

4. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Public Endpoints

#### Get All Internships
```http
GET /api/internships
```

### Protected User Endpoints
*Requires Authorization header: `Bearer <jwt_token>`*

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer <jwt_token>
```

#### Update User Profile
```http
PUT /api/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "skills": ["JavaScript", "React", "Node.js"],
  "interests": ["Web Development", "Technology"],
  "education": "Bachelor",
  "preferred_location": "San Francisco"
}
```

#### Get Personalized Recommendations
```http
GET /api/recommendations
Authorization: Bearer <jwt_token>
```

#### Apply for Internship
```http
POST /api/applications
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "internship_id": 1
}
```

#### Bookmark/Unbookmark Internship
```http
POST /api/bookmarks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "internship_id": 1
}
```

#### Chat with AI Assistant
```http
POST /api/chat
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "userQuery": "What skills should I learn for software engineering?"
}
```

### Admin Endpoints
*Requires admin role*

#### Create New Internship
```http
POST /api/internships
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "title": "Software Engineering Intern",
  "organization": "TechCorp",
  "location": "San Francisco, CA",
  "duration": "3 months",
  "stipend": "$5000/month",
  "description": "Work on cutting-edge applications",
  "required_skills": ["JavaScript", "React"],
  "interests": ["Web Development"],
  "education_levels": ["Bachelor", "Master"]
}
```

#### Get All Applications
```http
GET /api/applications/admin
Authorization: Bearer <admin_jwt_token>
```

#### Get Dashboard Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer <admin_jwt_token>
```

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `phone` - Phone number
- `password` - Bcrypt hashed password
- `role` - 'student' or 'admin'
- `profile_data` - JSON object with detailed profile

### Internships Table
- `id` - Primary key
- `title` - Internship title
- `organization` - Company/organization name
- `location` - Location of internship
- `duration` - Duration (e.g., "3 months")
- `stipend` - Compensation details
- `description` - Detailed description
- `required_skills` - JSON array of required skills
- `interests` - JSON array of relevant interests
- `education_levels` - JSON array of accepted education levels

### Applications Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `internship_id` - Foreign key to internships
- `status` - 'pending', 'accepted', or 'rejected'
- `applied_date` - Application timestamp

### Bookmarks Table
- `user_id` - Foreign key to users
- `internship_id` - Foreign key to internships
- Composite primary key

## 🤖 AI Recommendation Algorithm

The recommendation system uses a weighted scoring algorithm that considers:

- **Skills Match (40%)**: Compares user skills with required skills
- **Interest Alignment (30%)**: Matches user interests with internship categories
- **Education Level (20%)**: Ensures user meets education requirements
- **Location Preference (10%)**: Considers user's preferred location

Scores are normalized to 0-1 range and the top 5 matches are returned.

## 🔧 Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - API key for Gemini AI integration
- `DATABASE_PATH` - SQLite database file path

### Default Admin Account

- **Email**: admin@example.com
- **Password**: password
- **Role**: admin

*Change this in production!*

## 🚀 Deployment

### Production Checklist

1. **Security**:
   - Change default admin credentials
   - Use strong JWT_SECRET
   - Enable HTTPS
   - Set up proper CORS origins

2. **Database**:
   - Backup SQLite database regularly
   - Consider migrating to PostgreSQL for production

3. **Environment**:
   - Set NODE_ENV=production
   - Configure proper logging
   - Set up monitoring

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Test the health endpoint
curl http://localhost:3000/health

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**Built with ❤️ using Node.js, Express, and SQLite**
