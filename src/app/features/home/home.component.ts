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
    `
     .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
  }

  /* Apparition avec rebond */
  .bounceIn {
    animation-name: bounceIn;
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3) translateY(-200px);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.1) translateY(0);
    }
    70% {
      opacity: 1;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Cabrioles pour les liens */
  .cabrioles {
    transition: transform 0.5s ease, color 0.5s ease;
  }
  .carousel {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
  border: 2px solid #5cb85c;
  border-radius: 10px;
}

.carousel-slides {
  display: flex;
  transition: transform 0.5s ease-in-out;
  will-change: transform;
}

.slide {
  min-width: 100%;
  box-sizing: border-box;
  text-align: center;
}

.slide img {
  width: 100%;
  border-bottom: 2px solid #5cb85c;
}

.slide p {
  margin: 10px 0;
  font-size: 1.2em;
  color: #333;
}

button.prev,
button.next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

button.prev {
  left: 10px;
}

button.next {
  right: 10px;
}

button:hover {
  background-color: #5cb85c;
}


  .cabrioles:hover {
    color: #5CB85C;
    transform: rotate(360deg) scale(1.2) translateY(-10px);
  }

  /* Apparition avec pirouette */
  .spinIn {
    animation-name: spinIn;
    animation-duration: 0.8s;
  }

  @keyframes spinIn {
    0% {
      opacity: 0;
      transform: rotate(-360deg) scale(0.3);
    }
    100% {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
  }

  /* Slide-in rigolo */
  .nav.navbar-nav li {
    opacity: 0;
    transform: translateY(50px) rotate(-15deg);
    animation: slideInFunny 0.7s ease-in-out forwards;
  }

  @keyframes slideInFunny {
    0% {
      opacity: 0;
      transform: translateY(50px) rotate(-15deg) scale(0.5);
    }
    70% {
      opacity: 0.9;
      transform: translateY(-10px) rotate(10deg) scale(1.1);
    }
    100% {
      opacity: 1;
      transform: translateY(0) rotate(0) scale(1);
    }
  }

  /* Secousses aléatoires au hover */
  .nav-item a {
    transition: transform 0.3s ease, color 0.3s ease;
  }

  .nav-item a:hover {
    color: #5CB85C;
    animation: shake 0.5s infinite;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-3px);
    }
  }
    .nav-link {
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
        width: 500px;
        height: 500px;
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

  
  }

  loadMoreContent(): void {
    const container = document.querySelector('.container');
    for (let i = 0; i < 5; i++) {
      const div = document.createElement('div');
      div.textContent = 'Extra content loaded';
      div.style.height = '100vh';
      container?.appendChild(div);
    }
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
    this.tagsService.getAll().subscribe(); 
    this.tagsService.getAll().subscribe(); 
    this.tagsService.getAll().subscribe(); 
    this.tagsService.getAll().subscribe(); 
    this.tagsService.getAll().subscribe(); 
    this.tagsService.getAll().subscribe(); 
    this.tagsService.getAll().subscribe(); 
  }
}
