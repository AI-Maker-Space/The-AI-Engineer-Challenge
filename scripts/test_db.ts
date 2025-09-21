#!/usr/bin/env tsx
/**
 * Simple database test script
 */

import { initializeDatabase, createKid, getKidByNameAndPin, getDatabaseStats } from '../lib/db';

console.log('🚀 Testing database setup...');

try {
  // Initialize database
  console.log('📊 Initializing database...');
  initializeDatabase();
  
  // Test creating a kid
  console.log('👶 Testing kid creation...');
  const testKid = createKid('TestChild', '1234');
  console.log('✅ Created kid:', testKid);
  
  // Test retrieving the kid
  console.log('🔍 Testing kid retrieval...');
  const retrievedKid = getKidByNameAndPin('TestChild', '1234');
  console.log('✅ Retrieved kid:', retrievedKid);
  
  // Get database stats
  console.log('📈 Getting database stats...');
  const stats = getDatabaseStats();
  console.log('✅ Database stats:', stats);
  
  console.log('🎉 Database test completed successfully!');
  
} catch (error) {
  console.error('❌ Database test failed:', error);
  process.exit(1);
}
