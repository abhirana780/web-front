/**
 * Validation Error Handler for Joi
 * Parses Joi validation errors and maps them to form field names
 */

/**
 * Maps backend field names to frontend form field names
 */
const fieldNameMapping = {
  // Register form field mapping
  fullName: 'fullName',
  email: 'email',
  password: 'password',
  confirmPassword: 'confirmPassword',
  phoneNumber: 'phoneNumber',
  city: 'city',
  education: 'education',
  course: 'course',
  college: 'college',
  passingYear: 'passingYear',
  
  // Login form field mapping
  loginEmail: 'email',
  loginPassword: 'password'
};

/**
 * Parse Joi validation errors and return structured error object
 * @param {Array} joiErrors - Array of Joi error details
 * @param {string} formType - Type of form ('register' or 'login') - reserved for future use
 * @returns {Object} Structured field errors
 */
export const parseJoiErrors = (joiErrors, formType = 'register') => {
  const fieldErrors = {};
  
  joiErrors.forEach(error => {
    const field = error.path?.[0];
    const message = error.message;
    
    if (field && fieldNameMapping[field]) {
      const formFieldName = fieldNameMapping[field];
      fieldErrors[formFieldName] = message;
    }
  });
  
  return fieldErrors;
};

/**
 * Enhanced error handler for API responses
 * @param {Object} error - Axios error object
 * @param {string} formType - Type of form ('register' or 'login')
 * @returns {Object} Processed error information
 */
export const handleApiError = (error, formType = 'register') => {
  const response = error.response;
  
  if (!response) {
    return {
      type: 'network',
      message: 'Network error. Please check your connection.',
      fieldErrors: {}
    };
  }
  
  const { status, data } = response;
  
  // Handle validation errors (400 status)
  if (status === 400 && data.errors && Array.isArray(data.errors)) {
    const fieldErrors = parseJoiErrors(data.errors, formType);
    
    return {
      type: 'validation',
      message: data.message || 'Validation failed',
      fieldErrors: fieldErrors,
      hasFieldErrors: Object.keys(fieldErrors).length > 0
    };
  }
  
  // Handle other HTTP errors
  if (status === 401) {
    return {
      type: 'auth',
      message: 'Invalid credentials. Please check your email and password.',
      fieldErrors: {}
    };
  }
  
  if (status === 409) {
    return {
      type: 'conflict',
      message: data.message || 'User already exists with this email or phone number.',
      fieldErrors: {}
    };
  }
  
  // Default error
  return {
    type: 'server',
    message: data.message || 'An unexpected error occurred. Please try again.',
    fieldErrors: {}
  };
};

/**
 * Apply field errors to Ant Design form
 * @param {Object} form - Ant Design form instance
 * @param {Object} fieldErrors - Field error object
 */
export const applyFieldErrorsToForm = (form, fieldErrors) => {
  if (!form || !fieldErrors) return;
  
  const formFields = {};
  
  Object.entries(fieldErrors).forEach(([fieldName, errorMessage]) => {
    formFields[fieldName] = {
      errors: [new Error(errorMessage)]
    };
  });
  
  form.setFields(formFields);
};

/**
 * Clear field errors from Ant Design form
 * @param {Object} form - Ant Design form instance
 * @param {Array} fieldNames - Array of field names to clear
 */
export const clearFieldErrors = (form, fieldNames = []) => {
  if (!form) return;
  
  if (fieldNames.length === 0) {
    // Clear all validation errors using setFields with empty errors
    form.setFields({});
  } else {
    const fieldsToClear = {};
    fieldNames.forEach(fieldName => {
      fieldsToClear[fieldName] = { errors: [] };
    });
    form.setFields(fieldsToClear);
  }
};

/**
 * Reset form with validation state
 * @param {Object} form - Ant Design form instance
 */
export const resetFormValidation = (form) => {
  if (!form) return;
  
  form.resetFields();
  // Clear any validation errors
  form.setFields({});
};
