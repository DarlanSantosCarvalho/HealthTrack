export type UserRole = "profissional" | "cliente";

export type Specialty =
  | "nutri-clinico"
  | "nutri-esportivo"
  | "nutri-funcional"
  | "personal"
  | "educador-fisico"
  | "treinador-funcional"
  | "ambos";

export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
  role: UserRole;
}

export interface ProfessionalForm {
  name: string;
  email: string;
  specialty: Specialty | "";
  crn: string;
  cref: string;
  password: string;
  terms: boolean;
}
