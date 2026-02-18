package com.pedroaacf.teste_pratico_unichristus.service;

import com.pedroaacf.teste_pratico_unichristus.dto.AgendamentoRequestDTO;
import com.pedroaacf.teste_pratico_unichristus.dto.AgendamentoResponseDTO;
import com.pedroaacf.teste_pratico_unichristus.exception.ResourceNotFoundException;
import com.pedroaacf.teste_pratico_unichristus.mapper.AgendamentoMapper;
import com.pedroaacf.teste_pratico_unichristus.model.Agendamento;
import com.pedroaacf.teste_pratico_unichristus.model.Sala;
import com.pedroaacf.teste_pratico_unichristus.repository.AgendamentoRepository;
import com.pedroaacf.teste_pratico_unichristus.repository.SalaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agRepo;
    private final SalaRepository salaRepo;

    public AgendamentoService(AgendamentoRepository agRepo, SalaRepository salaRepo) {
        this.agRepo = agRepo;
        this.salaRepo = salaRepo;
    }

    public List<AgendamentoResponseDTO> findAll() {
        return agRepo.findAll()
                .stream()
                .map(AgendamentoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AgendamentoResponseDTO findById(UUID id) {
        Agendamento ag = agRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado: " + id));
        return AgendamentoMapper.toResponse(ag);
    }

    public AgendamentoResponseDTO create(AgendamentoRequestDTO req) {
        Sala sala = salaRepo.findById(req.getSalaId())
                .orElseThrow(() -> new ResourceNotFoundException("Sala não encontrada: " + req.getSalaId()));
        Agendamento ag = AgendamentoMapper.toEntity(req, sala);
        Agendamento saved = agRepo.save(ag);
        return AgendamentoMapper.toResponse(saved);
    }

    public AgendamentoResponseDTO update(UUID id, AgendamentoRequestDTO req) {
        Agendamento existing = agRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado: " + id));
        Sala sala = salaRepo.findById(req.getSalaId())
                .orElseThrow(() -> new ResourceNotFoundException("Sala não encontrada: " + req.getSalaId()));
        existing.setSala(sala);
        existing.setData(req.getData());
        existing.setTurno(req.getTurno());
        existing.setHorario(req.getHorario());
        existing.setDescricao(req.getDescricao());
        Agendamento saved = agRepo.save(existing);
        return AgendamentoMapper.toResponse(saved);
    }

    public void delete(UUID id) {
        if (!agRepo.existsById(id)) {
            throw new ResourceNotFoundException("Agendamento não encontrado: " + id);
        }
        agRepo.deleteById(id);
    }
}
