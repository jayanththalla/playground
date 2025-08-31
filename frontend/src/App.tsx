import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Code,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Heart,
  Mail,
  MapPin,
  BookOpen,
  Star,
  Filter,
  X,
} from "lucide-react";

interface Profile {
  _id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  location: string;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  projects: Array<{
    _id: string;
    title: string;
    description: string;
    links: {
      github?: string;
      demo?: string;
      docs?: string;
    };
    skills: string[];
    featured: boolean;
  }>;
  work: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    skills: string[];
  }>;
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    resume?: string;
  };
}

const API_BASE_URL = "https://playground-r08v.onrender.com";

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Profile["projects"]>(
    []
  );
  const [topSkills, setTopSkills] = useState<
    Array<{ skill: string; count: number }>
  >([]);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchProfile();
    fetchTopSkills();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFilteredProjects(data.projects);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSkills = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/skills/top?limit=10`);
      if (response.ok) {
        const data = await response.json();
        setTopSkills(data.skills);
      }
    } catch (error) {
      console.error("Error fetching top skills:", error);
    }
  };

  const handleSkillFilter = async (skill: string) => {
    if (skill === selectedSkill) {
      setSelectedSkill("");
      setFilteredProjects(profile?.projects || []);
      return;
    }

    setSelectedSkill(skill);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/projects?skill=${encodeURIComponent(skill)}`
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredProjects(data.projects);
      }
    } catch (error) {
      console.error("Error filtering projects:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setActiveTab("search");
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setSelectedSkill("");
    setFilteredProjects(profile?.projects || []);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <div className="text-lg text-slate-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Profile Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            Make sure the backend server is running and the database is seeded.
          </p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                DevPortfolio
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {profile.links.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-indigo-600 transition-colors p-2 bg-slate-100 rounded-lg"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {profile.links.linkedin && (
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-indigo-600 transition-colors p-2 bg-slate-100 rounded-lg"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {profile.links.portfolio && (
                <a
                  href={profile.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-indigo-600 transition-colors p-2 bg-slate-100 rounded-lg"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-medium text-sm mr-2 ${
              activeTab === "profile"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-3 font-medium text-sm mr-2 ${
              activeTab === "projects"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-3 font-medium text-sm mr-2 ${
              activeTab === "skills"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Skills
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Search className="w-5 h-5 text-indigo-600" />
            <span>Search Portfolio</span>
          </h3>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, skills, or experience..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Top Skills */}
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter by Skills:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {topSkills.map(({ skill, count }) => (
                <button
                  key={skill}
                  onClick={() => handleSkillFilter(skill)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center space-x-1 ${
                    selectedSkill === skill
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{skill}</span>
                  <span className="text-xs opacity-75">({count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults && activeTab === "search" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">
                Search Results for "{searchResults.query}"
              </h3>
              <button
                onClick={clearSearch}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {searchResults.results.projects.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>Projects</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.results.projects.map((project: any) => (
                    <div
                      key={project._id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <h5 className="font-medium text-slate-800">
                        {project.title}
                      </h5>
                      <p className="text-sm text-slate-600 mt-1">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.results.work.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Experience</span>
                </h4>
                <div className="space-y-3">
                  {searchResults.results.work.map((job: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <h5 className="font-medium text-slate-800">
                        {job.position} at {job.company}
                      </h5>
                      <p className="text-sm text-slate-500 mt-1">
                        {job.duration}
                      </p>
                      <p className="text-sm text-slate-600 mt-2">
                        {job.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.results.projects.length === 0 &&
              searchResults.results.work.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-500">
                    No results found for your search query.
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Profile Content */}
        {activeTab === "profile" && !searchResults && (
          <>
            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    {profile.name}
                  </h2>
                  <p className="text-xl text-indigo-600 mb-3">
                    {profile.title}
                  </p>

                  <div className="flex items-center space-x-4 text-slate-600 mb-4">
                    {profile.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </span>
                    )}
                    {profile.email && (
                      <span className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{profile.email}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
                <div className="mt-6 md:mt-0">
                  {profile.links.resume && (
                    <a
                      href={profile.links.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>View Resume</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Experience & Education Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Work Experience */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <span>Experience</span>
                </h3>

                <div className="space-y-6">
                  {profile.work.map((job, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-indigo-200 pl-4"
                    >
                      <h4 className="font-semibold text-slate-800">
                        {job.position}
                      </h4>
                      <p className="text-indigo-600 font-medium">
                        {job.company}
                      </p>
                      <p className="text-sm text-slate-500 mb-2">
                        {job.duration}
                      </p>
                      <p className="text-slate-600 mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span>Education</span>
                </h3>

                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-indigo-200 pl-4"
                    >
                      <h4 className="font-semibold text-slate-800">
                        {edu.degree}
                      </h4>
                      <p className="text-indigo-600 font-medium">
                        {edu.institution}
                      </p>
                      {edu.field && (
                        <p className="text-slate-600">{edu.field}</p>
                      )}
                      <p className="text-sm text-slate-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Projects Content */}
        {activeTab === "projects" && !searchResults && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
                <Code className="w-5 h-5 text-indigo-600" />
                <span>Projects</span>
              </h3>
              {selectedSkill && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full flex items-center space-x-1">
                  <span>Filtered by: {selectedSkill}</span>
                  <button onClick={() => setSelectedSkill("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h4>
                    {project.featured && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-sm">Code</span>
                      </a>
                    )}
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">Demo</span>
                      </a>
                    )}
                    {project.links.docs && (
                      <a
                        href={project.links.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">Docs</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Content */}
        {activeTab === "skills" && !searchResults && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">
              Skills
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>Technical</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.technical.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Soft Skills</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.soft.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Languages</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-slate-200 mt-8">
          <p className="text-slate-500 flex items-center justify-center space-x-1">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-rose-500" />
            <span>using React, Node.js, and MongoDB</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
