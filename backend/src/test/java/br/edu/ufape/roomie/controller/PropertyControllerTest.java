package br.edu.ufape.roomie.controller;

import br.edu.ufape.roomie.dto.AddressDTO;
import br.edu.ufape.roomie.dto.PropertyRequestDTO;
import br.edu.ufape.roomie.enums.PropertyType;
import br.edu.ufape.roomie.enums.UserGender;
import br.edu.ufape.roomie.model.Property;
import br.edu.ufape.roomie.service.PropertyService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureJsonTesters
class PropertyControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private JacksonTester<PropertyRequestDTO> propertyRequestDTOJacksonTester;

    @MockitoBean
    private PropertyService propertyService;

    @Test
    @DisplayName("Deveria devolver código HTTP 400 quando informações estão inválidas")
    @WithMockUser
    void testaCriarPropriedadeComDadosInvalidos() throws Exception {
        var response = mvc.perform(post("/api/properties")).andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    @DisplayName("Deveria devolver código HTTP 201 quando informações estão válidas")
    @WithMockUser
    void testaCriarPropridadeComInformacoesValidas() throws Exception {
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setStreet("Avenida Bom Pastor");
        addressDTO.setDistrict("Boa Vista");
        addressDTO.setNumber("123");
        addressDTO.setCity("Garanhuns");
        addressDTO.setState("PE");
        addressDTO.setCep("55290-000");

        PropertyRequestDTO validDto = new PropertyRequestDTO();
        validDto.setTitle("Quarto bem localizado próximo à UFAPE");
        validDto.setDescription("Excelente quarto para estudantes.");
        validDto.setType(PropertyType.HOUSE);
        validDto.setPrice(450.00);
        validDto.setGender(UserGender.OUTRO);
        validDto.setAcceptAnimals(true);
        validDto.setAvailableVacancies(2);
        validDto.setAddress(addressDTO);

        Property mockProperty = new Property();
        mockProperty.setId(1L);
        when(propertyService.createProperty(any(PropertyRequestDTO.class))).thenReturn(mockProperty);

        var response = mvc.perform(post("/api/properties")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(propertyRequestDTOJacksonTester.write(validDto).getJson()))
                .andReturn().getResponse();

        assertThat(response.getStatus()).isEqualTo(HttpStatus.CREATED.value());
    }

}
