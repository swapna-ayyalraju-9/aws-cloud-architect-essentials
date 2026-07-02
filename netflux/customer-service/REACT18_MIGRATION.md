## React 16 to React 18 migration notes

This repository did not already contain a React application, so the frontend demo was migrated by replacing the old DOM-manipulation script with a small React 18 app.

### What changed

1. **React mount API**
   - React 16 pattern:
     ```js
     ReactDOM.render(<App />, document.getElementById('root'));
     ```
   - React 18 pattern:
     ```js
     const root = ReactDOM.createRoot(document.getElementById('root'));
     root.render(<App />);
     ```

2. **DOM updates moved into component state**
   - Before: code called `document.getElementById(...)`, changed `innerText`, and rebuilt table rows manually.
   - After: React state holds the customer and movie data, and JSX renders the UI from that state.

3. **Event handlers stay inside components**
   - Before: click handlers were attached from global script code.
   - After: buttons and form fields call React event handlers like `onClick` and `onChange`.

4. **Side effects use hooks**
   - Data fetching now runs inside `useEffect(...)` and helper callbacks.

### Good beginner rules for React 18

- Prefer **function components** over class components for new code.
- Use `useState` for UI state.
- Use `useEffect` for data fetching or other side effects.
- Let React render from state instead of manually changing the DOM.
- If you later add a real frontend toolchain, move this code into a bundler such as Vite and import `react` / `react-dom/client` from npm instead of CDNs.
