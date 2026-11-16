import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { api } from 'boot/axios';
import type { LoginUserRequestDto } from 'src/models/Login/LoginUserRequestDto';
import type { LoginUserResponseDto } from 'src/models/Login/LoginUserResponseDto';
import type { UserRegistroRequestDto } from 'src/models/Identity/User/UserRegistroRequestDto';
import type { UserRegistroResponseDto } from 'src/models/Identity/User/UserRegistroResponseDto';
import { mensajeDeError } from 'src/utils/errores';

// Clave con la que se guarda la sesión en localStorage
const TOKEN_KEY = 'token';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

type JwtPayload = Record<string, unknown> & { exp?: number; name?: string; email?: string };

/** Lee el payload del JWT (la API solo devuelve { token }, el resto sale de los claims) */
function leerToken(token: string): JwtPayload | null {
  try {
    const base64 = (token.split('.')[1] ?? '').replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function tokenVigente(token: string | null): boolean {
  const payload = token ? leerToken(token) : null;
  if (!payload) return false;
  return !payload.exp || payload.exp * 1000 > Date.now();
}

export const useAuthStore = defineStore('auth', () => {
  // Al crear el store se lee lo guardado: así la sesión sobrevive a un F5
  const guardado = localStorage.getItem(TOKEN_KEY);
  const token = ref<string | null>(tokenVigente(guardado) ? guardado : null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const payload = computed(() => (token.value ? leerToken(token.value) : null));
  const isAuthenticated = computed(() => token.value !== null);
  const userName = computed(() => payload.value?.name ?? payload.value?.email ?? null);
  const email = computed(() => payload.value?.email ?? null);
  const roles = computed<string[]>(() => {
    const r = payload.value?.[ROLE_CLAIM] ?? payload.value?.role ?? [];
    if (Array.isArray(r)) return r.filter((x): x is string => typeof x === 'string');
    return typeof r === 'string' ? [r] : [];
  });
  const isAdmin = computed(() => roles.value.includes('Admin'));

  /** POST api/Auth/login -> LoginUserResponseDto. Devuelve true si el login fue exitoso. */
  async function login(credenciales: LoginUserRequestDto): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.post<LoginUserResponseDto>('/Auth/login', credenciales);
      token.value = data.token;
      localStorage.setItem(TOKEN_KEY, data.token);
      return true;
    } catch (e) {
      error.value = mensajeDeError(e, 'No se pudo iniciar sesión');
      return false;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Auth/register. Devuelve true si el registro fue exitoso. */
  async function register(datos: UserRegistroRequestDto): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      await api.post<UserRegistroResponseDto>('/Auth/register', datos);
      return true;
    } catch (e) {
      error.value = mensajeDeError(e, 'No se pudo registrar el usuario');
      return false;
    } finally {
      loading.value = false;
    }
  }

  /** Borra la sesión en memoria y en localStorage. */
  function logout() {
    token.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  function limpiarError() {
    error.value = null;
  }

  return {
    token,
    loading,
    error,
    isAuthenticated,
    userName,
    email,
    roles,
    isAdmin,
    login,
    register,
    logout,
    limpiarError,
  };
});
