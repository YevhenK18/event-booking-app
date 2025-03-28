import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { FaSave } from "react-icons/fa";

function EventForm({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    name: "",
    date: "",
    location: "",
    price: "",
    total_seats: "",
    category: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        const data = await response.json();
        setEvent({
          name: data.name,
          date: new Date(data.date).toISOString().slice(0, 16),
          location: data.location,
          price: data.price,
          total_seats: data.total_seats,
          category: data.category,
        });
      };
      fetchEvent();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:5000/api/events/${id}`
      : "http://localhost:5000/api/events";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(event),
      });
      if (response.ok) {
        navigate("/");
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Ошибка сети. Пожалуйста, попробуйте снова.");
    }
  };

  if (!user) return <Alert variant="warning" className="text-center mt-5">Пожалуйста, войдите, чтобы создать или редактировать событие.</Alert>;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">{id ? "Редактировать событие" : "Создать событие"}</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Название</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Введите название события"
                    value={event.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="date">
                  <Form.Label>Дата и время</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={event.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>Локация</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Введите локацию"
                    value={event.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Цена (PLN)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Введите цену"
                    value={event.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="total_seats">
                  <Form.Label>Количество мест</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_seats"
                    placeholder="Введите количество мест"
                    value={event.total_seats}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Категория</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    placeholder="Введите категорию"
                    value={event.category}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  <FaSave className="me-2" /> {id ? "Обновить" : "Создать"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EventForm;