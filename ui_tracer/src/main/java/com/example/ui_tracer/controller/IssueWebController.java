package com.example.ui_tracer.controller;

import com.example.ui_tracer.entity.Issue;
import com.example.ui_tracer.repository.IssueRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class IssueWebController {

    private final IssueRepository repository;

    public IssueWebController(IssueRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        List<Issue> issues = repository.findAll();
        model.addAttribute("issues", issues);
        return "index";
    }
} 