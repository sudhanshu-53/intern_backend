// FILE: config/database.js
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'student' CHECK(role IN ('student', 'admin')),
          profile_data TEXT DEFAULT '{}',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Internships table
      db.run(`
        CREATE TABLE IF NOT EXISTS internships (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          organization TEXT NOT NULL,
          department TEXT,
          location TEXT,
          duration TEXT,
          stipend TEXT,
          description TEXT,
          required_skills TEXT DEFAULT '[]',
          interests TEXT DEFAULT '[]',
          education_levels TEXT DEFAULT '[]',
          total_positions INTEGER DEFAULT 0,
          applied_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Applications table
      db.run(`
        CREATE TABLE IF NOT EXISTS applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          internship_id INTEGER NOT NULL,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
          applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (internship_id) REFERENCES internships (id),
          UNIQUE(user_id, internship_id)
        )
      `);

      // Bookmarks table
      db.run(`
        CREATE TABLE IF NOT EXISTS bookmarks (
          user_id INTEGER NOT NULL,
          internship_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, internship_id),
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (internship_id) REFERENCES internships (id)
        )
      `);

      // Insert sample data
      db.run(`
        INSERT OR IGNORE INTO users (id, name, email, password, role) 
        VALUES (1, 'Admin User', 'admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
      `);

      // Sample internships
      const sampleInternships = [
        {
          title: 'Software Engineering Intern',
          organization: 'TechCorp',
          location: 'San Francisco, CA',
          duration: '3 months',
          stipend: '$5000/month',
          description: 'Work on cutting-edge web applications using React and Node.js',
          required_skills: '["JavaScript", "React", "Node.js"]',
          interests: '["Web Development", "Technology"]',
          education_levels: '["Bachelor", "Master"]'
        },
        {
          title: 'Data Science Intern',
          organization: 'DataLabs',
          location: 'New York, NY',
          duration: '4 months',
          stipend: '$4500/month',
          description: 'Analyze large datasets and build machine learning models',
          required_skills: '["Python", "Machine Learning", "SQL"]',
          interests: '["Data Science", "Analytics"]',
          education_levels: '["Bachelor", "Master", "PhD"]'
        },
        {
          title: 'Marketing Intern',
          organization: 'BrandCo',
          location: 'Los Angeles, CA',
          duration: '2 months',
          stipend: '$3000/month',
          description: 'Support digital marketing campaigns and social media strategy',
          required_skills: '["Social Media", "Content Creation", "Analytics"]',
          interests: '["Marketing", "Creative"]',
          education_levels: '["Bachelor"]'
        }
      ];

      sampleInternships.forEach(internship => {
        db.run(`
          INSERT OR IGNORE INTO internships 
          (title, organization, location, duration, stipend, description, required_skills, interests, education_levels)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          internship.title,
          internship.organization,
          internship.location,
          internship.duration,
          internship.stipend,
          internship.description,
          internship.required_skills,
          internship.interests,
          internship.education_levels
        ]);
      });

      resolve();
    });
  });
};

export { db };
