const { body, param, query, validationResult } = require('express-validator');
const geojsonValidation = require('geojson-validation');
const createError = require('http-errors'); 

const handleValidation = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

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
        if (!geojsonValidation.isMultiPolygon(value) && !geojsonValidation.isPolygon(value)) {
          throw new Error('Perimeter must be a valid GeoJSON MultiPolygon or Polygon.');
        }
        return true;
      }),

    (req, res, next) => {
      handleValidation(req, next);
    },

  ],

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

  validateDeleteProject: [
    param('id')
      .exists().withMessage('Project ID is required.')
      .bail()
      .isInt({ gt: 0 }).withMessage('Project ID must be a positive integer.'),
    (req, res, next) => {
      handleValidation(req, next);
    },
  ],

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