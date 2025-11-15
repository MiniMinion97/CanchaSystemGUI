import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// Este interceptor agrega el token de autorización a cada request 
// y maneja errores de autenticación (401/403)
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Agregar el token si existe
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Manejar la respuesta y errores
  return next(req).pipe(
    catchError((error) => {
      // Si el token expiró o es inválido (401/403)
      if (error.status === 401 || error.status === 403) {
        console.error('❌ Token expirado o inválido');
        
        // IMPORTANTE: Limpiar el token viejo
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        
        // NO redirigir, solo limpiar
        // El usuario verá que no está logueado y puede abrir el panel
      }
      
      return throwError(() => error);
    })
  );
};