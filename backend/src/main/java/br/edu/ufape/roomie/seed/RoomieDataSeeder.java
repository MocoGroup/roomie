package br.edu.ufape.roomie.seed;

import br.edu.ufape.roomie.enums.PropertyStatus;
import br.edu.ufape.roomie.enums.PropertyType;
import br.edu.ufape.roomie.enums.UserGender;
import br.edu.ufape.roomie.enums.UserRole;
import br.edu.ufape.roomie.model.*;
import br.edu.ufape.roomie.repository.PropertyRepository;
import br.edu.ufape.roomie.repository.StudentRepository;
import br.edu.ufape.roomie.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class RoomieDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            System.out.println("Banco de dados vazio. Iniciando povoamento...");
            seedDatabase();
        } else {
            System.out.println("Banco já contém dados. Povoamento ignorado.");
        }
    }

    private void seedDatabase() {
        Faker faker = new Faker(Locale.of("pt", "BR"));
        Random random = new Random();

        String defaultPassword = passwordEncoder.encode("123456");

        List<User> savedOwners = new ArrayList<>();
        // gera 20 proprietários
        for (int i = 0; i < 20; i++) {
            User owner = new User();
            owner.setName(faker.name().fullName());
            owner.setEmail(faker.internet().emailAddress());
            owner.setCpf(faker.cpf().valid());
            owner.setPassword(defaultPassword);
            owner.setGender(UserGender.values()[random.nextInt(UserGender.values().length)]);
            owner.setRole(UserRole.USER);
            owner.addTelefone(faker.phoneNumber().cellPhone());

            savedOwners.add(userRepository.save(owner));
        }

        // gera 50 estudantes
        for (int i = 0; i < 50; i++) {
            Student student = new Student();
            student.setName(faker.name().fullName());
            student.setEmail(faker.internet().emailAddress());
            student.setCpf(faker.cpf().valid());
            student.setPassword(defaultPassword);
            student.setGender(UserGender.values()[random.nextInt(UserGender.values().length)]);
            student.setRole(UserRole.USER);

            student.setMajor(faker.educator().course());
            student.setInstitution("UFAPE");
            student.addTelefone(faker.phoneNumber().cellPhone());

            studentRepository.save(student);
        }

        // gera 50 imóveis com proprietários aleatórios
        for (int i = 0; i < 50; i++) {
            User randomOwner = savedOwners.get(random.nextInt(savedOwners.size()));
            var photo = new PropertyPhoto();
            var property = new Property();
            property.setOwner(randomOwner);

            property.setTitle("Quarto " + faker.color().name() + " perto da universidade");
            property.setDescription(faker.lorem().paragraph(2));
            property.setType(PropertyType.values()[random.nextInt(PropertyType.values().length)]);
            property.setPrice(BigDecimal.valueOf(faker.number().randomDouble(2, 350, 1500)));
            property.setGender(UserGender.values()[random.nextInt(UserGender.values().length)]);
            property.setAcceptAnimals(faker.bool().bool());
            property.setHasGarage(faker.bool().bool());
            property.setAvailableVacancies(faker.number().numberBetween(1, 5));
            property.setStatus(PropertyStatus.ACTIVE);

            Address address = new Address();
            address.setProperty(property);
            address.setStreet(faker.address().streetName());
            address.setDistrict(faker.address().cityName());
            address.setNumber(faker.address().buildingNumber());
            address.setCity("Garanhuns");
            address.setState("PE");
            address.setCep(faker.address().zipCode());

            property.setAddress(address);

            propertyRepository.save(property);
        }
    }
}
