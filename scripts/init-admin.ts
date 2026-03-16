#!/usr/bin/env tsx

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

// Script to initialize the default admin user in the database
import { initializeDefaultAdmin } from '../src/lib/admin/users';

async function main() {
  console.log('🚀 Initializing default admin user...');

  try {
    await initializeDefaultAdmin();
    console.log('✅ Default admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Email: nanoo.shashwat7@gmail.com');
    console.log('  Password: MicTestCam@2024!');
    console.log('');
    console.log('⚠️  IMPORTANT: Change these credentials in production!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();
