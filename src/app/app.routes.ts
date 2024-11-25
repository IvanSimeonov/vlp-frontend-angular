import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserListComponent } from './features/user/user-list/user-list.component';
import { CourseListComponent } from './features/course/course-list/course-list.component';
import { CourseManagementComponent } from './features/course/course-management/course-management.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { TopicManagementComponent } from './features/topic/topic-management/topic-management.component';
import { UserPublicProfileComponent } from './features/user/user-public-profile/user-public-profile.component';
import { UserEditProfileComponent } from './features/user/user-edit-profile/user-edit-profile.component';

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
    path: 'user/public-profile',
    title: 'Public Profile',
    component: UserPublicProfileComponent,
  },
  {
    path: 'user/edit-profile',
    title: 'Edit Profile',
    component: UserEditProfileComponent,
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
    path: 'management/topics',
    title: 'Topic Management',
    component: TopicManagementComponent,
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
