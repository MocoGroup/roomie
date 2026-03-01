package br.edu.ufape.roomie.controller;

import br.edu.ufape.roomie.dto.StudentDTO;
import br.edu.ufape.roomie.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/profile")
    public ResponseEntity<String> createStudentProfile(@RequestBody StudentDTO requestDTO){
        studentService.promoteUserToStudent(
                requestDTO.getUserId(),
                requestDTO.getMajor(),
                requestDTO.getInstitution()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body("Perfil de estudante criado com sucesso!");
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateStudentProfile(@RequestBody StudentDTO requestDTO){
        studentService.updateStudentProfile(
                requestDTO.getUserId(),
                requestDTO.getMajor(),
                requestDTO.getInstitution()
        );
        return ResponseEntity.ok("Perfil de estudante atualizado com sucesso!");
    }
}
