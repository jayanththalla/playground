# Database Schema

## MongoDB Collections

### Profile Collection

The application uses a single MongoDB collection called `profiles` to store user profile information.

#### Schema Structure

```javascript
{
  _id: ObjectId,
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
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

#### Indexes

The following indexes are created for optimal query performance:

1. **Skills Index**: `{ "skills.technical": 1 }`
   - Purpose: Fast filtering of projects by technical skills
   - Used by: `/api/projects?skill=` endpoint

2. **Project Skills Index**: `{ "projects.skills": 1 }`
   - Purpose: Efficient project filtering by skills
   - Used by: Project filtering and top skills calculation

3. **Text Search Index**: 
   ```javascript
   {
     name: 'text',
     bio: 'text',
     'projects.title': 'text',
     'projects.description': 'text'
   }
   ```
   - Purpose: Full-text search across profile content
   - Used by: `/api/search?q=` endpoint

#### Constraints

- **Email Uniqueness**: Only one profile per email address
- **Required Fields**: name, email, education.institution, education.degree, projects.title, projects.description, work.company, work.position, work.duration
- **Single Profile**: Application currently supports only one profile per database

#### Sample Data Structure

```json
{
  "name": "Alex Johnson",
  "email": "alex.johnson@example.com",
  "title": "Full Stack Developer",
  "bio": "Passionate full-stack developer with 5+ years of experience...",
  "location": "San Francisco, CA",
  "education": [
    {
      "institution": "University of California, Berkeley",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "year": "2019",
      "gpa": "3.8"
    }
  ],
  "skills": {
    "technical": ["JavaScript", "React", "Node.js", "MongoDB"],
    "soft": ["Problem Solving", "Team Leadership"],
    "languages": ["English (Native)", "Spanish (Conversational)"]
  },
  "projects": [
    {
      "title": "E-Commerce Platform",
      "description": "Full-stack e-commerce solution...",
      "links": {
        "github": "https://github.com/alexjohnson/ecommerce-platform",
        "demo": "https://ecommerce-demo.alexjohnson.dev"
      },
      "skills": ["React", "Node.js", "MongoDB"],
      "featured": true
    }
  ],
  "work": [
    {
      "company": "TechCorp Solutions",
      "position": "Senior Full Stack Developer",
      "duration": "2022 - Present",
      "description": "Lead development of customer-facing web applications...",
      "skills": ["React", "Node.js", "AWS"]
    }
  ],
  "links": {
    "github": "https://github.com/alexjohnson",
    "linkedin": "https://linkedin.com/in/alexjohnson-dev",
    "portfolio": "https://alexjohnson.dev",
    "resume": "https://alexjohnson.dev/resume.pdf"
  }
}
```

## Query Patterns

### Common Queries

1. **Get Profile**: `db.profiles.findOne()`
2. **Filter Projects by Skill**: Uses array filtering on `projects.skills`
3. **Top Skills**: Aggregation across `projects.skills`, `work.skills`, and `skills.technical`
4. **Full-text Search**: Uses MongoDB text search on indexed fields

### Performance Considerations

- Text search is case-insensitive and supports partial matches
- Skill filtering uses case-insensitive string matching
- Indexes ensure fast query performance even with large datasets
- Single document design minimizes database queries