export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequestDTO {
  name?: string;
  bio?: string;
}

export interface ChangePasswordRequestDTO {
  currentPassword: string;
  newPassword: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  user: UserDTO;
}
