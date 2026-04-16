# Jules Car Sharing Demo

This project demonstrates a full-stack car-sharing booking application with a Spring Boot backend and an Angular frontend.

## Components

### Backend (Spring Boot)
Located in `examples/jules-demo/spring-boot-demo`.
- Manages bookings and state transitions.
- Provides audit logging.
- Exposes REST API.

**Run Backend:**
```bash
cd examples/jules-demo/spring-boot-demo
./mvnw spring-boot:run
```

### Frontend (Angular)
Located in `examples/jules-demo/angular-frontend`.
- Modern dark-mode UI.
- Real-time booking management.
- Built with Tailwind CSS and Lucide icons.

**Run Frontend:**
```bash
cd examples/jules-demo/angular-frontend
npm install
npm start
```
The UI will be available at `http://localhost:4200`.

## Testing
- **Backend Tests:** `cd examples/jules-demo/spring-boot-demo && ./mvnw test`
- **Frontend Tests:** `cd examples/jules-demo/angular-frontend && npm test`

## Key Features
- **Booking Workflow:** Create, Start, and Complete or Cancel bookings.
- **Audit Trail:** Immutable history of all actions.
- **Modern UI:** Responsive, dark-themed interface with polished UX.
- **Robust API:** Validated state transitions and error handling.
