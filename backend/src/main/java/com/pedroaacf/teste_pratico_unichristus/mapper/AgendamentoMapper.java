package com.pedroaacf.teste_pratico_unichristus.mapper;


import com.pedroaacf.teste_pratico_unichristus.dto.AgendamentoRequestDTO;
import com.pedroaacf.teste_pratico_unichristus.dto.AgendamentoResponseDTO;
import com.pedroaacf.teste_pratico_unichristus.dto.SalaDTO;
import com.pedroaacf.teste_pratico_unichristus.model.Agendamento;
import com.pedroaacf.teste_pratico_unichristus.model.Sala;

public class AgendamentoMapper {

    public static AgendamentoResponseDTO toResponse(Agendamento ag) {
        if (ag == null) return null;
        AgendamentoResponseDTO dto = new AgendamentoResponseDTO();
        dto.setId(ag.getId());
        dto.setData(ag.getData());
        dto.setTurno(ag.getTurno());
        dto.setHorario(ag.getHorario());
        dto.setDescricao(ag.getDescricao());

        Sala s = ag.getSala();
        if (s != null) {
            SalaDTO sd = new SalaDTO();
            sd.setId(s.getId());
            sd.setDescricao(s.getDescricao());
            sd.setAndar(s.getAndar());
            sd.setCapacidade(s.getCapacidade());
            sd.setStatus(s.getStatus());
            dto.setSala(sd);
        }
        return dto;
    }

    public static Agendamento toEntity(AgendamentoRequestDTO req, Sala sala) {
        Agendamento ag = new Agendamento();
        ag.setSala(sala);
        ag.setData(req.getData());
        ag.setTurno(req.getTurno());
        ag.setHorario(req.getHorario());
        ag.setDescricao(req.getDescricao());
        return ag;
    }
}
