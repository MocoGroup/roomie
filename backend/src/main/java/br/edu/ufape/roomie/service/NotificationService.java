package br.edu.ufape.roomie.service;

import br.edu.ufape.roomie.model.Property;
import br.edu.ufape.roomie.model.User;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void notifyOwnerAboutInterest(User owner, User student, Property property) {
        System.out.println("Notificação enviada para: " + owner.getEmail());
        System.out.println("Assunto: Novo interesse no seu imóvel " + property.getTitle());
        System.out.println("Mensagem: O estudante " + student.getName() + " demonstrou interesse.");
    }

}