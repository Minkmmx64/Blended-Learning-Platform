import { Action, Dispatch } from "redux";

const SET_DATA = "SET_DATA";


export interface AppUserReduxProps {
  id: number;
  username: string | undefined;
  avatar: string | undefined;
  label: string;
  type: "student" | "teacher" | "unauthorization";
  student: string;
  teacher: ""
}

const initializeAppUserReduxProps: AppUserReduxProps = {
  id: -1,
  username: undefined,
  avatar: undefined,
  label: "",
  type: "unauthorization",
  student: "",
  teacher: ""
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
