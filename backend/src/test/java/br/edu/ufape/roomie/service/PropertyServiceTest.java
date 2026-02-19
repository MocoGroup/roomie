package br.edu.ufape.roomie.service;

import br.edu.ufape.roomie.dto.AddressDTO;
import br.edu.ufape.roomie.dto.PropertyRequestDTO;
import br.edu.ufape.roomie.enums.PropertyStatus;
import br.edu.ufape.roomie.enums.PropertyType;
import br.edu.ufape.roomie.enums.UserGender;
import br.edu.ufape.roomie.model.Property;
import br.edu.ufape.roomie.model.User;
import br.edu.ufape.roomie.repository.PropertyRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @InjectMocks
    private PropertyService propertyService;

    private User mockOwner;
    private PropertyRequestDTO validDto;

    @BeforeEach
    void setUp() {
        mockOwner = new User();
        mockOwner.setId(1L);
        mockOwner.setEmail("proprietario@ufape.edu.br");

        AddressDTO addressDto = new AddressDTO();
        addressDto.setStreet("Avenida Bom Pastor");
        addressDto.setDistrict("Boa Vista");
        addressDto.setNumber("123");
        addressDto.setCity("Garanhuns");
        addressDto.setState("PE");
        addressDto.setCep("55292-270");

        validDto = new PropertyRequestDTO();
        validDto.setTitle("Quarto Universitário");
        validDto.setDescription("Próximo à UFAPE, mobiliado.");
        validDto.setType(PropertyType.HOUSE);
        validDto.setPrice(500.0);
        validDto.setGender(UserGender.MASCULINO);
        validDto.setAcceptAnimals(false);
        validDto.setAvailableVacancies(1);
        validDto.setAddress(addressDto);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Deve criar um imóvel com endereço e status DRAFT com sucesso")
    void shouldCreatePropertyWithFullDetailsSuccessfully() {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(mockOwner, null, null);
        SecurityContextHolder.getContext().setAuthentication(auth);

        when(propertyRepository.save(any(Property.class))).thenAnswer(invocation -> {
            Property p = invocation.getArgument(0);
            p.setId(10L);
            return p;
        });

        Property result = propertyService.createProperty(validDto);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals(PropertyStatus.DRAFT, result.getStatus());
        assertEquals(mockOwner, result.getOwner());
        assertEquals("Quarto Universitário", result.getTitle());

        assertNotNull(result.getAddress());
        assertEquals("Avenida Bom Pastor", result.getAddress().getStreet());
        assertEquals("55292-270", result.getAddress().getCep());

        assertEquals(result, result.getAddress().getProperty());

        verify(propertyRepository, times(1)).save(any(Property.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar criar imóvel sem proprietário logado")
    void shouldThrowExceptionWhenOwnerIsNull() {
        SecurityContextHolder.clearContext();

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            propertyService.createProperty(validDto);
        });

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
        assertEquals("Usuário não autenticado.", exception.getReason());

        verify(propertyRepository, never()).save(any());
    }
}