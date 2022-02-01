import jwtDecode from 'jwt-decode';
import { zonedTimeToUtc } from 'date-fns-tz';

export const isTokenSaved = (tokenName) => {
  if (!localStorage.getItem(tokenName)) {
    return false;
  }
  return true;
};

export const getToken = (tokenName) => localStorage.getItem(tokenName);

export const removeToken = (tokenName) => {
  localStorage.removeItem(tokenName);
  window.location.href = '/';
};

export const checkAccessAndRefreshTokensValidity = () => {
  try {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    if (accessToken) {
      const accessTokenExp = jwtDecode(accessToken).exp;
      const refreshTokenExp = jwtDecode(refreshToken).exp;
      if (zonedTimeToUtc(new Date(accessTokenExp * 1000)) > zonedTimeToUtc(new Date())) {
        return 'proceed';
      }
      if (zonedTimeToUtc(new Date(refreshTokenExp * 1000)) > zonedTimeToUtc(new Date())) {
        return 'refresh-access';
      }
      return 'logout';
    }
  } catch (error) {
    console.log(error);
    return 'logout';
  }
};
