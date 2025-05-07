export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  logout: () => void;
}
