import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: String,
  year: String,
  gpa: String
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  links: {
    github: String,
    demo: String,
    docs: String
  },
  skills: [String],
  featured: { type: Boolean, default: false }
});

const workSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  duration: { type: String, required: true },
  description: String,
  skills: [String]
});

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  title: String,
  bio: String,
  location: String,
  education: [educationSchema],
  skills: {
    technical: [String],
    soft: [String],
    languages: [String]
  },
  projects: [projectSchema],
  work: [workSchema],
  links: {
    github: String,
    linkedin: String,
    portfolio: String,
    resume: String
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
profileSchema.index({ 'skills.technical': 1 });
profileSchema.index({ 'projects.skills': 1 });
profileSchema.index({
  name: 'text',
  bio: 'text',
  'projects.title': 'text',
  'projects.description': 'text'
});

export default mongoose.model('Profile', profileSchema);