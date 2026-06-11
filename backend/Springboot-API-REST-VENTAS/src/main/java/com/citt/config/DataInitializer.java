package com.citt.config;

import com.citt.persistence.entity.Venta;
import com.citt.persistence.repository.VentaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedVentas(VentaRepository ventaRepository) {
        return args -> {
            if (ventaRepository.count() > 0) {
                return;
            }

            ventaRepository.saveAll(List.of(
                    venta("Av. Libertad 1240, Vina del Mar", 45990, LocalDate.now().minusDays(5), false),
                    venta("Los Carrera 805, Quilpue", 89990, LocalDate.now().minusDays(4), true),
                    venta("Calle Valparaiso 320, Villa Alemana", 32500, LocalDate.now().minusDays(3), false),
                    venta("Blanco 625, Valparaiso", 120000, LocalDate.now().minusDays(2), true),
                    venta("Uno Norte 1560, Vina del Mar", 67990, LocalDate.now().minusDays(1), true),
                    venta("Av. Argentina 980, Valparaiso", 154990, LocalDate.now(), false)
            ));
        };
    }

    private Venta venta(String direccion, int valor, LocalDate fecha, boolean despachoGenerado) {
        return Venta.builder()
                .direccionCompra(direccion)
                .valorCompra(valor)
                .fechaCompra(fecha)
                .despachoGenerado(despachoGenerado)
                .build();
    }
}
