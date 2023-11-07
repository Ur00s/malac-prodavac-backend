export const passwordRegex =
  // /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)[^\s]{8,}$/;
  /^[a-zA-Z0-9\S]{8,}$/;

export const nameRegex = /^[a-z ,.'-]+$/i;

export const phoneRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
