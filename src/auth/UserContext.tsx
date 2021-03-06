import React, { createContext, useReducer } from "react";
import { Auth } from "aws-amplify";
import { CreateBusinessUser } from "../accessor/BusinessUser";
import Business from "../model/business";

const INITIAL_AUTH: IUserContext = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  data: {},
  handleLogin: (email: string, password: string) => {},
  handleSignUp: (signupData: SignUpData) => new Promise(res => ({
    user: null,
    isAuthenticated: false
  })),
  handleLogout: () => {},
  addBusiness: (business: Business) => {}
}

export const UserContext = createContext<IUserContext>(INITIAL_AUTH);

function reducer(state: IUserContext, action: any) {
  switch(action.type) {
    case "LOGIN_USER":
      return {
        ...state,
        user: action.payload.user,
        isLoading: action.payload.isLoading,
        isAuthenticated: action.payload.isAuthenticated,
      }
    case "SET_DATA":
      return {
        ...state,
        data: action.payload.data
      }
    case "STOP_LOADING":
      return {
        ...state,
        isLoading: action.payload.isLoading
      }
    case "START_LOADING":
      return {
        ...state,
        isLoading: true
      }
    case "LOGOUT_USER":
      return {
        ...state,
        user: undefined,
        isLoading: false,
        isAuthenticated: false,
      }
    default:
      return state;
  }
}  



export const UserContextProvider = (props: any) => {

  const [state, dispatch] = useReducer(reducer, INITIAL_AUTH);

  async function handleSignUp(signupData: SignUpData): Promise<UserAuth> {
    try {
      const { email, password, firstName, lastName, phoneNumber } = signupData;
      const signupResult = await Auth.signUp({ username: email, password, attributes: { email }});

      const user = signupResult.user;

      try {
        const userName = signupResult.userSub;
        await CreateBusinessUser({
          id: userName,
          email,
          firstName: firstName,
          mobileNumber: phoneNumber,
          lastName: lastName,
          businesses: []
        });
      } catch (error) {
        console.log(error);
      }
      
      return {
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null
      };
    } catch (error) {
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error,
      }
    }  
  }

  async function handleAuthentication(): Promise<{
    user: any;
    isLoading: boolean;
    isAuthenticated: boolean;
  }> {
    const payload = {
      user: null,
      isLoading: false,
      isAuthenticated: false,
    };
    try {
      const user = await Auth.currentAuthenticatedUser();
      payload["user"] = user;
      payload["isAuthenticated"] = true;
    } catch (error) {
      payload["user"] = null;
      payload["isAuthenticated"] = false;
    }
  
    return payload;
  }
  
  async function handleLogout() {
    try {
      await Auth.signOut();
      dispatch({
        type: "LOGOUT_USER",
        payload: {
          isLoading: false,
        }
      });
    } catch (error) {
      console.log(error)
      alert(`${error.message}`);
    }
  }

  async function handleLogin(email: string, password: string) {
    const payload = {
      user: null,
      isLoading: false,
      isAuthenticated: false,
    };
    debugger;
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
          type: "LOGIN_USER",
          isLoading: false,
          payload
        }); 
  
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_USER",
        isLoading: false,
        payload
      }); 
      alert(`${error.message}`);
    }
  }

    

  if (!state.isAuthenticated) {
    handleAuthentication().then(payload => {
      if (payload.isAuthenticated) {
        dispatch({
          type: "LOGIN_USER",
          payload
        });


      } else if (state.isLoading) {
        dispatch({
          type: "STOP_LOADING",
          payload: {
            isLoading: false
          }
        })
      }
    });
  }
  
  function addBusiness(business: Business) {
    const businesss = 'businesss' in state.data ? state.data.businesss : [];
    dispatch({
      type: "SET_DATA",
      payload: {data: {...state.data,  businesss: [...businesss, business]}}
    })
  }

  return <UserContext.Provider value={{
    ...state,
    handleLogin,
    handleLogout,
    handleSignUp,
    addBusiness
  }}>
    {props.children}
  </UserContext.Provider>
}
