import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
}

export function formatUserResponse(user: User): UserResponse {
  return {
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    roles: user.roles,
    id: user.id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
