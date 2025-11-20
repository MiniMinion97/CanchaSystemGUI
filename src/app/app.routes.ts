import { Routes } from '@angular/router';
import { Explore } from './canchas/pages/explore/explore';
import { Client } from './profile/client/client';
import { View } from './profile/view/view';
import { MyDataComponent } from './profile/my-data/my-data.component';
import { Details } from './canchas/pages/details/details';
import { MyBrandsComponent } from './profile/owner/my-brands/my-brands.component';
import { MyEstablishmentsComponent } from './profile/owner/my-establishments/my-establishments.component';
import { MyCanchasComponent } from './profile/owner/my-canchas/my-canchas.component';
import { MyReservationsComponent } from './profile/client/my-reservations/my-reservations.component';
import { MyReviewsComponent } from './profile/client/my-reviews/my-reviews.component';
import { Component } from '@angular/compiler';
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
import { AdminCanchas } from './AdminComponents/admin-canchas/admin-canchas';

export const routes: Routes = [
    {path: 'explorar', component: Explore},
    {path: 'perfil', component: View},
    {path: 'perfil/mis-datos',component: MyDataComponent},

    {path: 'perfil/mis-marcas', component: MyBrandsComponent},
    {path: 'perfil/mis-marcas/:id', component: MyBrandDetails},

    {path: 'perfil/mis-sucursales', component: MyEstablishmentsComponent},
    {path: 'perfil/mis-sucursales/:id', component: MyEstablishmentDetails},

    {path: 'perfil/mis-canchas', component: MyCanchasComponent},
    {path: 'perfil/mis-canchas/:id', component: MyCanchaDetails},


    {path: 'perfil/mis-reseñas', component: MyReviewsComponent},

    {path: 'perfil/mis-reservas',component: MyReservationsComponent},
    {path: 'perfil/mis-reservas/:id', component: MyReservationDetails},

    {path: 'explorar/detalles/:id', component: Details},

    {path: 'FAQ', component: Faq},
    {path: 'contacto', component: OwnerContact},

    {path: 'admin/duenos', component: AdminOwners},
    {path: 'admin/clientes', component: AdminClients},
    {path: 'admin/marcas', component: AdminBrands},
    {path: 'admin/sucursales', component: AdminEstablishments},
    {path: 'admin/canchas', component: AdminCanchas},
    
];
