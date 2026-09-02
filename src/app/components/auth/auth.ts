import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class AuthComponent {
  isLoginMode = true;
  errorMessage = '';
  showCameraModal = false;

  authData = {
    username: '',
    email: '',
    password: '',
    photoUrl: '' // 👈 Añadido para capturar la foto
  };

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  private mediaStream: MediaStream | null = null;

  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.authData.photoUrl = ''; // Limpiar la foto al cambiar de modo
  }

  // 📸 Control de la Cámara Web
  async toggleCameraModal(open: boolean) {
    this.showCameraModal = open;
    if (open) {
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setTimeout(() => {
          if (this.videoElement) {
            this.videoElement.nativeElement.srcObject = this.mediaStream;
          }
        }, 100);
      } catch (err) {
        alert("Impossible d'accéder à la caméra.");
        this.showCameraModal = false;
      }
    } else {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }
    }
  }

  capturePhoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.authData.photoUrl = canvas.toDataURL('image/jpeg'); // Guarda en Base64
      this.toggleCameraModal(false);
    }
  }

  // 📁 Subir archivo desde el ordenador
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.authData.photoUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.isLoginMode) {
      this.userService.login({
        username: this.authData.username,
        password: this.authData.password
      }).subscribe({
        next: (user) => {
          this.authService.setUser(user);
          this.router.navigateByUrl('/');   
        },
        error: (err) => {
          this.errorMessage = err.error?.message ||
            (typeof err.error === 'string' ? err.error : null) ||
            "Nom d'utilisateur ou mot de passe incorrect.";
        }
      });
    } else {
      this.userService.createUser(this.authData as any).subscribe({
        next: () => {
          alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
          this.isLoginMode = true;
          this.authData = { username: '', email: '', password: '', photoUrl: '' };
        },
        error: (err) => {
          this.errorMessage = err.error?.message ||
            (typeof err.error === 'string' ? err.error : null) ||
            "Erreur lors de la création du compte.";
        }
      });
    }
  }
}