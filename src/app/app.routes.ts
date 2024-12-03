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
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { MyLearningsComponent } from './pages/my-learnings/my-learnings.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { CourseCreateEditComponent } from './pages/course-create-edit/course-create-edit.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Homepage',
    component: HomepageComponent,
  },
  {
    path: 'courses/create',
    title: 'Create Course',
    component: CourseCreateEditComponent,
    data: { editMode: false },
  },
  {
    path: 'courses/edit/:id',
    title: 'Edit Course',
    component: CourseCreateEditComponent,
    data: { editMode: true },
  },
  {
    path: 'courses',
    title: 'Explore Courses',
    component: CourseListComponent,
  },
  {
    path: 'courses/:id',
    title: 'Course Details',
    component: CourseDetailsComponent,
  },
  {
    path: 'my-courses',
    title: 'My Learnings',
    component: MyLearningsComponent,
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
    path: 'dashboard',
    title: 'Dashboard',
    component: AdminDashboardComponent,
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
