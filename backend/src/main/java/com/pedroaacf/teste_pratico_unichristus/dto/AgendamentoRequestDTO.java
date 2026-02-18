package com.pedroaacf.teste_pratico_unichristus.dto;

import com.pedroaacf.teste_pratico_unichristus.model.Horario;
import com.pedroaacf.teste_pratico_unichristus.model.Turno;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

public class AgendamentoRequestDTO {

    @NotNull(message = "salaId é obrigatório")
    private UUID salaId;

    @NotNull(message = "data é obrigatória")
    private LocalDate data;

    @NotNull(message = "turno é obrigatório")
    private Turno turno;

    @NotNull(message = "horario é obrigatório")
    private Horario horario;

    @NotBlank(message = "descrição é obrigatória")
    @Size(max = 500, message = "descrição deve ter no máximo 500 caracteres")
    private String descricao;


    public UUID getSalaId() { return salaId; }
    public void setSalaId(UUID salaId) { this.salaId = salaId; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public Turno getTurno() { return turno; }
    public void setTurno(Turno turno) { this.turno = turno; }
    public Horario getHorario() { return horario; }
    public void setHorario(Horario horario) { this.horario = horario; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}