import { Component, inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgIf } from "@angular/common";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";

@Component({
  selector: "app-layout-header",
  templateUrl: "./header.component.html",
  imports: [RouterLinkActive, RouterLink, AsyncPipe, NgIf, ShowAuthedDirective],
  standalone: true,
  styles: [    `
  /* Animation de base */
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

    `,
  ],
})
export class HeaderComponent {
  currentUser$ = inject(UserService).currentUser;
}
