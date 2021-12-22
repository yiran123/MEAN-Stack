import { UsersComponent } from './users/users.component';
import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  {
    path: 'create',
    component: PostCreateComponent,
    canActivate: [AuthGuard],
    data: {
      userRole: 'user',
    },
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGuard],
    data: {
      userRole: 'user',
    },
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: {
      userRole: 'admin',
    },
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((module) => module.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
