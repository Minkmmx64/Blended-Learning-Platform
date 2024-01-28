import { Action, Dispatch } from "redux";

const SET_DATA = "SET_DATA";
const CLEAR_USER = "CLEAR_USER";

export interface StudentsProps {
  id: number;
  student: string;
  school: string;
  name: string
  native: string
  year: number,
  gender: string
  age: number,
  avatar: string;
  class: StuClassProps | null;
}

export interface StuClassProps {
  id: number;
  name: string;
  code: number;
}

export interface AppUserReduxProps {
  id: number;
  username: string | undefined;
  avatar: string | undefined;
  label: string;
  type: "student" | "teacher" | "unauthorization";
  student: StudentsProps | null;
  teacher: string;
  phone: string;
}

const initializeAppUserReduxProps: AppUserReduxProps = {
  id: -1,
  username: undefined,
  avatar: undefined,
  label: "",
  type: "unauthorization",
  student: null,
  teacher: "",
  phone: "",
}

type MAction<U = unknown> = Action & U;

export function useAppUserRedux(state: AppUserReduxProps = initializeAppUserReduxProps, action: MAction) {
  switch (action.type) {
    case SET_DATA: {
      const { data } = action as MAction<{ data: AppUserReduxProps}>;
      return {
        ...state,
        ...data
      };
    }
    case CLEAR_USER: {
      return {
        ...initializeAppUserReduxProps
      }
    }
    default:
      return state;
  }
}

//SET_DATA
export const setAppUser = (dispatch: Dispatch) => {
  return (data: Partial<AppUserReduxProps>) => {
    dispatch({type: SET_DATA, data});
  }
}
//CLEAR_USER
export const clearAppUser = (dispatch: Dispatch) => {
  return () => {
    dispatch({type: CLEAR_USER});
  }
}