package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

// JULES-DEMO: Integrationstest, der sicherstellt, dass die API korrekt antwortet.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SpringBootDemoApplicationTests {

	@LocalServerPort
	private int port;

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	void contextLoads() {
	}

	@Test
	void healthEndpointReturnsUp() {
		ResponseEntity<Map> response = restTemplate.getForEntity("http://localhost:" + port + "/api/health", Map.class);
		assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
		assertThat(response.getBody().get("status")).isEqualTo("UP");
	}

	@Test
	void demoEndpointReturnsFeatures() {
		ResponseEntity<Map> response = restTemplate.getForEntity("http://localhost:" + port + "/api/demo", Map.class);
		assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
		assertThat(response.getBody().containsKey("features")).isTrue();
	}

}
