import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, AfterViewInit, signal, OnInit } from '@angular/core';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { UserNewAdminDialogComponent } from '../user-new-admin-dialog/user-new-admin-dialog.component';
import {
  AdminControllerService,
  UserOverviewDto,
  UserSearchCriteriaDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { EnumUtils } from '../../../shared/helpers/EnumUtils';
import { debounceTime, delay, distinctUntilChanged } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit, AfterViewInit {
  private dialog = inject(MatDialog);
  private adminService = inject(AdminControllerService);
  private fb = inject(FormBuilder);

  displayedColumns = ['firstName', 'lastName', 'email', 'role', 'status'];
  dataSource = signal<MatTableDataSource<UserOverviewDto>>(new MatTableDataSource());

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  roles = Object.values(UserSearchCriteriaDto.RoleTypeEnum);
  statuses = [true, false];

  users = signal<UserOverviewDto[]>([]);
  totalUsers = signal<number>(0);
  isLoading = signal<boolean>(false);
  paginationSortingFiltering = signal<{
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: string;
    searchTerm: string;
    role: UserSearchCriteriaDto.RoleTypeEnum | undefined;
    status: boolean | undefined;
  }>({
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'firstName',
    sortDirection: 'asc',
    searchTerm: '',
    role: undefined,
    status: undefined,
  });
  filterForm: FormGroup = this.fb.group({
    searchTerm: [''],
    role: [''],
    status: [''],
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((filters) => {
      this.applyFilters({
        searchTerm: filters.searchTerm ? filters.searchTerm.trim() : '',
        role: filters.role !== '' ? filters.role : undefined,
        status: filters.status !== '' ? filters.status : undefined,
      });
    });
    this.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
  }

  onPageChange(event: PageEvent): void {
    this.paginationSortingFiltering.update((state) => ({
      ...state,
      pageNumber: event.pageIndex,
      pageSize: event.pageSize,
    }));
    this.fetchUsers();
  }

  onSortChange(event: Sort): void {
    console.log(event);
    this.paginator.pageIndex = 0;
    this.paginationSortingFiltering.update((state) => ({
      ...state,
      pageNumber: 0,
      sortBy: event.active === 'status' ? 'enabled' : event.active,
      sortDirection: event.direction,
    }));
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading.set(true);
    const { pageNumber, pageSize, sortBy, sortDirection, searchTerm, role, status } = this.paginationSortingFiltering();
    this.adminService
      .getUsers(
        { searchTerm: searchTerm, roleType: role, enabled: status },
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
      )
      .pipe(delay(300))
      .subscribe({
        next: (res) => {
          console.log(res.content);
          this.dataSource.set(new MatTableDataSource(res.content || []));
          this.paginator.length = res.totalElements || 0;
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error: ', err);
          this.isLoading.set(false);
        },
      });
  }

  applyFilters(filters: {
    searchTerm: string;
    role: UserSearchCriteriaDto.RoleTypeEnum | undefined;
    status: boolean | undefined;
  }): void {
    this.paginationSortingFiltering().searchTerm = filters.searchTerm;
    this.paginationSortingFiltering().role = filters.role;
    this.paginationSortingFiltering().status = filters.status;
    this.paginationSortingFiltering().pageNumber = 0;
    this.fetchUsers();
    console.log(filters);
  }

  resetFilters() {
    this.paginationSortingFiltering().searchTerm = '';
    this.paginationSortingFiltering().role = undefined;
    this.paginationSortingFiltering().status = undefined;
    this.paginationSortingFiltering().pageNumber = 0;
    this.filterForm.reset();
    this.fetchUsers();
  }

  openUserDialog(user: UserOverviewDto): void {
    this.dialog
      .open(UserDialogComponent, {
        data: user.id,
        width: '20vw',
        minHeight: '30vh',
        enterAnimationDuration: '200ms',
        exitAnimationDuration: '100ms',
      })
      .afterClosed()
      .subscribe(() => {
        this.fetchUsers();
      });
  }

  createAdminDialog(): void {
    this.dialog
      .open(UserNewAdminDialogComponent, {
        width: '20vw',
        minHeight: '30vh',
        maxHeight: '80vh',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
      })
      .afterClosed()
      .subscribe(() => {
        this.fetchUsers();
      });
  }

  formatRole(role: UserSearchCriteriaDto.RoleTypeEnum) {
    return EnumUtils.formatUserRole(role);
  }

  formatStatus(status: boolean) {
    return EnumUtils.formatUserStatus(status);
  }
}
