import { Link } from "react-router-dom";
import NotificationsSignInPageError from "../components/SignIn";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/")
    }
  return (
    <div>
      <Button
        variant="contained"
        style={{ position: "fixed", top: "10px", left: "10px", zIndex: 10 }}
        onClick={handleBack}
      >
        &larr; BACK TO HOMEPAGE
      </Button>
      <NotificationsSignInPageError />
    </div>
  );
}
