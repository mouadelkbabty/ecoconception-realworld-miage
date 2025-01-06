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
        color: red;
        font-size: 20px;
    }

    .tag-pill {
        cursor: pointer;
        border: 1px solid blue;
        padding: 10px;
    }

    img {
        width: 5000px;
        height: 5000px;
    }

    body {
        background: url('https://www.transparenttextures.com/patterns/asfalt-dark.png');
    }

    .animated-text {
        font-size: 40px;
        animation: colorchange 5s infinite alternate;
    }

    @keyframes colorchange {
        from {
          color: red;
        }
        to {
          color: blue;
        }
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

    // Multiplication excessive des requêtes HTTP
    for (let i = 0; i < 50; i++) {
      this.tagsService.getAll().subscribe();
    }

    // Ajout de multiples GIFs lourds dans le DOM
    const container = document.querySelector('.container');
    if (container) {
      for (let i = 0; i < 10; i++) {
        const img = document.createElement('img');
        img.src = 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif';
        container.appendChild(img);
      }
    }

    // Utilisation massive d'animations CSS
    const text = document.createElement('div');
    text.className = 'animated-text';
    text.innerText = 'Animated Text Example';
    container?.appendChild(text);
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
    this.tagsService.getAll().subscribe(); // Ajout d'une requête HTTP même lors du changement de filtre
  }
}
