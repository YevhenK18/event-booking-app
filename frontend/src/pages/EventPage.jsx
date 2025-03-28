import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { Container, Row, Col, Card, Button, Alert, ListGroup } from "react-bootstrap";
import { FaTicketAlt } from "react-icons/fa";

function EventPage({ user }) {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!response.ok) throw new Error("Не удалось загрузить событие");
        const data = await response.json();
        setEvent(data);

        const seatsResponse = await fetch(`http://localhost:5000/api/seats/${id}`);
        if (!seatsResponse.ok) throw new Error("Не удалось загрузить места");
        const seatsData = await seatsResponse.json();
        setSeats(seatsData);

        try {
          const weatherResponse = await fetch(`http://localhost:5000/api/weather/${data.location}`);
          if (!weatherResponse.ok) {
            throw new Error("Не удалось получить данные о погоде");
          }
          const weatherData = await weatherResponse.json();
          if (weatherData.error) {
            throw new Error(weatherData.error);
          }
          setWeather(weatherData);
          setWeatherError(null);
        } catch (err) {
          console.error("Ошибка погоды:", err);
          setWeatherError(err.message);
          setWeather(null);
        }

        const geocodeResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${data.location}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        );
        const location = geocodeResponse.data.results[0]?.geometry.location;
        if (location) setCoords(location);
      } catch (error) {
        console.error("Ошибка загрузки события:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleReserve = async (seatId) => {
    if (!user) {
      alert("Пожалуйста, войдите, чтобы забронировать место");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/seats/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ seatId }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSeats((prev) =>
          prev.map((seat) =>
            seat.id === seatId ? { ...seat, reserved_by: user.id } : seat
          )
        );
      } else {
        alert("Ошибка: " + data.message);
      }
    } catch (error) {
      console.error("Ошибка бронирования:", error);
      alert("Ошибка сети. Пожалуйста, попробуйте снова.");
    }
  };

  if (!event) return <div className="text-center mt-5">Загрузка...</div>;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h2">{event.name}</Card.Title>
              <Card.Text>
                <strong>Дата:</strong> {new Date(event.date).toLocaleString()} <br />
                <strong>Локация:</strong> {event.location} <br />
                <strong>Цена:</strong> {event.price} PLN <br />
                <strong>Категория:</strong> {event.category || "Не указана"}
              </Card.Text>
            </Card.Body>
          </Card>

          {weatherError ? (
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title as="h3">Погода в {event.location}</Card.Title>
                <Alert variant="danger">{weatherError}</Alert>
              </Card.Body>
            </Card>
          ) : weather && weather.main && weather.weather ? (
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title as="h3">Погода в {event.location}</Card.Title>
                <Card.Text>
                  <strong>Температура:</strong> {weather.main.temp}°C <br />
                  <strong>Описание:</strong> {weather.weather[0].description}
                </Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title as="h3">Погода в {event.location}</Card.Title>
                <Card.Text>Загрузка данных о погоде...</Card.Text>
              </Card.Body>
            </Card>
          )}

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h3">Карта</Card.Title>
              {coords ? (
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "400px", borderRadius: "8px" }}
                    center={coords}
                    zoom={15}
                  >
                    <Marker position={coords} />
                  </GoogleMap>
                </LoadScript>
              ) : (
                <Alert variant="warning">Не удалось загрузить карту для {event.location}</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title as="h3">Доступные места</Card.Title>
              <ListGroup variant="flush">
                {seats.map((seat) => (
                  <ListGroup.Item key={seat.id}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        {seat.seat_number} - {seat.reserved_by ? "Занято" : "Свободно"}
                      </span>
                      {!seat.reserved_by && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleReserve(seat.id)}
                        >
                          <FaTicketAlt className="me-1" /> Забронировать
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EventPage;