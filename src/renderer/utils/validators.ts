import { ORDER_TYPE } from "@/interfaces/const/order.const";

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  label?: string;
  minLengthMessage?: string;
  maxLengthMessage?: string;
  regexMessage?: string;
}

// Letras, números y guiones
const UUID_LIKE_REGEX = /^[a-zA-Z0-9-]+$/;
// Solo letras y números
const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
// Letras, números y puntos
const ALPHANUMERIC_DOT_REGEX = /^[a-zA-Z0-9.]+$/;
// Solo letras (mayúsculas, minúsculas y acentuadas) y espacios
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
// Números de teléfono en Colombia (10 dígitos, comenzando con 3 o 6)
const PHONE_CO_REGEX = /^(3|6)\d{9}$/;
// Letras, números, espacios y algunos caracteres especiales comunes en direcciones
//const ADDRESS_REGEX = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ #\-.,/]+$/;

export const VALIDATORS = {
  ID_CLIENT: {
    label: "El Id Cliente",
    required: true,
    minLength: 35,
    regex: UUID_LIKE_REGEX,
  },
  TOKEN: {
    label: "El Token",
    required: true,
    minLength: 30,
    regex: ALPHANUMERIC_REGEX,
  },
  PASSWORD: {
    label: "La Contraseña",
    required: true,
    minLength: 8,
    maxLength: 25,
    minLengthMessage: "La contraseña debe tener mínimo 8 caracteres",
    maxLengthMessage: "La contraseña no puede superar 25 caracteres",
  },
  USER: {
    label: "El Usuario",
    required: true,
    maxLength: 50,
    regex: ALPHANUMERIC_DOT_REGEX,
  },
  NAME: {
    label: "El Nombre",
    required: true,
    maxLength: 50,
    regex: NAME_REGEX,
  },

  PHONE: {
    label: "El Teléfono",
    required: true,
    regex: PHONE_CO_REGEX,
    regexMessage: "El teléfono debe tener 10 dígitos y comenzar por 3 o 6",
  },
  ADDRESS: {
    label: "La Dirección",
    required: true,
    minLength: 10,
    maxLength: 150,
    //regex: ADDRESS_REGEX,
    //regexMessage: "La dirección contiene caracteres inválidos.",
  },
  TABLE: {
    label: "La Mesa",
    required: true,
    minLength: 10,
    maxLength: 150,
    //regex: ADDRESS_REGEX,
    //regexMessage: "La dirección contiene caracteres inválidos.",
  },
} as const;

export const validateField = (
  value: string | undefined = "",
  rules: ValidationRules
): string | undefined => {
  const label = rules.label ?? "Este campo";

  if (rules.required && !value) {
    return `${label} es obligatorio`;
  }

  if (rules.minLength && value.length < rules.minLength) {
    return (
      rules.minLengthMessage ??
      `${label} debe tener al menos ${rules.minLength} caracteres`
    );
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return (
      rules.maxLengthMessage ??
      `${label} no debe superar ${rules.maxLength} caracteres`
    );
  }

  if (rules.regex && !rules.regex.test(value)) {
    return rules.regexMessage ?? `${label} tiene un formato inválido`;
  }

  return undefined;
};

export const validateErrorsOrUndefined = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  const clean = { ...obj };

  Object.keys(clean).forEach(
    (key) => clean[key] === undefined && delete clean[key]
  );

  return clean;
};




