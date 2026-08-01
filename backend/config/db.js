const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/adventure_travel';
const isProduction = process.env.NODE_ENV === 'production';

// Check if DATABASE_URL points to a cloud database or requires SSL
const isRailwayInternal = dbUrl.includes('railway.internal');
const isCloudPostgres = dbUrl.includes('supabase') || 
                        dbUrl.includes('neon.tech') || 
                        dbUrl.includes('render.com') || 
                        dbUrl.includes('amazonaws.com') || 
                        dbUrl.includes('railway') || 
                        dbUrl.includes('rlwy.net') || 
                        dbUrl.includes('sslmode=require');

const isLocalhost = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

// Synchronously check if local PostgreSQL port 5432 is open
const isLocalPgActive = () => {
  if (!isLocalhost) return false;
  try {
    const script = "const n=require('net'),s=n.connect(5432,'127.0.0.1',()=>process.exit(0));s.on('error',()=>process.exit(1));s.on('timeout',()=>process.exit(1));";
    child_process.execSync(`node -e "${script}"`, { stdio: 'ignore', timeout: 1000 });
    return true;
  } catch (e) {
    return false;
  }
};

let sequelize;
const usePostgres = isCloudPostgres || (!isLocalhost) || isLocalPgActive();

if (usePostgres) {
  let dialectOptions = {};
  if (process.env.DB_SSL === 'false' || isRailwayInternal) {
    dialectOptions = {};
  } else if (process.env.DB_SSL === 'true' || isProduction || isCloudPostgres) {
    dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    };
  }

  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(dataDir, 'database.sqlite'),
    logging: false
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    if (sequelize.getDialect() === 'postgres') {
      console.log('[PostgreSQL Connected]: Successfully connected to PostgreSQL Database!');
    } else {
      console.log('\n======================================================================');
      console.log('[PostgreSQL Notice]: Localhost PostgreSQL server is not active on port 5432.');
      console.log('[PostgreSQL Cloud Setup Guide]:');
      console.log(' To connect to PostgreSQL Cloud (Neon / Supabase):');
      console.log(' 1. Create a free PostgreSQL Cloud DB on Neon (https://neon.tech) or Supabase (https://supabase.com).');
      console.log(' 2. Copy your connection URL: postgres://user:password@ep-xyz.neon.tech/neondb?sslmode=require');
      console.log(' 3. Set DATABASE_URL in your root .env file.');
      console.log('[Standalone Persistence]: Running with local SQLite database storage.');
      console.log('======================================================================\n');
      console.log('[Database Storage]: Local persistent database ready.');
    }
  } catch (error) {
    if (sequelize.getDialect() === 'postgres') {
      console.warn(`[PostgreSQL Warning]: Could not connect to database server (${error.message}).`);
    } else {
      console.error('[Database Error]: Failed to connect to database storage:', error.message);
    }
  }
};

module.exports = { sequelize, connectDB };


