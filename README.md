# Parcel Delivery System

A full-stack application for managing and routing parcel deliveries. This project includes a React frontend and a Node.js/Express backend.

---

## Features
- **XML File Upload:** Upload parcel data in XML format from the frontend.
- **Automated Routing:** Backend processes and routes parcels based on business rules.
- **Results Table:** View routed parcels in a searchable, filterable table.
- **Search:** Filter parcels by recipient name or department.
- **Modern UI:** Responsive design using Tailwind CSS.

---

## Project Structure
```
parcel-delivery/
  backend/
    src/
      departments.js
      index.js
      parcelRouter.js
      xmlParser.js
    package.json
    ...
  frontend/
    src/
      App.jsx
      index.css
      ...
    package.json
    ...
```

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the backend server:
   ```bash
   npm start
   # or
   yarn start
   ```
   The backend will run on [http://localhost:3000](http://localhost:3000)

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173) by default.

---

## Usage
1. Open the frontend in your browser.
2. Click **Upload XML File** and select your parcel XML file.
3. Click **Upload & Route** to send the file to the backend.
4. View routed parcels in the table below.
5. Use the search box to filter parcels by recipient name or department.

---

## Customization
- **Frontend:**
  - Update Tailwind styles in `frontend/src/index.css` or component classes as needed.
  - Backend endpoint is set to `http://localhost:3000/upload` in `frontend/src/App.jsx`.
- **Backend:**
  - Business rules can be modified in `backend/src/parcelRouter.js` and related files.

---

## License
This project is for demonstration and educational purposes. 