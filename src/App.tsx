import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CandidateDetail from "@/pages/CandidateDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandidateDetail />} />
      </Routes>
    </Router>
  );
}
