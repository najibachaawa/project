export const validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }

  export const validateName = (value) => {
    let error;
    if (!value) {
      error = "Please enter your name";
    } else if (value.length < 6) {
      error = "Invalid name";
    }
    return error;
  }

export const validatePassword = (value) => {
    let error;
    if (!value) {
      error = "Please enter your password";
    } else if (value.length < 4) {
      error = "Value must be longer than 3 characters";
    }
    return error;
  }

  export const validateRole = (role, roles) => {
    let error;
    if (!role) {
      error = "Please enter your role";
    } else if (!roles.find(e=>e.value == role)) {
      error = "Invalid role";
    }
    return error;
  }