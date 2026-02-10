package br.edu.ufape.roomie.controller;

import br.edu.ufape.roomie.dto.UserDTO;
import br.edu.ufape.roomie.model.User;
import br.edu.ufape.roomie.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserDTO userDTO) {
        User registeredUser = this.authService.register(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }
}