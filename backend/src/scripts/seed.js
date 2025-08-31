import mongoose from 'mongoose';
import Profile from '../models/Profile.js';
import connectDB from '../config/database.js';

const sampleProfile = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  title: "Software Engineer",
  bio: "Curious engineer who loves building web apps and learning new tech.",
  location: "Bangalore, India",
  education: [
    {
      institution: "IIT Bombay",
      degree: "B.Tech",
      field: "Computer Science",
      year: "2021",
      gpa: "3.7"
    }
  ],
  skills: {
    technical: ["JavaScript", "React", "Node.js", "MongoDB", "Python"],
    soft: ["Problem Solving", "Teamwork", "Adaptability"],
    languages: ["English", "Hindi"]
  },
  projects: [
    {
      title: "Portfolio Website",
      description: "Personal portfolio built with React and Tailwind CSS.",
      links: {
        github: "https://github.com/janedoe/portfolio",
        demo: "https://janedoe.dev"
      },
      skills: ["React", "Tailwind", "Netlify"],
      featured: true
    }
  ],
  work: [
    {
      company: "TechStart",
      position: "Software Engineer",
      duration: "2021 - Present",
      description: "Developed web apps and APIs for client projects.",
      skills: ["React", "Node.js", "MongoDB"]
    }
  ],
  links: {
    github: "https://github.com/janedoe",
    linkedin: "https://linkedin.com/in/janedoe",
    portfolio: "https://janedoe.dev",
    resume: "https://janedoe.dev/resume.pdf"
  }
};



async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await Profile.deleteMany({});
    console.log('Cleared existing profile data');

    // Insert sample profile
    const profile = new Profile(sampleProfile);
    await profile.save();
    console.log('Sample profile created successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();