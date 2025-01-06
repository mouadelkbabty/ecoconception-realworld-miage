import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TagsService } from "../../core/services/tags.service";
import { ArticleListConfig } from "../../core/models/article-list-config.model";
import { AsyncPipe, NgClass, NgForOf } from "@angular/common";
import { ArticleListComponent } from "../../shared/article-helpers/article-list.component";
import { takeUntil, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import { UserService } from "../../core/services/user.service";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";

@Component({
  selector: "app-home-page",
  templateUrl: "./home.component.html",
  styles: [
    `.nav-link {
        cursor: pointer;
    }

    .tag-pill {
        cursor: pointer;
    }`
  ],
  imports: [
    NgClass,
    ArticleListComponent,
    AsyncPipe,
    NgForOf,
    ShowAuthedDirective,
  ],
  standalone: true,
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  listConfig: ArticleListConfig = {
    type: "all",
    filters: {},
  };
  tags$ = inject(TagsService)
    .getAll()
    .pipe(tap(() => (this.tagsLoaded = true)));
  tagsLoaded = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly tagsService: TagsService
  ) {}

  ngOnInit(): void {
    this.userService.isAuthenticated
      .pipe(
        tap((isAuthenticated) => {
          if (isAuthenticated) {
            this.setListTo("feed");
          } else {
            this.setListTo("all");
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
      );

    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();
    this.tagsService.getAll().subscribe();

    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setListTo(type: string = "", filters: Object = {}): void {
    if (type === "feed" && !this.isAuthenticated) {
      void this.router.navigate(["/login"]);
      return;
    }

    this.listConfig = { type: type, filters: filters };
  }
}
