/**
 * Auto-Initialize Embeddings on Server Startup
 * Automatically embeds all PDFs if the embeddings table is empty
 */

import fs from 'fs';
import path from 'path';
import { getEmbeddingsCount, insertPDFMetadata, PDFMetadata } from '../../lib/db';
import { embedPDF } from './embeddings';

// PDF-to-text extraction (simple approach)
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  // For now, we'll use a simple approach - reading the PDF as text
  // In production, you might want to use a proper PDF parser like pdf-parse
  try {
    // This is a placeholder - we'll need to implement proper PDF text extraction
    // For the Grade 3 PDFs, we can read the content from the generated structure
    const filename = path.basename(pdfPath);
    
    // Try to extract text using basic approach (this may need improvement)
    const content = fs.readFileSync(pdfPath, 'utf8');
    return content;
  } catch (error) {
    console.warn(`Could not extract text from ${pdfPath}:`, error);
    return '';
  }
}

// Parse metadata from Grade 3 PDF filename
function parseGrade3Metadata(filename: string): Omit<PDFMetadata, 'id' | 'createdAt'> {
  // Format: Easy_Planets_Saturn_Grade3_Sep_2025.pdf
  const parts = filename.replace('.pdf', '').split('_');
  
  if (parts.length >= 4) {
    return {
      filename,
      title: `${parts[1]} - ${parts[2]}`,
      topic: parts[1],
      subtopic: parts[2],
      grade: parts[3],
      subject: 'Science',
      difficulty: 'Easy',
      estimatedReadingTime: 5
    };
  }
  
  return {
    filename,
    title: filename.replace('.pdf', ''),
    topic: 'General',
    subtopic: 'Mixed',
    grade: 'Grade 3',
    subject: 'Science',
    difficulty: 'Easy',
    estimatedReadingTime: 5
  };
}

/**
 * Initialize embeddings for all PDFs if table is empty
 */
export async function autoInitializeEmbeddings(): Promise<{
  success: boolean;
  message: string;
  pdfsProcessed: number;
  skipped?: boolean;
}> {
  try {
    // Check if embeddings already exist
    const embeddingsCount = getEmbeddingsCount();
    if (embeddingsCount > 0) {
      return {
        success: true,
        message: `Embeddings already exist (${embeddingsCount} embeddings found)`,
        pdfsProcessed: 0,
        skipped: true
      };
    }

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        message: 'No OpenAI API key found - skipping embedding initialization',
        pdfsProcessed: 0,
        skipped: true
      };
    }

    console.log('🔄 Starting auto-initialization of embeddings...');

    // Find all PDFs in the grade3 directory
    const grade3PdfDir = path.join(process.cwd(), 'public', 'pdfs', 'grade3');
    
    if (!fs.existsSync(grade3PdfDir)) {
      return {
        success: false,
        message: 'Grade 3 PDFs directory not found',
        pdfsProcessed: 0
      };
    }

    const pdfFiles = fs.readdirSync(grade3PdfDir)
      .filter(file => file.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      return {
        success: false,
        message: 'No PDF files found in grade3 directory',
        pdfsProcessed: 0
      };
    }

    let processedCount = 0;

    // Process each PDF
    for (const pdfFile of pdfFiles) {
      try {
        const pdfPath = path.join(grade3PdfDir, pdfFile);
        const metadata = parseGrade3Metadata(pdfFile);
        
        // File size not needed for PDFMetadata interface

        // Insert/update PDF metadata
        const savedMetadata = insertPDFMetadata(metadata);
        
        // Extract text content (placeholder for now)
        // Since we generated these PDFs, we'll use a simple content template
        const content = generatePlaceholderContent(metadata.topic, metadata.subtopic);
        
        if (content) {
          // Generate and store embeddings using the metadata ID
          await embedPDF(savedMetadata.id, content, apiKey, {
            source: 'system-generated',
            type: 'grade3-science',
            auto_initialized: true
          });
          
          processedCount++;
          console.log(`✅ Processed: ${pdfFile}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${pdfFile}:`, error);
      }
    }

    return {
      success: true,
      message: `Successfully initialized embeddings for ${processedCount} PDFs`,
      pdfsProcessed: processedCount
    };
    
  } catch (error) {
    console.error('Error in auto-initialization:', error);
    return {
      success: false,
      message: `Auto-initialization failed: ${error}`,
      pdfsProcessed: 0
    };
  }
}

// Generate placeholder content for Grade 3 science topics
function generatePlaceholderContent(topic: string, subtopic?: string | null): string {
  const baseContent = {
    'Planets': `Saturn is a beautiful planet in our solar system. It has amazing rings made of ice and rock. Saturn is much bigger than Earth. It takes 29 years for Saturn to go around the Sun. Saturn is a gas giant, which means it's made mostly of gas. The rings of Saturn are very wide but very thin. Scientists have discovered many moons around Saturn. The largest moon is called Titan. Saturn would float if you could put it in a giant bathtub because it's less dense than water. Saturn is the sixth planet from the Sun.`,
    
    'Constellations': `Constellations are groups of stars that make pictures in the sky. Long ago, people looked at the stars and saw shapes like animals and people. The Big Dipper looks like a big spoon. Orion looks like a hunter with a belt of three stars. The North Star helps people find directions. Different constellations can be seen in different seasons. In autumn, we can see special star patterns. Ancient people told stories about the constellations. Constellations help sailors navigate the oceans. You can see constellations better when it's dark outside.`,
    
    'Rocks': `Rocks are everywhere around us! There are three main types of rocks. Igneous rocks form when hot lava cools down. Sedimentary rocks are made from layers of sand and mud. Metamorphic rocks change from heat and pressure. Some rocks have crystals that sparkle. Fossils can be found in sedimentary rocks. Rocks help us learn about Earth's history. Different rocks have different colors and textures. Geologists are scientists who study rocks. We use rocks to build houses and roads.`,
    
    'Water Cycle': `Water goes around and around in the water cycle. The sun heats up water and it turns into invisible water vapor. This is called evaporation. Water vapor rises up into the sky and forms clouds. This is called condensation. When clouds get heavy, water falls as rain or snow. This is called precipitation. Rain soaks into the ground or flows into rivers. Rivers carry water back to the ocean. Then the cycle starts all over again! The water cycle gives us fresh water to drink.`,
    
    'Volcanoes': `Volcanoes are mountains that can erupt! Deep inside the Earth, it's very hot. Sometimes hot melted rock called magma pushes up through cracks. When magma comes out of the ground, it's called lava. Lava is very hot and glows red or orange. Some volcanoes erupt with loud sounds and smoke. When lava cools down, it becomes solid rock. Volcanic ash can make soil very good for growing plants. Most volcanoes are found near the edges of continents. Scientists called volcanologists study volcanoes to keep people safe.`,
    
    'Earthquakes': `Earthquakes happen when the ground shakes. The Earth's surface is made of big pieces called tectonic plates. These plates move very slowly. Sometimes they get stuck and then suddenly move. This causes the ground to shake. Most earthquakes are small and people don't feel them. Big earthquakes can knock down buildings. Scientists use special tools called seismographs to measure earthquakes. Earthquakes often happen near volcanoes and mountains. We can prepare for earthquakes by having emergency supplies ready.`,
    
    'Solar Eclipse': `A solar eclipse happens when the Moon moves between the Earth and the Sun. The Moon blocks the Sun's light for a little while. During a total solar eclipse, the sky gets dark like nighttime. You can see the Sun's corona, which looks like a beautiful glow around the Moon. Solar eclipses don't happen very often in the same place. It's very important to never look directly at the Sun during an eclipse. Special glasses are needed to safely watch an eclipse. Solar eclipses have amazed people for thousands of years.`,
    
    'Animal Habitats': `Animals live in different habitats around the world. A habitat is where an animal finds food, water, and shelter. Forest animals like deer and squirrels live among the trees. Ocean animals like fish and whales live in salty water. Desert animals like camels and lizards live where it's very dry. Arctic animals like polar bears have thick fur to stay warm. Grassland animals like zebras and lions live on open plains. Each animal is specially adapted to live in its habitat.`,
    
    'Simple Machines': `Simple machines help us do work more easily. A lever is like a seesaw that helps lift heavy things. A wheel and axle help things roll smoothly. An inclined plane is like a ramp that makes it easier to move things up high. A pulley uses a rope to lift things up and down. A wedge is shaped like a triangle and helps split things apart. A screw is like a twisted inclined plane. We use simple machines every day without thinking about it!`,
    
    'Human Body': `The human body is amazing! Your heart pumps blood all through your body. Your lungs help you breathe in oxygen and breathe out carbon dioxide. Your brain controls everything your body does. Your muscles help you move and play. Your bones give your body shape and protect your organs. Your skin protects you and helps you feel things. Your stomach helps digest the food you eat. Your kidneys clean waste from your blood. All the parts of your body work together to keep you healthy and strong.`
  };

  return baseContent[topic as keyof typeof baseContent] || `This is educational content about ${topic}${subtopic ? ` focusing on ${subtopic}` : ''}.`;
}