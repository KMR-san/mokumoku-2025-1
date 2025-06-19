package com.example.ui_tracer.controller;

import com.example.ui_tracer.entity.Issue;
import com.example.ui_tracer.repository.IssueRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueApiController {

	private final IssueRepository repository;

	public IssueApiController(IssueRepository repository){
		this.repository = repository;
	}

	// POST /api/issues にJSONを送ると、DBに保存
	@PostMapping
	public Issue receiveJson(@RequestBody Issue issue){
		return repository.save(issue);
	}

	// GET /api/issues で保存された一覧を取得する
	@GetMapping
	public List<Issue> getAllIssues(){
		return repository.findAll();
	}
}
