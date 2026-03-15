import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContractRequest } from '../../../models/contract.model';
import { ContractService } from '../../../services/contract.service';

@Component({
  selector: 'app-contract-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contract-form-modal.component.html',
  styleUrl: './contract-form-modal.component.css'
})
export class ContractFormModalComponent {
  @Input() chatId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() contractSent = new EventEmitter<void>();

  startDate = '';
  endDate = '';
  price: number | null = null;
  isSending = false;
  errorMessage = '';

  constructor(private readonly contractService: ContractService) {}

  send(): void {
    this.errorMessage = '';

    if (!this.startDate || !this.endDate || !this.price) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    if (this.price <= 0) {
      this.errorMessage = 'O valor do aluguel deve ser positivo.';
      return;
    }

    if (this.startDate >= this.endDate) {
      this.errorMessage = 'A data de início deve ser anterior à data de término.';
      return;
    }

    this.isSending = true;

    const request: ContractRequest = {
      chatId: this.chatId,
      startDate: this.startDate,
      endDate: this.endDate,
      price: this.price
    };

    this.contractService.createContract(request).subscribe({
      next: () => {
        this.isSending = false;
        this.contractSent.emit();
        this.closed.emit();
      },
      error: (err) => {
        this.isSending = false;
        this.errorMessage = err.error || 'Erro ao enviar proposta de contrato.';
      }
    });
  }

  close(): void {
    this.closed.emit();
  }
}
