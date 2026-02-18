package com.pedroaacf.teste_pratico_unichristus.dto;

import com.pedroaacf.teste_pratico_unichristus.model.SalaStatus;

import java.util.UUID;

public class SalaDTO {
    private UUID id;
    private String descricao;
    private String andar;
    private int capacidade;
    private SalaStatus status;


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getAndar() { return andar; }
    public void setAndar(String andar) { this.andar = andar; }
    public int getCapacidade() { return capacidade; }
    public void setCapacidade(int capacidade) { this.capacidade = capacidade; }
    public SalaStatus getStatus() { return status; }
    public void setStatus(SalaStatus status) { this.status = status; }
}