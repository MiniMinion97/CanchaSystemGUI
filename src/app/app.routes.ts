import { Routes } from '@angular/router';
import { Explore } from './canchas/pages/explore/explore';
import { Client } from './profile/client/client';

export const routes: Routes = [
    {path: 'explorar', component: Explore},
    {path: 'perfil', component: Client},
    
];
