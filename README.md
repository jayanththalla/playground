# Me-API Playground

A full-stack application showcasing a personal profile API with search capabilities and a clean React frontend.

## 🚀 Live Demo

- **Frontend**: [Coming Soon - Deploy URL]
- **API Base**: [Coming Soon - Backend URL]
- **Health Check**: [Coming Soon - Backend URL]/health

## 📋 Resume

**[Resume Link - Coming Soon]**

## 🏗️ Architecture

### System Overview

┌─────────────────┐ HTTP/REST ┌─────────────────┐ Mongoose ┌─────────────────┐
│ │ API Calls │ │ ODM │ │
│ React Frontend │◄──────────────► │ Express.js API │◄──────────────►│ MongoDB Atlas │
│ (Port 5173) │ │ (Port 3001) │ │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘

### Backend

- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Features**: RESTful API, rate limiting, CORS, security headers
- **Deployment**: Ready for cloud deployment (Heroku, Railway, etc.)

### Frontend

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Features**: Responsive design, real-time search, skill filtering

### API Endpoints

#### Profile Management

- `GET /api/profile` - Get profile data
- `POST /api/profile` - Create profile (rate limited)
- `PUT /api/profile` - Update profile (rate limited)
- `DELETE /api/profile` - Delete profile (rate limited)

#### Query Endpoints

- `GET /api/projects?skill={skill}` - Filter projects by skill
- `GET /api/skills/top?limit={number}` - Get top skills ranked by usage
- `GET /api/search?q={query}` - Full-text search across profile data

#### System

- `GET /health` - Health check endpoint

## 🛠️ Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and install dependencies**:

   ```bash
   git clone [repository-url]
   cd me-api-playground
   npm install
   npm run backend:install
   ```

2. **Database setup**:

   ```bash
   # Start MongoDB locally (if using local installation)
   mongod

   # OR configure MongoDB Atlas connection in backend/.env
   ```

3. **Environment configuration**:

   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB connection string
   ```

4. **Seed the database**:

   ```bash
   npm run backend:seed
   ```

5. **Start development servers**:
   ```bash
   npm run dev
   ```

This will start both the backend (port 3001) and frontend (port 5173).

## 🗄️ Database Schema

### MongoDB Collections

#### Profile Collection

```javascript
{
  name: String (required),
  email: String (required, unique),
  title: String,
  bio: String,
  location: String,
  education: [
    {
      institution: String (required),
      degree: String (required),
      field: String,
      year: String,
      gpa: String
    }
  ],
  skills: {
    technical: [String],
    soft: [String],
    languages: [String]
  },
  projects: [
    {
      title: String (required),
      description: String (required),
      links: {
        github: String,
        demo: String,
        docs: String
      },
      skills: [String],
      featured: Boolean (default: false)
    }
  ],
  work: [
    {
      company: String (required),
      position: String (required),
      duration: String (required),
      description: String,
      skills: [String]
    }
  ],
  links: {
    github: String,
    linkedin: String,
    portfolio: String,
    resume: String
  },
  timestamps: true
}
```

### Indexes

- `skills.technical: 1` - For skill-based queries
- `projects.skills: 1` - For project filtering
- Text index on `name, bio, projects.title, projects.description` - For full-text search

## 🔧 API Examples

### Sample cURL Commands

#### Get Profile

```bash
curl -X GET http://localhost:3001/api/profile
```

#### Filter Projects by Skill

```bash
curl -X GET "http://localhost:3001/api/projects?skill=React"
```

#### Get Top Skills

```bash
curl -X GET "http://localhost:3001/api/skills/top?limit=5"
```

#### Search

```bash
curl -X GET "http://localhost:3001/api/search?q=full%20stack"
```

#### Health Check

```bash
curl -X GET http://localhost:3001/health
```

#### Update Profile

```bash
curl -X PUT http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "title": "Senior Developer"
  }'
```

### Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Me-API Playground",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/profile",
          "host": ["{{baseUrl}}"],
          "path": ["api", "profile"]
        }
      }
    },
    {
      "name": "Filter Projects by Skill",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/projects?skill=React",
          "host": ["{{baseUrl}}"],
          "path": ["api", "projects"],
          "query": [{ "key": "skill", "value": "React" }]
        }
      }
    },
    {
      "name": "Get Top Skills",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/skills/top?limit=5",
          "host": ["{{baseUrl}}"],
          "path": ["api", "skills", "top"],
          "query": [{ "key": "limit", "value": "5" }]
        }
      }
    },
    {
      "name": "Search",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/search?q=developer",
          "host": ["{{baseUrl}}"],
          "path": ["api", "search"],
          "query": [{ "key": "q", "value": "developer" }]
        }
      }
    },
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001"
    }
  ]
}
```

## 🚀 Production Deployment

### Backend Deployment (Heroku example)

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-me-api-backend

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
heroku config:set NODE_ENV=production

# Deploy
git subtree push --prefix=backend heroku main
```

### Frontend Deployment (Vercel example)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## ⚠️ Known Limitations

1. **Single Profile**: Currently supports only one profile per database
2. **No Authentication**: Write operations are rate-limited but not authenticated
3. **Basic Search**: Full-text search is basic; could be enhanced with Elasticsearch
4. **No Pagination**: Large datasets might need pagination implementation
5. **Error Handling**: Basic error responses; could be more detailed
6. **Validation**: Minimal input validation; production would need comprehensive validation
7. **Testing**: No automated tests included (recommended for production)

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configured for frontend domain
- **Rate Limiting**: 100 requests per 15 minutes (general), 20 per 15 minutes (write operations)
- **Input Sanitization**: Basic MongoDB injection prevention via Mongoose

## 📊 Monitoring

- Health endpoint provides system status, database connectivity, and uptime
- Request logging with duration tracking
- Error logging for debugging

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: Nodemon, ESLint, Concurrently

---

Built with ❤️ for backend assessment - showcasing full-stack development skills with modern technologies and best practices.
