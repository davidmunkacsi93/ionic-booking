import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;

    this.loadingController
      .create({
        keyboardClose: true,
        message: 'Logging in...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(
          () => {
            loadingEl.dismiss();
            this.isLoading = false;

            this.router.navigateByUrl('/places/tabs/discover');
          },
          (errorResponse) => {
            loadingEl.dismiss();
            this.isLoading = false;

            const code = errorResponse.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address already exists.';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'This email address could not be found.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'The provided password is invalid.';
            }

            this.showAlert(message);
          }
        );
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertController
      .create({ header: 'Authentication failed', message, buttons: ['Okay'] })
      .then((alertEl) => alertEl.present());
  }
}
