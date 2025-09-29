// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../stores/authStore";

// type Props = {
//   children: React.ReactNode;
//   allowedRoles: string[];
// };

// const PrivateRoute: React.FC<Props> = ({ children, allowedRoles }) => {
//   const { user } = useAuthStore();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Nếu role không được phép, điều hướng theo role thực tế
//   if (!allowedRoles.includes((user as any).role)) {
//     switch ((user as any).role) {
//       case "ADMIN":
//       case "STAFF":
//         return <Navigate to="/dashboard" replace />;
//       case "CUSTOMER":
//         return <Navigate to="/" replace />;
//       default:
//         return <Navigate to="/login" replace />;
//     }
//   }

//   return <>{children}</>;
// };

// export default PrivateRoute;


import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[]; // có thể rỗng -> nghĩa là public
};

const PrivateRoute: React.FC<Props> = ({ children, allowedRoles = [] }) => {
  const { user } = useAuthStore();

  // ✅ Trường hợp public route (allowedRoles = [])
  if (allowedRoles.length === 0) {
    // chưa đăng nhập -> cho vào
    if (!user) return <>{children}</>;

    // đã đăng nhập nhưng role không được phép -> chặn
    switch ((user as any).role) {
      case "ADMIN":
      case "STAFF":
        return <Navigate to="/dashboard" replace />;
      default:
        return <>{children}</>;
    }
  }

  // ✅ Trường hợp private route
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes((user as any).role)) {
    switch ((user as any).role) {
      case "ADMIN":
      case "STAFF":
        return <Navigate to="/dashboard" replace />;
      case "CUSTOMER":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
