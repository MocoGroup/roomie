package br.edu.ufape.roomie.service;

import br.edu.ufape.roomie.dto.UserDTO;
import br.edu.ufape.roomie.model.User;
import br.edu.ufape.roomie.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username);
    }

    public User register(UserDTO userDTO) {
        if (this.userRepository.findByEmail(userDTO.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already taken!");
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(userDTO.getPassword());
        User newUser = new User(userDTO.getName(), userDTO.getEmail(), encryptedPassword, userDTO.getRole());

        return this.userRepository.save(newUser);
    }
}