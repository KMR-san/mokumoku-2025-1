package com.example.ui_tracer.entity;

import jakarta.persistence.*;

@Entity
public class Issue {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private  Long id;

	// あとでJSONの要素を追加する
	private String title;
	private String url;

	@Column(length = 2000)
	private String body;

	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}

	public String getTitle(){
		return title;
	}

	public void setTitle(String Title){
		this.title = title;
	}

	public String getUrl(){
		return url;
	}

	public void setUrl(String url){
		this.url = url;
	}

	public String getBody(){
		return body;
	}

	public void setBody(String body){
		this.body = body;
	}
}
