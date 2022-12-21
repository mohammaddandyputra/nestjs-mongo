export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

type User = {
  id: string;
  fullname: string;
  password: string;
  role: Role;
};

export interface IAuthenticate {
  readonly user: User;
  readonly token: string;
}

export interface IRegistration {
  fullname: string;
  email: string;
  password: string;
  role: Role;
  is_verify: boolean;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IChangePassword {
  email: string;
  old_password: string;
  new_password: string;
}
