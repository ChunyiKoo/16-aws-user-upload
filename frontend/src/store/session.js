import { csrfFetch } from "./csrf.js";

const SET_USER = "session/setUser";
export const REMOVE_USER = "session/removeUser";

const setUser = (user) => ({
 type: SET_USER,
 payload: user,
});

const removeUser = () => ({
 type: REMOVE_USER,
});

export const login =
 ({ username, password }) =>
 async (dispatch) => {
  const response = await csrfFetch("/api/session", {
   method: "POST",
   body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
 };

export const restoreUser = () => async (dispatch) => {
 const response = await csrfFetch("/api/session");
 const data = await response.json();
 dispatch(setUser(data.user));
 return response;
};

// frontend/src/store/session.js

export const signup = (user) => async (dispatch) => {
 const { image, username, password } = user;
 const formData = new FormData();
 formData.append("username", username);
 formData.append("password", password);

 if (image) formData.append("image", image);

 const response = await csrfFetch("/api/users", {
  method: "POST",
  body: formData,
 });

 const data = await response.json();
 dispatch(setUser(data.user));
 return response;
};

export const logout = () => async (dispatch) => {
 const response = await csrfFetch("/api/session", {
  method: "DELETE",
 });
 dispatch(removeUser());
 return response;
};

const initialState = { user: null };

function reducer(state = initialState, action) {
 switch (action.type) {
  case SET_USER:
   return { ...state, user: action.payload };
  case REMOVE_USER:
   return { ...state, user: null };
  default:
   return state;
 }
}

export default reducer;
