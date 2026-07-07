# Tourist-Safety-Management-Platform
Multi-tier, full-stack application designed to enhance tourist safety and streamline emergency coordination for public authorities. 
The system consists of three main components:
1) Core FastAPI backend server
2) Real-time Admin Command Dashboard,
3) Responsive User Web Application. 
The platform addresses critical safety vulnerabilities by implementing automated geo-fencing
simulated routing/deviation analysis, decentralized identity verification concepts, and a direct emergency response pipeline.


_Core Architecture & Modules_
**1. Centralized Backend API (FastAPI)**
Acts as the central nervous system of the application, managing data flow, alert states, and cross-communication between the tourist app and the admin dashboard.

_In-Memory Data Architecture:_ For high-throughput prototyping, it maintains transient data stores for active live incidents, user-specific alert logs, defined restricted boundaries, and active route geometries.
_Spatial Analytics Engine:_ Uses a localized ray-casting algorithm (is_point_in_polygon) to perform real-time coordinate checking against defined geographical boundaries.

**3. User Web Application (React & TypeScript)**
A responsive frontend interface built for the tourist, focusing on low-friction onboarding, continuous status monitoring, and immediate distress signaling.

_Privacy-First Consent Flow:_ Features an integrated data privacy gate fully aligned with the Digital Personal Data Protection (DPDP) Act, 2023, requiring explicit user sign-off before data collection begins.
_Cryptographic Identity Simulation:_ Simulates secure user onboarding by generating unique, tamper-proof digital credentials tied to user identity records, complete with UI state changes mimicking blockchain confirmation.
_End-to-End Security Note:_ Incorporates a persistent, scroll-accessible footer validating that data integrity is structurally maintained via simulated SHA-256 fingerprint verification.
Instant SOS Emergency Pipeline: Features an animated, high-visibility emergency panic button that instantly bypasses normal execution loops to push a high-priority payload to the server.

**4. Command & Control Dashboard (React & Tailwind CSS)**
An administrative portal tailored for law enforcement or tourism authorities to monitor, triage, and respond to environmental anomalies and active distress calls.

_Live Incident Management:_ Features a dedicated, auto-refreshing tracking system that dynamically renders critical SOS alerts directly from the user application, displaying vital telemetry such as location context, emergency type, severity levels, and tourist metadata.
_Dynamic Geo-fencing & Restriction Mapping:_ Provides endpoints to dynamically draw and inject coordinate arrays into the system to declare restricted zones.
Automated Threat Detection Logs: Automatically captures and tables spatial infractions (such as a user physically entering a restricted zone) or route deviations triggered by the backend.

**Technical Stack**
Backend: Python, FastAPI, Pydantic (Data Validation)
Frontend Apps: React.js, TypeScript, Tailwind CSS, Lucide React (Iconography)
Routing & Spatial Context: Open Source Routing Machine (OSRM) Integration API, GeoJSON Data Formats
