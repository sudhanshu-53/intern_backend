// FILE: scripts/import_internships.js
import { db } from '../config/database.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📥 Importing internships data...');

try {
  // Read the internships data
  const internshipsData = JSON.parse(
    readFileSync(join(__dirname, '..', 'internships_full.json'), 'utf8')
  );

  // First, clear existing internships
  db.run('DELETE FROM internships', (err) => {
    if (err) {
      console.error('Error clearing internships:', err);
      process.exit(1);
    }

    // Prepare the insert statement
    const stmt = db.prepare(`
      INSERT INTO internships (
        title, organization, department, location, duration, stipend,
        description, required_skills, interests, education_levels,
        total_positions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Insert each internship
    internshipsData.internships.forEach((internship) => {
      stmt.run(

        internship.title,
        internship.organization,
        internship.department,
        internship.location,
        internship.duration,
        internship.stipend,
        internship.description,
        JSON.stringify(internship.required_skills),
        JSON.stringify(internship.interests),
        JSON.stringify(internship.education_levels),
        internship.total_positions
      );
    });

    stmt.finalize();
    console.log(`✅ Successfully imported ${internshipsData.internships.length} internships`);
    process.exit(0);
  });
} catch (error) {
  console.error('❌ Import failed:', error);
  process.exit(1);
}