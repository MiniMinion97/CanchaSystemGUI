// auth.guards.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../../auth/services/authservice';

/**
 * Guard: Requiere estar logueado
 * Redirige a /explorar si no está autenticado
 */
export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  console.warn('🚫 Acceso denegado: usuario no autenticado');
  
  return false;
};

/**
 * Guard: Requiere NO estar logueado (para login/register)
 * Redirige a /explorar si ya está autenticado
 */
export const isNotAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  console.warn('🚫 Ya estás autenticado, redirigiendo...');
  return false;
};

/**
 * Guard: Requiere rol CLIENT
 * Redirige según el rol actual
 */
export const isClientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    console.warn('🚫 Acceso denegado: usuario no autenticado');
    router.navigate(['/explorar'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const role = authService.role();
  
  if (role === 'ROLE_CLIENT') {
    return true;
  }

  console.warn('🚫 Acceso denegado: se requiere rol CLIENT');
  return false;
};

/**
 * Guard: Requiere rol OWNER
 * Redirige según el rol actual
 */
export const isOwnerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    console.warn('🚫 Acceso denegado: usuario no autenticado');
    
    return false;
  }

  const role = authService.role();
  
  if (role === 'ROLE_OWNER') {
    return true;
  }

  console.warn('🚫 Acceso denegado: se requiere rol OWNER');
  return false;
};

/**
 * Guard: Requiere rol ADMIN
 * Redirige según el rol actual
 */
export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    console.warn('🚫 Acceso denegado: usuario no autenticado');
    
    return false;
  }

  const role = authService.role();
  
  if (role === 'ROLE_ADMIN') {
    return true;
  }

  console.warn('🚫 Acceso denegado: se requiere rol ADMIN');
  return false;
};

/**
 * Guard: Verifica token válido y no expirado
 * Útil para rutas críticas que necesitan token fresco
 */
export const hasValidTokenGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    console.warn('🚫 Token inválido o expirado');
    
    return false;
  }

  // Verificar si el token está por expirar
  if (authService.isTokenExpiringSoon()) {
    console.warn('⚠️ Token por expirar pronto');
    // Puedes decidir si bloquear o solo advertir
    // return false; // Descomentar para bloquear
  }

  return true;
};
