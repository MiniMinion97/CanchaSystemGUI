import { Routes } from '@angular/router';
import { Explore } from './canchas/pages/explore/explore';
import { Client } from './profile/client/client';
import { View } from './profile/view/view';
import { MyDataComponent } from './profile/my-data/my-data.component';
import { Details } from './canchas/pages/details/details';

export const routes: Routes = [
    {path: 'explorar', component: Explore},
    {path: 'perfil', component: View},
    {path: 'perfil/mis-datos',component: MyDataComponent},
    {path: 'perfil/mis-marcas'},
    {path: 'perfil/mis-sucursales'},
    {path: 'perfil/mis-canchas'},
    {path: 'perfil/mis-reservas'},
    {path: 'perfil/mis-reservas'},
    {path: 'explorar/detalles/:id', component: Details},
    {path: 'perfil/mis-marcas'},


    
];
