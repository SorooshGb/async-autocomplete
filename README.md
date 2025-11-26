1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run JSON Server (API Mock)**
   This project uses json-server to simulate a backend.
   A deliberate 1-second delay has been added so you can test scenarios such as:

   - Data loading states
   - Request abort behavior when rapidly changing inputs

   Run it in a separate terminal:

   ```bash
   npm run server
   ```

3. **Run the Application**
   In another terminal:

   ```bash
   npm run dev
   ```

4. **Access the App**
   ```bash
   http://localhost:5173
   ```

### Overview of the Two Implementations

- The first tab contains a **fully manual implementation** (pagination, infinite scroll, aborting requests, caching, etc.), without any data-management libraries.
- The second tab contains an implementation using **React Query**, which handles caching, pagination, loading/error states, and request coordination.
