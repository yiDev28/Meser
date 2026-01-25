export type FormErrorsRegister = {
  idClient?: string;
  keyClient?: string;
};


export type FormErrorsLogin = {
  userClient?: string;
  passClient?: string;
};

export type FormCreateOrder = {
    name?: string;
    phone?: string;
    address?: string;
}