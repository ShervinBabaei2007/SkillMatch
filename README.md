# 🎓 SkillMatch

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)
[![Agile](https://img.shields.io/badge/Agile_Methodology-4_Week_Sprint-2ea44f?style=for-the-badge)](#)

> **SkillMatch** is a full-stack digital bulletin board and registration system designed to streamline the logistics of peer-to-peer and faculty-to-student knowledge transfer.

It provides a centralized platform where instructors can host short-term, specialized workshops, and students can discover and register for skills outside their standard curriculum.

---

## 📱 Mobile-First UI Showcase

We strategically prioritized a mobile-first architecture to deliver an optimal user experience for the majority of users (approximately 65%) who access the web via mobile devices. Our sleek, responsive UI adapts effortlessly to different device form factors.

<table align="center">
  <tr>
    <th align="center">Dashboard View</th>
    <th align="center">Workshop Details</th>
    <th align="center">Registration Flow</th>
  </tr>
  <tr>
    <td align="center" valign="top">
      <img src="https://github.com/user-attachments/assets/7a5ff1fa-911a-42b7-9ceb-3c74c4bce391" width="280" alt="Dashboard View" />
    </td>
    <td align="center" valign="top">
      <img src="https://github.com/user-attachments/assets/b4168e02-590e-4b31-9668-ad37d634317d" width="280" alt="Workshop Details View" />
    </td>
    <td align="center" valign="top">
      <img src="https://github.com/user-attachments/assets/73fa9e7a-05d5-4bdf-9b7e-fb9aa5744a37" width="280" alt="Registration Flow View" />
    </td>
  </tr>
</table>

---

## 🎯 The Motivation

Many students are eager to learn specific, highly demanded industry skills (such as modern programming frameworks, specific languages, or tooling) before they appear in their formal course progression. Conversely, instructors and industry professionals often possess specialized knowledge they are willing to share outside of a full-term commitment.

Current methods for organizing these ad hoc sessions are often fragmented, informal, or nonexistent. **SkillMatch bridges this gap** by providing a dedicated, structured marketplace for extracurricular skill-building.

---

## ✨ Core Features

### 🔐 Role-Based Access & Security
* **Dual User Flows:** Specialized, distinct interfaces for **Instructors** (to create and manage workshops) and **Students** (to browse and learn).
* **Secure Authentication:** JWT-based login system ensuring secure sessions and data protection.

### 🔍 Workshop Discovery & Marketplace
* **Categorized Browsing:** Users can filter workshops by specific tech domains, including *Front-End, Back-End, Graphic Design, DevOps,* and *Databases*.
* **Interactive Dashboard:** Clean, informational cards displaying essential details: title, physical/digital location, schedule, and instructor profiles.
* **Responsive Details View:** Dedicated, dynamic pages for each workshop featuring full syllabi, instructor bios, and interactive elements.

### 🎟️ Capacity & Registration Management
* **Frictionless Registration:** One-click "Register" and "View Details" flow for optimal user experience.
* **Live Participation Tracking:** Real-time database queries to display remaining seats and live attendee rosters to instructors.
* **QR Code Ticketing:** Automated generation of unique reference numbers and QR code receipts for attendees upon successful registration.

---

## 🛠️ Technical Architecture

SkillMatch is built using the modern **MERN** stack, emphasizing performance, scalability, and robust user experiences.

* **Frontend:** React.js, TypeScript, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose (Object Data Modeling)
* **Authentication:** JSON Web Tokens (JWT), bcrypt
* **Assets & Utilities:** Cloudinary (Image Hosting), QRCode, Crypto

---

## 💡 Development Methodology & Technical Challenges

* **Agile Delivery (4-Week Sprint):** Architected, developed, and deployed the entire full-stack application within a strict 4-week timeline. Utilized Agile methodologies-including iterative development and rapid prototyping-to continuously deliver and test features under deadline pressure.
* **Debugging Deployment Environments:** Successfully navigated complex module resolution and bundling conflicts (e.g., ESM vs CommonJS standard discrepancies) when transitioning from a local development environment to a serverless Vercel deployment architecture. This involved strategic refactoring of standard Node.js native modules.
* **State Management:** Overcame complex state synchronization challenges to manage real-time workshop capacity updates, ensuring precise and asynchronous data delivery from MongoDB to the React frontend.
