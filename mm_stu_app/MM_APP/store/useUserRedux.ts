import { Action } from "redux";

export interface UserReduxProps {
  name: string;
  age: number;
}

const initializeUserProps: UserReduxProps = {
  name: "username",
  age: 12
}

export function useUserRedux(state: UserReduxProps = initializeUserProps, action: Action) {
  switch (action.type) {
    case "TEST_USER": {
      return {
        ...state,
        name: "mjw",
        age: 44
      }
    }
    default:
      return state;
  }
}