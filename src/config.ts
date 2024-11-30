import convict from "convict";

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  db: {
    host: {
      doc: "Database host name/IP",
      format: String,
      default: "127.0.0.1:27017",
      env: "DB_HOST",
    },
    name: {
      doc: "Database name",
      format: String,
      default: "toku-messages",
      env: "DB_NAME",
    },
  },
  jwt: {
    secretKey: {
      doc: "JWT secret key",
      format: String,
      default: "d3d3Lmdvb2dsZS5jb20vc2VjdXJpdHkvZGF0YS9sYW5nPWF1dGg9c2VjcmV0",
      env: "JWT_SECRET_KEY",
    },
  },
  port: {
    doc: "Port number",
    format: Number,
    default: 3000,
    env: "PORT",
  },
});

// Perform validation
config.validate({ allowed: "strict" });

export default config;
