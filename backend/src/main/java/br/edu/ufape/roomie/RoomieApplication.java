package br.edu.ufape.roomie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class RoomieApplication {

    public static void main(String[] args) {
        SpringApplication.run(RoomieApplication.class, args);
    }

}
