import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { FaSearch, FaEdit } from "react-icons/fa";

function Home({ user }) {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ name: "", location: "", category: "", date: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`http://localhost:5000/api/events?${query}`);
        if (!response.ok) {
          throw new Error("Ошибка при загрузке событий");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Данные не являются массивом");
        }
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error("Ошибка:", err);
        setError("Не удалось загрузить события. Попробуйте позже.");
        setEvents([]);
      }
    };
    fetchEvents();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">События</h2>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Название</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Поиск по названию"
                    value={filters.name}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>Локация</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Поиск по локации"
                    value={filters.location}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Категория</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    placeholder="Категория"
                    value={filters.category}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3" controlId="date">
                  <Form.Label>Дата</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}
      {events.length === 0 && !error ? (
        <Alert variant="info">События не найдены.</Alert>
      ) : (
        <Row>
          {events.map((event) => (
            <Col md={4} key={event.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Text>
                    <strong>Локация:</strong> {event.location} <br />
                    <strong>Дата:</strong> {new Date(event.date).toLocaleDateString()} <br />
                    <strong>Категория:</strong> {event.category || "Не указана"}
                  </Card.Text>
                  <Button as={Link} to={`/event/${event.id}`} variant="primary" className="me-2">
                    <FaSearch className="me-1" /> Подробнее
                  </Button>
                  {user && (
                    <Button as={Link} to={`/edit-event/${event.id}`} variant="outline-secondary">
                      <FaEdit className="me-1" /> Редактировать
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Home;