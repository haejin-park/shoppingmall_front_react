import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AppLayout from "./Layout/AppLayout";
import AppRouter from "./routes/AppRouter";
import "./style/common.style.css";

function App() {
  return (
    <div>
      <AppLayout>
        <AppRouter/>
      </AppLayout>
    </div>
  );
}

export default App;