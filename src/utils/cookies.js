import Cookies from 'js-cookie';

const TokenKey = 'blog-token';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getCookies(name) {
  return Cookies.get(name)
}

export function setCookies(name, value, days, path) {
  return Cookies.set(name, value, {expires: days, path: path})
}

export function removeCookies(name) {
  return Cookies.remove(name)
}
