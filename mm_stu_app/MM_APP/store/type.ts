import { Action } from "redux";

export type MAction<U = unknown> = Action & U;
