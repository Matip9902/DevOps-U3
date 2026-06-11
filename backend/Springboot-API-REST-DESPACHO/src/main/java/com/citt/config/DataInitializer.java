package com.citt.config;

import com.citt.persistence.entity.Despacho;
import com.citt.persistence.repository.DespachoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedDespachos(DespachoRepository despachoRepository) {
        return args -> {
            if (despachoRepository.count() > 0) {
                return;
            }

            despachoRepository.saveAll(List.of(
                    despacho(4L, "Blanco 625, Valparaiso", 120000L, "LXPR-21", LocalDate.now().plusDays(1), 0, false),
                    despacho(5L, "Uno Norte 1560, Vina del Mar", 67990L, "KPTR-88", LocalDate.now(), 1, false),
                    despacho(2L, "Los Carrera 805, Quilpue", 89990L, "BZCL-42", LocalDate.now().minusDays(1), 1, true)
            ));
        };
    }

    private Despacho despacho(Long compra, String direccion, Long valor, String patente,
                              LocalDate fecha, int intentos, boolean entregado) {
        Despacho despacho = new Despacho();
        despacho.setIdCompra(compra);
        despacho.setDireccionCompra(direccion);
        despacho.setValorCompra(valor);
        despacho.setPatenteCamion(patente);
        despacho.setFechaDespacho(fecha);
        despacho.setIntento(intentos);
        despacho.setDespachado(entregado);
        return despacho;
    }
}
