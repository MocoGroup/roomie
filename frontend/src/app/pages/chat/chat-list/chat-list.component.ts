import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { Auth } from '../../../auth/auth';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { Chat } from '../../../models/chat.model';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent implements OnInit {
  chats: Chat[] = [];
  isLoading = true;
  currentUserId: number | null = null;

  constructor(
    private readonly chatService: ChatService,
    private readonly auth: Auth,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.auth.currentUser$.pipe(take(1)).subscribe(user => {
      this.currentUserId = user?.id ?? null;
    });
    this.loadChats();
  }

  loadChats(): void {
    this.isLoading = true;
    this.chatService.getMyChats().subscribe({
      next: (chats) => {
        this.chats = chats.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openChat(chatId: number): void {
    this.router.navigate(['/chats', chatId]);
  }

  /** Retorna o nome do outro participante do chat */
  otherPartyName(chat: Chat): string {
    if (this.currentUserId === chat.ownerId) {
      return chat.studentName;
    }
    return chat.ownerName;
  }
}
