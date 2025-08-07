## Admin Dashboard CRUD Operations

The AddisBusConnect project includes an administrative dashboard that allows authorized users to manage various aspects of the system, such as routes, stops, buses, and potentially users. While the specific UI interactions may vary, the underlying CRUD (Create, Read, Update, Delete) operations generally follow these principles:

### Accessing the Admin Dashboard

1.  **Login as Administrator:** Ensure you are logged into the application with an administrator account. The authentication flow is described in the "Authentication Flow" section in `replit.md`.
2.  **Navigate to Dashboard:** Once logged in, locate and navigate to the Admin Dashboard section of the application. This is typically accessible via a dedicated link or menu item.

### General CRUD Steps

For managing entities like Routes, Stops, and Buses, you will typically find sections within the admin dashboard that allow you to perform the following operations:

#### 1. Create (Add New Entry)

*   **Locate "Add New" or "Create" Button:** Find a button or link (e.g., "Add New Route", "Create Bus Stop") that initiates the creation process.
*   **Fill in Details:** A form will appear where you can enter the details for the new entity (e.g., route name, bus stop coordinates, bus capacity).
*   **Submit Form:** After filling in all required information, submit the form to create the new entry. The system will typically provide feedback on success or failure.

#### 2. Read (View Existing Entries)

*   **Navigate to Entity List:** The admin dashboard will usually have dedicated sections or tables listing all existing entities (e.g., "All Routes", "Bus Stops List", "Fleet Management").
*   **Browse and Filter:** You can browse through the list of entries. There might be search or filter options to help you find specific entries.
*   **View Details:** Clicking on an individual entry (e.g., a route name, a bus ID) will often display a detailed view of that entity, showing all its properties.

#### 3. Update (Modify Existing Entry)

*   **Select Entry for Editing:** From the list of existing entries, locate the one you wish to modify. There will typically be an "Edit" button or icon associated with each entry.
*   **Modify Details:** A form pre-filled with the current details of the entry will appear. Make the necessary changes to the fields.
*   **Save Changes:** Submit the form to save your modifications. The system will confirm if the update was successful.

#### 4. Delete (Remove Existing Entry)

*   **Select Entry for Deletion:** From the list of existing entries, locate the one you wish to remove. There will usually be a "Delete" button or icon.
*   **Confirm Deletion:** To prevent accidental data loss, the system will typically ask for confirmation before permanently deleting an entry. Confirm your action.
*   **Verify Deletion:** After confirmation, the entry should be removed from the list. The system will provide a notification of the deletion status.

### Backend API Endpoints for CRUD (for reference)

For developers, the backend provides RESTful API endpoints that facilitate these CRUD operations. These are the endpoints that the frontend admin dashboard interacts with:

*   **Routes:**
    *   `GET /api/routes`: Get all routes
    *   `GET /api/routes/:id`: Get a specific route by ID
    *   `POST /api/routes`: Create a new route (Admin only)
    *   `PUT /api/routes/:id`: Update an existing route (Admin only)
    *   `DELETE /api/routes/:id`: Delete a route (Admin only)

*   **Stops:**
    *   `GET /api/stops`: Get all stops
    *   `POST /api/stops`: Create a new stop (Admin only)
    *   `PUT /api/stops/:id`: Update an existing stop (Admin only)
    *   `DELETE /api/stops/:id`: Delete a stop (Admin only)

*   **Buses:**
    *   `GET /api/buses`: Get all buses
    *   `POST /api/buses`: Create a new bus (Admin only)
    *   `PUT /api/buses/:id`: Update an existing bus (Admin only)
    *   `DELETE /api/buses/:id`: Delete a bus (Admin only)

*   **Users (Admin only):**
    *   `GET /api/admin/users`: Get all users (Admin only)

These API endpoints are protected by authentication and authorization (requiring an admin role for write operations), ensuring that only authorized personnel can manage the system data.


