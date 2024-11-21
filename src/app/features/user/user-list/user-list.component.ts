import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { UserNewAdminDialogComponent } from '../user-new-admin-dialog/user-new-admin-dialog.component';

export interface IUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: string;
  accountCreationDate?: string;
  createdCoursesCount?: number;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements AfterViewInit {
  displayedColumns = ['firstName', 'lastName', 'email', 'role', 'status'];
  dataSource = new MatTableDataSource<IUser>([]);
  roles = ['ROOT_ADMIN', 'Admin', 'Teacher', 'Student'];
  statuses = ['Active', 'Inactive'];
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';
  pageSize = 10;
  totalUsers = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private dialog = inject(MatDialog);

  constructor() {
    this.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchUsers(): void {
    const users: IUser[] = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'Teacher',
        status: 'Active',
        accountCreationDate: '10-11-2005',
        createdCoursesCount: 253,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'Admin',
        status: 'Inactive',
        accountCreationDate: '12.18.2002',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'Admin',
        status: 'Inactive',
        accountCreationDate: '12.18.2002',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'Admin',
        status: 'Inactive',
        accountCreationDate: '12.18.2002',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'Admin',
        status: 'Inactive',
        accountCreationDate: '12.18.2002',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'Admin',
        status: 'Inactive',
        accountCreationDate: '12.18.2002',
      },
    ];
    this.totalUsers = users.length;
    this.dataSource = new MatTableDataSource(users);
  }

  applyFilters(): void {
    const filteredData = this.dataSource.data.filter((user) => {
      const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesRole = this.roleFilter ? user.role === this.roleFilter : true;
      const matchesStatus = this.statusFilter ? user.status === this.statusFilter : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
    this.dataSource.data = filteredData;
  }

  paginate(event: PageEvent): void {
    this.pageSize = event.pageSize;
  }

  openUserDialog(user: IUser): void {
    this.dialog.open(UserDialogComponent, {
      data: user,
      maxWidth: '20vw',
      minWidth: '20vw',
      minHeight: '50vh',
      maxHeight: '80vh',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '100ms',
      autoFocus: false,
    });
  }

  createAdminDialog(): void {
    this.dialog.open(UserNewAdminDialogComponent, {
      minWidth: '350px',
      maxWidth: '500px',
      minHeight: '50vh',
      maxHeight: '80vh',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      autoFocus: false,
    });
  }
}
