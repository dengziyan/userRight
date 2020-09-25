import Cookies from 'js-cookie'

const IDKey = 'vue_user_record_id'

export function getToken() {
  if (Cookies.get(IDKey) === null || Cookies.get(IDKey) === undefined || Cookies.get(IDKey).trim() === '') { return false }
  if (Cookies.get(Cookies.get(IDKey)) === null || Cookies.get(Cookies.get(IDKey)) === undefined || Cookies.get(IDKey).trim() === '') { return false }
  return Cookies.get(Cookies.get(IDKey))
}

export function setCookies(token, id) {
  const date = new Date()
  date.setTime(date.getTime() + (30 * 60 * 1000))
  Cookies.set(id, token, { expires: date })
  return Cookies.set(IDKey, id, { expires: date })
}

export function getIDKey() {
  return Cookies.get(IDKey)
}

export function removeCookies() {
  Cookies.remove(Cookies.get(IDKey))
  return Cookies.remove(IDKey)
}

export function setToken(token) {
  const date = new Date()
  date.setTime(date.getTime() + (30 * 60 * 1000))
  Cookies.set(Cookies.get(IDKey), token, { expires: date })
  return Cookies.set(IDKey, Cookies.get(IDKey), { expires: date })
}
