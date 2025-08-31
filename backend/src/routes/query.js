import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

// GET /api/projects?skill={skill} - Filter projects by skill
router.get('/projects', async (req, res) => {
  try {
    const { skill } = req.query;
    
    if (!skill) {
      return res.status(400).json({ error: 'Skill parameter is required' });
    }
    
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const filteredProjects = profile.projects.filter(project =>
      project.skills.some(projectSkill => 
        projectSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    res.json({
      skill,
      count: filteredProjects.length,
      projects: filteredProjects
    });
  } catch (error) {
    console.error('Error filtering projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/skills/top?limit={number} - Get top skills ranked by usage
router.get('/skills/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Count skill occurrences across projects and work experience
    const skillCount = {};
    
    // Count skills from projects
    profile.projects.forEach(project => {
      project.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });
    
    // Count skills from work experience
    profile.work.forEach(job => {
      if (job.skills) {
        job.skills.forEach(skill => {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
        });
      }
    });
    
    // Add technical skills (with weight of 1 if not already counted)
    if (profile.skills.technical) {
      profile.skills.technical.forEach(skill => {
        if (!skillCount[skill]) {
          skillCount[skill] = 1;
        }
      });
    }
    
    // Sort by count and limit results
    const topSkills = Object.entries(skillCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([skill, count]) => ({ skill, count }));
    
    res.json({
      limit,
      total: topSkills.length,
      skills: topSkills
    });
  } catch (error) {
    console.error('Error getting top skills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/search?q={query} - Full-text search across profile data
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const profile = await Profile.findOne({
      $text: { $search: q }
    });
    
    if (!profile) {
      return res.json({
        query: q,
        results: {
          profile: null,
          projects: [],
          skills: []
        }
      });
    }
    
    // Filter projects that match the search query
    const matchingProjects = profile.projects.filter(project =>
      project.title.toLowerCase().includes(q.toLowerCase()) ||
      project.description.toLowerCase().includes(q.toLowerCase()) ||
      project.skills.some(skill => skill.toLowerCase().includes(q.toLowerCase()))
    );
    
    // Filter skills that match the search query
    const allSkills = [
      ...(profile.skills.technical || []),
      ...(profile.skills.soft || []),
      ...(profile.skills.languages || [])
    ];
    const matchingSkills = allSkills.filter(skill =>
      skill.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json({
      query: q,
      results: {
        profile: {
          name: profile.name,
          title: profile.title,
          bio: profile.bio,
          location: profile.location
        },
        projects: matchingProjects,
        skills: matchingSkills
      }
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;