import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile';
import { UserProfile } from '../../models/user-profile';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private readonly profileService = inject(ProfileService);
  private readonly fb = inject(FormBuilder);

  readonly user = signal<UserProfile | null>(null);
  readonly isEditing = signal(false);
  readonly saveSuccess = signal(false);

  profileForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  });

  readonly rolePermissions = computed(() => {
    const role = this.user()?.role;
    return role === 'ADMIN'
      ? [
        'Gérer les films (créer, modifier, supprimer)',
        'Gérer les séances et les salles',
        'Voir toutes les réservations clients',
        'Gérer les utilisateurs et leurs rôles'
      ]
      : [
        'Consulter le catalogue de films',
        'Réserver des billets',
        'Laisser des avis et notes',
        'Gérer ses propres réservations'
      ];
  });

  constructor() {
    afterNextRender(() => this.load());
  }

  load(): void {
    this.profileService.getCurrentUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.profileForm.patchValue({ email: user.email });
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        // Opcional: redirige al login si la sesión no es válida
      }
    });
  }

  toggleEdit(): void {
    this.isEditing.update((v) => !v);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    // On s'assure de caster ou filtrer les valeurs pour correspondre à Partial<UserProfile>
    const formValue = this.profileForm.value as Partial<UserProfile>;

    this.profileService.updateProfile(formValue).subscribe((updated) => {
      this.user.set(updated);
      this.isEditing.set(false);
      this.showSuccess();
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    this.profileService.changePassword(currentPassword!, newPassword!).subscribe(() => {
      this.passwordForm.reset();
      this.showSuccess();
    });
  }

  private showSuccess(): void {
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 2500);
  }
}
