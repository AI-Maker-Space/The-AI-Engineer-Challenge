#!/usr/bin/env tsx
/**
 * Script to populate PDF metadata table with generated Grade 3 science PDFs
 * Run with: npx tsx scripts/populate_pdf_metadata.ts
 */

import { savePDFMetadata, getAllPDFMetadata, initializeDatabase } from '../lib/db';
import fs from 'fs';
import path from 'path';

// PDF metadata based on our generated files
const pdfMetadataList = [
  {
    filename: 'Easy_Planets_Saturn_Grade3_Sep_2025.pdf',
    title: 'Amazing Saturn - The Planet with Beautiful Rings',
    topic: 'Planets',
    subtopic: 'Saturn',
    gradeLevel: 'Grade 3',
    sourceReferences: JSON.stringify([
      'NASA Kids - https://www.nasa.gov/audience/forkids/',
      'National Geographic Kids - https://kids.nationalgeographic.com/',
      'Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids'
    ]),
    modelUsed: 'Claude 3.5 Sonnet (Anthropic)',
    contentApproach: 'Age-appropriate scientific facts with engaging storytelling',
    totalLines: 16,
    fileSize: null as number | null
  },
  {
    filename: 'Easy_Constellations_Autumn_Grade3_Sep_2025.pdf',
    title: 'Autumn Constellations - Star Pictures in the Night Sky',
    topic: 'Astronomy',
    subtopic: 'Autumn Constellations',
    gradeLevel: 'Grade 3',
    sourceReferences: JSON.stringify([
      'NASA Kids - https://www.nasa.gov/audience/forkids/',
      'National Geographic Kids - https://kids.nationalgeographic.com/',
      'Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids'
    ]),
    modelUsed: 'Claude 3.5 Sonnet (Anthropic)',
    contentApproach: 'Age-appropriate scientific facts with engaging storytelling',
    totalLines: 16,
    fileSize: null as number | null
  },
  {
    filename: 'Easy_Rocks_Minerals_Grade3_Sep_2025.pdf',
    title: 'Rocks and Minerals - The Building Blocks of Earth',
    topic: 'Earth Science',
    subtopic: 'Rocks and Minerals',
    gradeLevel: 'Grade 3',
    sourceReferences: JSON.stringify([
      'NASA Kids - https://www.nasa.gov/audience/forkids/',
      'National Geographic Kids - https://kids.nationalgeographic.com/',
      'Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids'
    ]),
    modelUsed: 'Claude 3.5 Sonnet (Anthropic)',
    contentApproach: 'Age-appropriate scientific facts with engaging storytelling',
    totalLines: 16,
    fileSize: null as number | null
  },
  {
    filename: 'Easy_Water_Cycle_Grade3_Sep_2025.pdf',
    title: 'The Amazing Water Cycle - How Water Travels Around Earth',
    topic: 'Earth Science',
    subtopic: 'Water Cycle',
    gradeLevel: 'Grade 3',
    sourceReferences: JSON.stringify([
      'NASA Kids - https://www.nasa.gov/audience/forkids/',
      'National Geographic Kids - https://kids.nationalgeographic.com/',
      'Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids'
    ]),
    modelUsed: 'Claude 3.5 Sonnet (Anthropic)',
    contentApproach: 'Age-appropriate scientific facts with engaging storytelling',
    totalLines: 16,
    fileSize: null as number | null
  },
  {
    filename: 'Easy_Volcanoes_Grade3_Sep_2025.pdf',
    title: 'Volcanoes - Earth\'s Amazing Fire Mountains',
    topic: 'Earth Science',
    subtopic: 'Volcanoes',
    gradeLevel: 'Grade 3',
    sourceReferences: JSON.stringify([
      'NASA Kids - https://www.nasa.gov/audience/forkids/',
      'National Geographic Kids - https://kids.nationalgeographic.com/',
      'Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids'
    ]),
    modelUsed: 'Claude 3.5 Sonnet (Anthropic)',
    contentApproach: 'Age-appropriate scientific facts with engaging storytelling',
    totalLines: 16,
    fileSize: null as number | null
  },
  {
    filename: 'Easy_Earthquakes_Grade3_Sep_2025.pdf',
    title: 'Earthquakes - When the Earth Shakes and Moves',
    topic: 'Earth Science',
    subtopic: 'Earthquakes',
    gradeLevel: 'Grade 3',
    sourceReferences: JSON.stringify([
      'NASA Kids - https://www.nasa.gov/audience/forkids/',
      'National Geographic Kids - https://kids.nationalgeographic.com/',
      'Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids'
    ]),
    modelUsed: 'Claude 3.5 Sonnet (Anthropic)',
    contentApproach: 'Age-appropriate scientific facts with engaging storytelling',
    totalLines: 16,
    fileSize: null as number | null
  },
  {
    filename: 'Easy_Solar_Eclipse_Grade3_Sep_2025.pdf',
    title: 'Solar Eclipse - When the Moon Blocks the Sun',
    topic: 'Astronomy',
    subtopic: 'Solar Eclipse',
    gradeLevel: 'Grade 3',
    sourceReferences: JSON.stringify([
      'NASA Kids - https://www.nasa.gov/audience/forkids/',
      'National Geographic Kids - https://kids.nationalgeographic.com/',
      'Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids'
    ]),
    modelUsed: 'Claude 3.5 Sonnet (Anthropic)',
    contentApproach: 'Age-appropriate scientific facts with engaging storytelling',
    totalLines: 16,
    fileSize: null as number | null
  },
  {
    filename: 'Easy_Animal_Habitats_Grade3_Sep_2025.pdf',
    title: 'Animal Habitats - Amazing Homes in Nature',
    topic: 'Biology',
    subtopic: 'Animal Habitats',
    gradeLevel: 'Grade 3',
    sourceReferences: JSON.stringify([
      'NASA Kids - https://www.nasa.gov/audience/forkids/',
      'National Geographic Kids - https://kids.nationalgeographic.com/',
      'Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids'
    ]),
    modelUsed: 'Claude 3.5 Sonnet (Anthropic)',
    contentApproach: 'Age-appropriate scientific facts with engaging storytelling',
    totalLines: 16,
    fileSize: null as number | null
  },
  {
    filename: 'Easy_Simple_Machines_Grade3_Sep_2025.pdf',
    title: 'Simple Machines - Tools That Make Work Easier',
    topic: 'Physics',
    subtopic: 'Simple Machines',
    gradeLevel: 'Grade 3',
    sourceReferences: JSON.stringify([
      'NASA Kids - https://www.nasa.gov/audience/forkids/',
      'National Geographic Kids - https://kids.nationalgeographic.com/',
      'Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids'
    ]),
    modelUsed: 'Claude 3.5 Sonnet (Anthropic)',
    contentApproach: 'Age-appropriate scientific facts with engaging storytelling',
    totalLines: 16,
    fileSize: null as number | null
  },
  {
    filename: 'Easy_Human_Body_Grade3_Sep_2025.pdf',
    title: 'The Amazing Human Body - How We Work Inside and Out',
    topic: 'Biology',
    subtopic: 'Human Body',
    gradeLevel: 'Grade 3',
    sourceReferences: JSON.stringify([
      'NASA Kids - https://www.nasa.gov/audience/forkids/',
      'National Geographic Kids - https://kids.nationalgeographic.com/',
      'Smithsonian National Museum of Natural History - https://naturalhistory.si.edu/education/kids'
    ]),
    modelUsed: 'Claude 3.5 Sonnet (Anthropic)',
    contentApproach: 'Age-appropriate scientific facts with engaging storytelling',
    totalLines: 16,
    fileSize: null as number | null
  }
];

function getFileSize(filename: string): number | null {
  try {
    const filePath = path.join(process.cwd(), 'public', 'pdfs', 'grade3', filename);
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.warn(`Could not get file size for ${filename}:`, error);
    return null;
  }
}

async function populateMetadata() {
  console.log('🚀 Starting PDF metadata population...');
  
  // Initialize database
  initializeDatabase();
  
  // Check existing metadata
  const existingMetadata = getAllPDFMetadata();
  console.log(`📊 Found ${existingMetadata.length} existing PDF metadata records`);
  
  let added = 0;
  let skipped = 0;
  
  for (const metadata of pdfMetadataList) {
    // Check if already exists
    const existing = existingMetadata.find(m => m.filename === metadata.filename);
    if (existing) {
      console.log(`⏭️  Skipping ${metadata.filename} (already exists)`);
      skipped++;
      continue;
    }
    
    // Get file size
    metadata.fileSize = getFileSize(metadata.filename);
    
    try {
      const saved = savePDFMetadata(metadata);
      console.log(`✅ Added metadata for: ${saved.filename}`);
      added++;
    } catch (error) {
      console.error(`❌ Failed to add metadata for ${metadata.filename}:`, error);
    }
  }
  
  console.log(`\n🎉 PDF metadata population complete!`);
  console.log(`📈 Added: ${added} records`);
  console.log(`⏭️  Skipped: ${skipped} records`);
  console.log(`📊 Total: ${added + skipped + existingMetadata.length} records in database`);
}

// Run the population script
if (require.main === module) {
  populateMetadata().catch(console.error);
}

export { populateMetadata };
