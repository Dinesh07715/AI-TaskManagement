export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateLogin(values) {
  const errors = {};
  if (!values.email?.trim()) errors.email = "Email is required";
  else if (!validateEmail(values.email)) errors.email = "Enter a valid email";
  if (!values.password) errors.password = "Password is required";
  return errors;
}

export function validateRegister(values) {
  const errors = validateLogin(values);
  if (!values.name?.trim()) errors.name = "Name is required";
  if (values.password && values.password.length < 6) errors.password = "Password must be at least 6 characters";
  return errors;
}

export function validateTask(values) {
  const errors = {};
  if (!values.title?.trim()) errors.title = "Title is required";
  if (!values.description?.trim()) errors.description = "Description is required";
  if (!values.priority) errors.priority = "Priority is required";
  if (!values.status) errors.status = "Status is required";
  if (!values.dueDate) errors.dueDate = "Due date is required";
  return errors;
}
