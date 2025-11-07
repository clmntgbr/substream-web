import { Plan } from "../plan/types";
import { Subscription } from "../subscription/types";

export interface User {
  email?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  picture?: string;
  roles?: string[];
  id?: string;
  subscription?: Subscription;
  plan?: Plan;
}
