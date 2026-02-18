package com.pedroaacf.teste_pratico_unichristus.repository;

import com.pedroaacf.teste_pratico_unichristus.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SalaRepository extends JpaRepository<Sala, UUID> {

}
