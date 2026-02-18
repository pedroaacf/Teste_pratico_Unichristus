package com.pedroaacf.teste_pratico_unichristus.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "agendamento")
public class Agendamento {

    @Id
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "sala_id", nullable = false)
    private Sala sala;

    @Column(nullable = false)
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    private Turno turno;

    @Enumerated(EnumType.STRING)
    private Horario horario;

    private String descricao;

    public Agendamento() {}

    public Agendamento(UUID id, Sala sala, LocalDate data, Turno turno, Horario horario, String descricao) {
        this.id = id;
        this.sala = sala;
        this.data = data;
        this.turno = turno;
        this.horario = horario;
        this.descricao = descricao;
    }

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Sala getSala() { return sala; }
    public void setSala(Sala sala) { this.sala = sala; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public Turno getTurno() { return turno; }
    public void setTurno(Turno turno) { this.turno = turno; }
    public Horario getHorario() { return horario; }
    public void setHorario(Horario horario) { this.horario = horario; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}