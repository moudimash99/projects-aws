# projects-aws

## Key Components

### app.js
The main entry point of the application. Sets up middleware, connects to the database, mounts routes, and starts the Express server.

---

### config/
- **config.json**: Contains database configurations for different environments (development, testing, production).
- **database.js**: Initializes and exports the Sequelize instance connected to the PostgreSQL database.

---

### controllers/
- **projectController.js**: Handles incoming requests related to projects, interacts with the service layer, and sends responses.

---

### middleware/
- **errorHandler.js**: Centralized error handling middleware.
- **requestLogger.js**: Logs details of each incoming request.
- **validationErrorHandler.js**: Handles validation errors from Express Validator.

---

### models/
- **project.js**: Defines the `Project` model with fields like `id`, `name`, and `perimeter`.
- **department.js**: Defines the `Department` model with fields like `code`, `name`, and `perimeter`.
- **index.js**: Initializes all models and sets up associations.

---

### routes/
- **projectRoutes.js**: Defines API endpoints for project-related operations.

---

### services/
- **projectService.js**: Contains business logic for managing projects, including database interactions.

---

### validators/
- **projectValidator.js**: Defines validation rules for incoming project-related requests using Express Validator.

---

### utils/
- **logger.js**: Configures and exports the Winston logger for centralized logging.

---

### terraform/
- **main.tf**: Contains all Terraform configurations for provisioning AWS infrastructure.
