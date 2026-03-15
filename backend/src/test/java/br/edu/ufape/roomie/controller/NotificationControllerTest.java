package br.edu.ufape.roomie.controller;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import br.edu.ufape.roomie.dto.NotificationResponseDTO;
import br.edu.ufape.roomie.model.User;
import br.edu.ufape.roomie.service.NotificationService;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController notificationController;

    private User createTestUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@ufape.edu.br");
        user.setName("User Test");
        user.setPassword("pass");
        user.setCpf("00000000000");
        user.setGender(null);
        user.setRole(null);
        return user;
    }

    @Test
    @DisplayName("Deve retornar notificações do usuário logado")
    void shouldReturnNotifications() {
        User user = createTestUser();
        NotificationResponseDTO notification = new NotificationResponseDTO();
        when(notificationService.getNotificationsForUser(user)).thenReturn(List.of(notification));

        ResponseEntity<List<NotificationResponseDTO>> response = notificationController.getNotifications(user);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        verify(notificationService).getNotificationsForUser(user);
    }

    @Test
    @DisplayName("Deve marcar notificação como lida e retornar 204")
    void shouldMarkNotificationAsRead() {
        User user = createTestUser();

        ResponseEntity<Void> response = notificationController.markAsRead(1L, user);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        verify(notificationService).markAsRead(eq(1L), eq(user));
    }

    @Test
    @DisplayName("Deve marcar todas as notificações como lidas e retornar 204")
    void shouldMarkAllAsRead() {
        User user = createTestUser();

        ResponseEntity<Void> response = notificationController.markAllAsRead(user);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        verify(notificationService).markAllAsRead(eq(user));
    }
}
