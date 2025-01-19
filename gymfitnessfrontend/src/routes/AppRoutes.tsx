import { BrowserRouter as Router, Routes } from 'react-router-dom';
// import Home from "../features/Home/Home";
// import Test from "../features/Test/Test";
// import Dashboard from "../features/Dashboard/Dashboard";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;