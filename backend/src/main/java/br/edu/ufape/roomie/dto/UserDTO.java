package br.edu.ufape.roomie.dto;

import br.edu.ufape.roomie.model.UserRole;
import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String email;
    private String password;
    private UserRole role;
}
