import React, { createContext, useReducer } from "react";
import { Auth } from "aws-amplify";
import Amplify from 'aws-amplify';
import awsconfig from '../../aws-exports';
import { CognitoUser } from "amazon-cognito-identity-js";
Amplify.configure(awsconfig);

const INITIAL_AUTH: IAuthContext = {
  isAuthenticated: false,
  user: null,
  handleLogin: (email: string, password: string) => {},
  handleSignUp: (email: string, password: string) => new Promise(res => ({
    user: null,
    isAuthenticated: false
  })),
  handleLogout: () => {}
}

export const AuthContext = createContext<IAuthContext>(INITIAL_AUTH);





function reducer(state: IAuthContext, action: any) {
  switch(action.type) {
    case "loginUser":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
      }
    default:
      return state;
  }
}  


export const AuthContextProvider = (props: any) => {

  const [state, dispatch] = useReducer(reducer, INITIAL_AUTH);

  async function handleSignUp(email: string, password: string): Promise<IUserAuth> {
    const username = email;
    try {
      const signupResult = await Auth.signUp({ username, password, attributes: { email }});
      const user: CognitoUser = signupResult.user;
      return {
        user,
        isAuthenticated: true
      };
    } catch (error) {
      debugger;
      alert(`Sorry! ${error.message}`);
    }  
    return {
      user: null,
      isAuthenticated: false
    }
  }
  
  async function handleAuthentication() {
    const payload = {
      user: null,
      isAuthenticated: false,
    };
    try {
      const user = await Auth.currentAuthenticatedUser();
      payload["user"] = user;
      payload["isAuthenticated"] = true;
    } catch (error) {
      console.log(`No Currently authenticated user`);
    }
  
    return payload;
  }
  
  async function handleLogout() {
    try {
      await Auth.signOut();
      dispatch({
        type: "logoutUser",
        payload: {}
      });
    } catch (error) {
      alert(`Sorry! ${error.message}`);
    }
  }

  async function handleLogin(email: string, password: string) {
  
    const payload = {
      user: null,
      isAuthenticated: false,
    };
  
    try {
      const authenticatedUser = await Auth.signIn(email,password);
      if (authenticatedUser.challengeName === "SMS_MFA" || authenticatedUser.challengeName === "SOFTWARE_TOKEN_MFA") {
        console.log("SMS_MFA or SOFTWARE_TOKEN_MFA")
      } else if (authenticatedUser.challengeName === "NEW_PASSWORD_REQUIRED") {
    
      } else if (authenticatedUser.challengeName === "MFA_SETUP") {
        Auth.setupTOTP(authenticatedUser);
      } else {
        payload["user"] = authenticatedUser;
        payload["isAuthenticated"] = true;
        dispatch({
          type: "loginUser",
          payload
        }); 
  
      }
    } catch (error) {
      alert(`Sorry! ${error.message}`);
    }
  }

    

  if (!state.isAuthenticated) {
    handleAuthentication().then(payload => {

      if (payload.isAuthenticated) {
        dispatch({
          type: "loginUser",
          payload
        });
      }
    });
  }
  
  return <AuthContext.Provider value={{
    ...state,
    handleLogin: handleLogin,
    handleLogout: handleLogout,
    handleSignUp: handleSignUp
  }}>
    {props.children}
  </AuthContext.Provider>
}