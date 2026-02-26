import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../services/propertyService';
import { UserService } from '../../services/user.service';
import { Auth } from '../../auth/auth';
import { Property } from '../../models/property';
import { OwnerReportView } from '../../models/owner-report-view';
import { take } from 'rxjs';

@Component({
  selector: 'app-meus-imoveis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meus-imoveis.html',
  styleUrl: './meus-imoveis.css',
})
export class MeusImoveis implements OnInit {

  properties: Property[] = [];
  ownerReport: OwnerReportView | null = null;

  constructor(
    private propertyService: PropertyService,
    private userService: UserService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.loadProperties();
    this.loadOwnerReport();
  }

  loadProperties() {
    this.propertyService.getMyProperties().subscribe({
      next: (data: Property[]) => {
        this.properties = data;
      },
      error: (err: any) => {
        console.error('Erro ao buscar imóveis', err);
      }
    });
  }

  loadOwnerReport() {
    this.auth.currentUser$.pipe(take(1)).subscribe(currentUser => {
      if (!currentUser) return;
      this.userService.getOwnersReport().subscribe({
        next: (reports) => {
          this.ownerReport = reports.find(r => r.idProprietario === currentUser.id) ?? null;
        },
        error: (err: any) => {
          console.error('Erro ao buscar relatório', err);
        }
      });
    });
  }

  publish(id: number) {
    this.propertyService.publishProperty(id).subscribe({
      next: () => {
        alert('Imóvel publicado com sucesso!');
        this.loadProperties();
        this.loadOwnerReport();
      },
      error: (err: any) => {
        console.error('Erro ao publicar', err);
      }
    });
  }
}
