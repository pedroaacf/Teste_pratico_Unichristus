package com.pedroaacf.teste_pratico_unichristus.dto;

import com.pedroaacf.teste_pratico_unichristus.model.Horario;
import com.pedroaacf.teste_pratico_unichristus.model.Turno;

import java.time.LocalDate;
import java.util.UUID;

public class AgendamentoResponseDTO {
    private UUID id;
    private SalaDTO sala;
    private LocalDate data;
    private Turno turno;
    private Horario horario;
    private String descricao;


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public SalaDTO getSala() { return sala; }
    public void setSala(SalaDTO sala) { this.sala = sala; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public Turno getTurno() { return turno; }
    public void setTurno(Turno turno) { this.turno = turno; }
    public Horario getHorario() { return horario; }
    public void setHorario(Horario horario) { this.horario = horario; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}