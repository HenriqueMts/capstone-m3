<div align="center">
  <img src="src/assets/Logo.svg" alt="Adopet Logo" width="150"/>

# AdoPet

**Connecting hearts, one paw at a time.**

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Styled_Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" alt="Styled Components" />
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma" />

  <br />

[Description](#-project-description) •
[Architecture](#-architecture--database) •
[Features](#-features) •
[Technologies](#-technologies) •
[Team](#-team)

</div>

---

## 📄 Project Description

**AdoPet** was developed to connect people who want to adopt a pet with those looking for a new home for rescued animals.

> 🚀 **Major Update (2025):** This project has been refactored from a mock environment (FakeAPI/JSON Server) to a production-grade architecture using **PostgreSQL** and **Supabase**. It now features real authentication, row-level security, and persistent data storage.

### Issues to be solved

The World Health Organization estimates that in Brazil alone, there are over **30 million homeless animals** in need of healthcare and shelter. The biggest difficulty is finding responsible guardians.

Our platform aims to bridge the gap between NGOs and pet lovers, providing crucial information to ensure the best possible match between the pet and the adopter.

---

## 🏗 Architecture & Database

The project was migrated to a relational database to ensure **Data Integrity** and **Security**.

- **Database:** PostgreSQL (via Supabase).
- **Authentication:** Managed via Supabase Auth (JWT) - separates "User" from "Data".
- **Security:** Implemented Row Level Security (RLS) policies.
- **Automation:** Database Triggers automatically sync Auth Users with Public Profiles.
- **Storage:** Images served via Supabase Storage buckets.

---

## ✨ Features

- 🔐 **Authentication:** Secure Login and Registration for Adopters and NGOs.
- 🐶 **Home Feed:** Listing of available pets with filters (Species, Size, etc.).
- 📄 **Pet Profile:** Detailed view of the animal with photos and description.
- 🏥 **Contribute:** Information on how to help partner NGOs.
- ➕ **Donate/Register Pet:** Form to register new animals for adoption.
- 📊 **Dashboard:** Manage your registered pets, edit details, or mark them as adopted.

---

## 💻 Technologies

### Core

- **ReactJS**
- **Context API** (State Management)
- **Supabase** (BaaS - Backend as a Service)

### Libraries & Tools

- `@supabase/supabase-js`
- `react-hook-form` & `yup` (Forms & Validation)
- `styled-components` (Styling)
- `react-router-dom` (Routing)
- `react-toastify` (Feedback)
- `react-icons`
- `chakra-ui`

---

## 👥 Team

| Member               | Role          | GitHub                                     |
| :------------------- | :------------ | :----------------------------------------- |
| **Weriks Santos**    | Tech Lead     | [Github](https://github.com/werikscs)      |
| **Eduardo Henrique** | QA / Dev      | [Github](https://github.com/HenriqueMts)   |
| **Douglas Leão**     | QA            | [Github](https://github.com/elefantinhos2) |
| **Emilly Almeida**   | Product Owner | [Github](https://github.com/Emillyalmeida) |
| **Jonatas Souza**    | Scrum Master  | [Github](https://github.com/jotasouza)     |
| **Thales Renan**     | QA            | [Github](https://github.com/thalesrenan)   |

---

## 🔗 Live Demo

<div align="center">
  <h3>
    <a href="https://adopet-m3.vercel.app/">
      👉 Click here to visit AdoPet
    </a>
  </h3>
</div>
