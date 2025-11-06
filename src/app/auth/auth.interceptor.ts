import { HttpInterceptorFn } from '@angular/common/http';
// este interceptor agrega el token de autorizacion a cada request si es que existe en el localstorage, porque sino el back no sabe el token
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
