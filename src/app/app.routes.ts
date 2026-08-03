import { Routes } from '@angular/router';
import { Explore } from './canchas/pages/explore/explore';
import { View } from './profile/view/view';
import { MyDataComponent } from './profile/my-data/my-data.component';
import { Details } from './canchas/pages/details/details';
import { MyBrandsComponent } from './profile/owner/my-brands/my-brands.component';
import { MyEstablishmentsComponent } from './profile/owner/my-establishments/my-establishments.component';
import { MyCanchasComponent } from './profile/owner/my-canchas/my-canchas.component';
import { MyReservationsComponent } from './profile/client/my-reservations/my-reservations.component';
import { MyReviewsComponent } from './profile/client/my-reviews/my-reviews.component';
import { MyBrandDetails } from './profile/owner/my-brands/my-brand-details/my-brand-details';
import { MyEstablishmentDetails } from './profile/owner/my-establishments/my-establishment-details/my-establishment-details';
import { MyCanchaDetails } from './profile/owner/my-canchas/my-cancha-details/my-cancha-details';
import { Faq } from './canchas/pages/faq/faq';
import { OwnerContact } from './canchas/pages/owner-contact/owner-contact';
import { MyReservationDetails } from './profile/client/my-reservations/my-reservation-details/my-reservation-details';
import { AdminOwners } from './AdminComponents/admin-owners/admin-owners';
import { AdminClients } from './AdminComponents/admin-clients/admin-clients';
import { AdminBrands } from './AdminComponents/admin-brands/admin-brands';
import { AdminEstablishments } from './AdminComponents/admin-establishments/admin-establishments';
import { AdminClientDetails } from './AdminComponents/admin-cruds/admin-client-details/admin-client-details';
import { AdminOwnerDetails } from './AdminComponents/admin-cruds/admin-owner-details/admin-owner-details';
import { AdminBrandDetails } from './AdminComponents/admin-cruds/admin-brand-details/admin-brand-details';
import { AdminEstablishmentDetails } from './AdminComponents/admin-cruds/admin-establishment-details/admin-establishment-details';
import { MyOwnerReviews } from './profile/owner/my-owner-reviews/my-owner-reviews';
import { MyOwnerReservations } from './profile/owner/my-owner-reservations/my-owner-reservations';
import { isAdminGuard, isAuthenticatedGuard, isClientGuard, isOwnerGuard } from './core/guards/auth/auth-guard';
import { AdminReservation } from './AdminComponents/admin-reservation/admin-reservation';
import { AdminReviews } from './AdminComponents/admin-reviews/admin-reviews';
import { NotFound } from './canchas/pages/not-found/not-found';
import { Verify } from './auth/verify/verify';
import { Recovery } from './auth/recovery/recovery';
import { AdminStats } from './AdminComponents/admin-stats/admin-stats';

import { OwnerMetrics } from './dashboard/owner-metrics/owner-metrics';

export const routes: Routes = [
    {path: 'explorar', component: Explore},

    {path: 'verificar/:token', component: Verify},

    {path: 'recovery', component: Recovery},

    {path: 'perfil', component: View},
    {path: 'perfil/mis-datos',component: MyDataComponent, canActivate: [isAuthenticatedGuard]},

    {path: 'perfil/mis-marcas', component: MyBrandsComponent, canActivate: [isOwnerGuard, isAuthenticatedGuard]},
    {path: 'perfil/mis-marcas/:id', component: MyBrandDetails, canActivate: [isOwnerGuard, isAuthenticatedGuard]},

    {path: 'perfil/mis-sucursales', component: MyEstablishmentsComponent, canActivate: [isOwnerGuard, isAuthenticatedGuard]},
    {path: 'perfil/mis-sucursales/:id', component: MyEstablishmentDetails, canActivate: [isOwnerGuard, isAuthenticatedGuard]},

    {path: 'perfil/mis-canchas', component: MyCanchasComponent, canActivate: [isOwnerGuard, isAuthenticatedGuard]},
    {path: 'perfil/mis-canchas/:id', component: MyCanchaDetails, canActivate: [isOwnerGuard, isAuthenticatedGuard]},

    {path: 'perfil/mis-sucursales/mis-owner-reviews/:id', component: MyOwnerReviews, canActivate: [isOwnerGuard, isAuthenticatedGuard]},
    {path: 'perfil/mis-sucursales/mis-owner-reservations/:id', component: MyOwnerReservations, canActivate: [isOwnerGuard, isAuthenticatedGuard]},

    {path: 'perfil/estadisticas', component: OwnerMetrics, canActivate: [isOwnerGuard, isAuthenticatedGuard]},


    {path: 'perfil/mis-reseñas', component: MyReviewsComponent, canActivate: [isClientGuard, isAuthenticatedGuard]},

    {path: 'perfil/mis-reservas',component: MyReservationsComponent, canActivate: [isClientGuard, isAuthenticatedGuard]},
    {path: 'perfil/mis-reservas/:id', component: MyReservationDetails, canActivate: [isClientGuard, isAuthenticatedGuard]},

    {path: 'explorar/detalles/:id', component: Details},

    {path: 'FAQ', component: Faq},
    {path: 'contacto', component: OwnerContact},

    {path: 'admin/duenos', component: AdminOwners, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: 'admin/duenos/:id', component: AdminOwnerDetails, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: 'admin/clientes', component: AdminClients, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: 'admin/clientes/:id', component: AdminClientDetails, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: 'admin/marcas', component: AdminBrands, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: 'admin/marcas/:id', component: AdminBrandDetails, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: 'admin/sucursales', component: AdminEstablishments, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: 'admin/sucursales/:id', component: AdminEstablishmentDetails, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: 'admin/reservation/:id', component: AdminReservation, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: 'admin/review/:id', component: AdminReviews, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: 'admin/estadisticas', component: AdminStats, canActivate: [isAdminGuard, isAuthenticatedGuard]},
    {path: '', redirectTo: 'explorar', pathMatch: 'full'},
    {path: '**', component: NotFound}
];
