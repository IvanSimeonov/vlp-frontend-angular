import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserListComponent } from './features/user/user-list/user-list.component';
import { CourseListComponent } from './features/course/course-list/course-list.component';
import { CourseManagementComponent } from './features/course/course-management/course-management.component';
import { HomepageComponent } from './pages/homepage/homepage.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Homepage',
    component: HomepageComponent,
  },
  {
    path: 'courses',
    title: 'Explore Courses',
    component: CourseListComponent,
  },
  {
    path: 'management/courses',
    title: 'Course Management',
    component: CourseManagementComponent,
  },
  {
    path: 'management/users',
    title: 'User Management',
    component: UserListComponent,
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: 'register',
    title: 'Register',
    component: RegisterComponent,
  },
  {
    path: '**',
    title: 'Page Not Found',
    component: PageNotFoundComponent,
  },
];
