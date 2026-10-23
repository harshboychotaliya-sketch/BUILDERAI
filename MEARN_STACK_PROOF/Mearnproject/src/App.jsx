import Homepage from "./pages/Homepage";
import Authpage from "./pages/Authpage";
import Buildepahe from "./pages/Buildepahe";
import Priviwepage from "./pages/Priviwepage";
import { Route, Routes, Navigate } from "react-router-dom";
import { Guestlayout, Authlayout } from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Publishpage from "./pages/Publishpage";
import HandleAbout from "./pages/handleAbout";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<Guestlayout />}>
          <Route path="/login" element={<Authpage mode="login" />} />
          <Route path="/Register" element={<Authpage mode="Register" />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        <Route element={<Authlayout />}>
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/handleabout" element={<HandleAbout />} />
          <Route path="/Builderpage/:id" element={<Buildepahe />} />
          <Route path="/build/:id" element={<Buildepahe />} />
          <Route path="/Priviwepage/:id" element={<Priviwepage />} />
        </Route>

        <Route path="/publish/:id" element={ <Publishpage /> }/>

        {/* unknown page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;