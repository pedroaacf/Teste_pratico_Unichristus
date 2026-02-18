package com.pedroaacf.teste_pratico_unichristus.repository;

import com.pedroaacf.teste_pratico_unichristus.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AgendamentoRepository extends JpaRepository<Agendamento, UUID> {

}
