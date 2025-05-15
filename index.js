// index.js - Main entry point for the MuffinsCorp package

// Re-export the main classes and utilities
const { MuffinsCorp } = require("./src/api-client");
const { AuthenticationError, CreditError } = require("./src/utils");

module.exports = {
  MuffinsCorp,
  AuthenticationError,
  CreditError,
};
