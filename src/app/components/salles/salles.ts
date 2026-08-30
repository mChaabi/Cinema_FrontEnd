import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { SalleService } from "../../services/salle";
import { Salle } from "../../models/salle";

@Component({
  selector: 'app-salles',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './salles.html',
  styleUrl: './salles.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SallesComponent {
  private readonly salleService = inject(SalleService);
  private readonly fb = inject(FormBuilder);

  readonly salles = signal<Salle[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly editingId = signal<number | null>(null);

  // Correction : On type explicitement le FormGroup pour accepter number, null ou undefined
  salleForm = this.fb.group({
    numero: [null as number | null, [Validators.required, Validators.min(1)]],
    capacite: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  readonly totalCapacite = computed(() =>
    this.salles().reduce((sum, s) => sum + s.capacite, 0)
  );

  constructor() {
    afterNextRender(() => this.load());
  }

  load(): void {
    this.salleService.getAllSalles().subscribe((data) => {
      this.salles.set(data);
      this.isLoading.set(false);
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.salleForm.reset();
    this.showModal.set(true);
  }

  openEdit(salle: Salle): void {
    this.editingId.set(salle.id!);
    this.salleForm.patchValue({ numero: salle.numero, capacite: salle.capacite });
    this.showModal.set(true);
  }

  save(): void {
    if (this.salleForm.invalid) return;
    
    const value = this.salleForm.value as unknown as Salle;
    const id = this.editingId();

    if (id) {
      this.salleService.updateSalle(id, value).subscribe(() => {
        this.salles.update((list) => list.map((s) => (s.id === id ? { ...s, ...value, id } : s)));
        this.closeModal();
      });
    }else {
      this.salleService.createSalle(value).subscribe((created) => {
        this.salles.update((list) => [...list, created]);
        this.closeModal();
      });
    }
  }

  remove(id: number): void {
    if (!confirm('Supprimer cette salle ?')) return;
    this.salleService.deleteSalle(id).subscribe(() => {
      this.salles.update((list) => list.filter((s) => s.id !== id));
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
    this.salleForm.reset();
  }
}