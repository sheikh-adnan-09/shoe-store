import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="text-center py-24">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-gray-500 mb-6">Page not found</p>
    <Link to="/" className="btn-primary">
      Go Home
    </Link>
  </div>
);

export default NotFound;
