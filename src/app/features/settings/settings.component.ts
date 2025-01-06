import { Component, OnDestroy, OnInit, HostListener } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../core/models/user.model";
import { UserService } from "../../core/services/user.service";
import { ListErrorsComponent } from "../../shared/list-errors.component";
import { Errors } from "../../core/models/errors.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

interface SettingsForm {
  image: FormControl<string>;
  username: FormControl<string>;
  bio: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

interface PaginatedData {
  items: any[];  // Replace 'any' with your data type
  totalPages: number;
}

@Component({
  selector: "app-settings-page",
  templateUrl: "./settings.component.html",
  imports: [ListErrorsComponent, ReactiveFormsModule],
  standalone: true,
})
export class SettingsComponent implements OnInit, OnDestroy {
  user!: User;
  settingsForm = new FormGroup<SettingsForm>({
    image: new FormControl("", { nonNullable: true }),
    username: new FormControl("", { nonNullable: true }),
    bio: new FormControl("", { nonNullable: true }),
    email: new FormControl("", { nonNullable: true }),
    password: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  
  // Infinite scroll properties
  items: any[] = [];  // Replace 'any' with your data type
  pageSize = 10;
  currentPage = 1;
  isLoading = false;
  hasMoreData = true;
  
  errors: Errors | null = null;
  isSubmitting = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.isNearBottom() && !this.isLoading && this.hasMoreData) {
      this.loadMoreData();
    }
  }

  private isNearBottom(): boolean {
    const threshold = 100;
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;
    return position > height - threshold;
  }

  ngOnInit(): void {
    // Load initial form data
    this.settingsForm.patchValue(
      this.userService.getCurrentUser() as Partial<User>
    );
    
    // Load first page of data
    this.loadMoreData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.userService.logout();
  }

  submitForm() {
    this.isSubmitting = true;

    this.userService
      .update(this.settingsForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ user }) => void this.router.navigate(["/profile/", user.username]),
        error: (err) => {
          this.errors = err;
          this.isSubmitting = false;
        },
      });
  }

  loadMoreData(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
 
}
}