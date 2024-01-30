import { Dispatch } from "redux";
import { MAction } from "./type";
import { SocketConnectData, SocketManager } from "../websocket/connect";

const SOCKET_CONNECT = "SOCKET_CONNECT";


export interface WebSocketReduxProps {
  Socket: SocketManager | null;
  ConnectData: SocketConnectData; 
}

export const initializeWebSocketReduxProps: WebSocketReduxProps = {
  Socket : null,
  ConnectData: { }
}

export function useWebSocketRedux(state: WebSocketReduxProps = initializeWebSocketReduxProps, action: MAction)  {
  switch(action.type) {
    case SOCKET_CONNECT : {
      const { data } = action as MAction<{ data: SocketConnectData }>;
      return {
        ...state,
        ConnectData: data,
        Socket: new SocketManager(data)
      }
    }
    default: {
      return state;
    }
  }
}

export const WsCC = (dispatch: Dispatch) => {
  return (data: SocketConnectData) => {
    dispatch({ type: SOCKET_CONNECT, data});
  }
}