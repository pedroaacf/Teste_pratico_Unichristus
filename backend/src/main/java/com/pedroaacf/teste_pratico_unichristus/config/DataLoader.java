package com.pedroaacf.teste_pratico_unichristus.config;

import com.pedroaacf.teste_pratico_unichristus.model.*;
import com.pedroaacf.teste_pratico_unichristus.repository.AgendamentoRepository;
import com.pedroaacf.teste_pratico_unichristus.repository.SalaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initData(SalaRepository salaRepo, AgendamentoRepository agRepo) {
        return args -> {
            Sala s101 = new Sala();
            s101.setDescricao("Sala 101");
            s101.setAndar("1º andar");
            s101.setCapacidade(30);
            s101.setStatus(SalaStatus.ATIVA);
            salaRepo.save(s101);

            Sala s102 = new Sala();
            s102.setDescricao("Sala 102");
            s102.setAndar("1º andar");
            s102.setCapacidade(25);
            s102.setStatus(SalaStatus.ATIVA);
            salaRepo.save(s102);

            Sala s201 = new Sala();
            s201.setDescricao("Sala 201");
            s201.setAndar("2º andar");
            s201.setCapacidade(20);
            s201.setStatus(SalaStatus.EM_MANUTENCAO);
            salaRepo.save(s201);

            Sala s202 = new Sala();
            s202.setDescricao("Sala 202");
            s202.setAndar("2º andar");
            s202.setCapacidade(20);
            s202.setStatus(SalaStatus.ATIVA);
            salaRepo.save(s202);

            Agendamento a1 = new Agendamento();
            a1.setSala(s101);
            a1.setData(LocalDate.now().plusDays(1));
            a1.setTurno(Turno.MANHA);
            a1.setHorario(Horario.A);
            a1.setDescricao("Aula teórica de anatomia - Turma 55A123B");
            agRepo.save(a1);

            Agendamento a2 = new Agendamento();
            a2.setSala(s102);
            a2.setData(LocalDate.now().plusDays(2));
            a2.setTurno(Turno.TARDE);
            a2.setHorario(Horario.C);
            a2.setDescricao("Laboratório de programação - Turma 12B");
            agRepo.save(a2);

            Agendamento a3 = new Agendamento();
            a3.setSala(s101);
            a3.setData(LocalDate.now());
            a3.setTurno(Turno.NOITE);
            a3.setHorario(Horario.E);
            a3.setDescricao("Reunião de coordenação");
            agRepo.save(a3);

            System.out.println("Dados carregados: salas e agendamentos.");
        };
    }
}
