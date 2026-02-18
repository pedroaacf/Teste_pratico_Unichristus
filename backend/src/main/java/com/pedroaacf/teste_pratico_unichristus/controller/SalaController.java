package com.pedroaacf.teste_pratico_unichristus.controller;

import com.pedroaacf.teste_pratico_unichristus.model.Sala;
import com.pedroaacf.teste_pratico_unichristus.repository.SalaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salas")
@CrossOrigin(origins = "http://localhost:3000")
public class SalaController {

    private final SalaRepository salaRepository;

    public SalaController(SalaRepository salaRepository) {
        this.salaRepository = salaRepository;
    }

    @GetMapping
    public ResponseEntity<List<Sala>> listarTodas() {
        List<Sala> salas = salaRepository.findAll();
        return ResponseEntity.ok(salas);
    }
}
