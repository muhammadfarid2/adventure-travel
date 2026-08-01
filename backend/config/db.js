const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

// Helper to find a valid PostgreSQL URL from various Railway / Cloud env vars
const getValidPostgresUrl = () => {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.DATABASE_PUBLIC_URL,
    process.env.DATABASE_PRIVATE_URL,
    process.env.POSTGRES_URL
  ];

  for (const raw of candidates) {
    if (raw && typeof raw === 'string') {
      const cleaned = raw.trim().replace(/^["'`]|["'`]$/g, '').trim();
      if (cleaned.startsWith('postgres://') || cleaned.startsWith('postgresql://')) {
        return cleaned;
      }
    }
  }
  return null;
};

const postgresUrl = getValidPostgresUrl();
const isRailwayInternal = postgresUrl ? postgresUrl.includes('railway.internal') : false;
const isCloudPostgres = postgresUrl ? (
  postgresUrl.includes('supabase') || 
  postgresUrl.includes('neon.tech') || 
  postgresUrl.includes('render.com') || 
  postgresUrl.includes('amazonaws.com') || 
  postgresUrl.includes('railway') || 
  postgresUrl.includes('rlwy.net') || 
  postgresUrl.includes('sslmode=require')
) : Boolean(process.env.PGHOST);

let sequelize;

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

if (postgresUrl) {
  console.log('[Database Config]: Initializing PostgreSQL via URL connection string...');
  sequelize = new Sequelize(postgresUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  });
} else if (process.env.PGHOST && process.env.PGDATABASE) {
  console.log('[Database Config]: Initializing PostgreSQL via PGHOST parameters...');
  sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER || 'postgres', process.env.PGPASSWORD || '', {
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  });
} else {
  // Fallback to standard PostgreSQL local string
  const defaultUrl = 'postgres://postgres:postgres@localhost:5432/adventure_travel';
  console.log('[Database Config]: Using default PostgreSQL connection string...');
  sequelize = new Sequelize(defaultUrl, {
    dialect: 'postgres',
    logging: false,
    pool: { max: 5, min: 0, acquire: 10000, idle: 5000 }
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('[PostgreSQL Connected]: Successfully connected to PostgreSQL Database!');
  } catch (error) {
    console.warn(`[PostgreSQL Warning]: Database connection attempt failed (${error.message}).`);
  }
};

module.exports = { sequelize, connectDB };
