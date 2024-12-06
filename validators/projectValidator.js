// validators/projectValidator.js

const { body, param, query, validationResult } = require('express-validator');
const geojsonValidation = require('geojson-validation');
const createError = require('http-errors'); // For consistent error creation

// Helper function to check validation results and throw an error if necessary
const handleValidation = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Create a new error with status code 400 and attach validation details
    const error = createError(400, 'Validation failed', {
      details: errors.array().map(err => ({
        error_message: err.msg,
        field: err.field,
        location: err.location,
        type : err.type,
        
        value: err.value
      })),
    });
    return next(error);
  }
  next();
};

module.exports = {
  // Validator for creating a project
  validateCreateProject: [
    body('name')
      .exists().withMessage('Name is required.')
      .bail()
      .isString().withMessage('Name must be a string.')
      .bail()
      .notEmpty().withMessage('Name cannot be empty.'),
    body('perimeter')
      .exists().withMessage('Perimeter is required.')
      .bail()
      .custom((value) => {
        if (!geojsonValidation.isPolygon(value)) {
          throw new Error('Perimeter must be a valid GeoJSON Polygon.');
        }
        return true;
      }),
    // Middleware to handle validation result
    (req, res, next) => {
      handleValidation(req, next);
    },
    
  ],

  // Validator for renaming a project
  validateRenameProject: [
    param('id')
      .exists().withMessage('Project ID is required.')
      .bail()
      .isInt({ gt: 0 }).withMessage('Project ID must be a positive integer.'),
    body('name')
      .exists().withMessage('Name is required.')
      .bail()
      .isString().withMessage('Name must be a string.')
      .bail()
      .notEmpty().withMessage('Name cannot be empty.'),
    (req, res, next) => {
      handleValidation(req, next);
    },
  ],

  // Validator for deleting a project
  validateDeleteProject: [
    param('id')
      .exists().withMessage('Project ID is required.')
      .bail()
      .isInt({ gt: 0 }).withMessage('Project ID must be a positive integer.'),
    (req, res, next) => {
      handleValidation(req, next);
    },
  ],

  // Validator for intersecting/merging projects
  validateIntersectMergeProjects: [
    query('id1')
      .exists().withMessage('First Project ID (id1) is required.')
      .bail()
      .isInt({ gt: 0 }).withMessage('First Project ID must be a positive integer.'),
    query('id2')
      .exists().withMessage('Second Project ID (id2) is required.')
      .bail()
      .isInt({ gt: 0 }).withMessage('Second Project ID must be a positive integer.'),
    (req, res, next) => {
      handleValidation(req, next);
    },
  ],

  // Validator for getting a project by ID
  validateGetProject: [
    param('id')
      .exists().withMessage('Project ID is required.')
      .bail()
      .isInt({ gt: 0 }).withMessage('Project ID must be a positive integer.'),
    (req, res, next) => {
      handleValidation(req, next);
    },
  ],
};
