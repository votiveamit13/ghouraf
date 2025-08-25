import { useAuth } from "context/AuthContext";

export default function UserDashboard(){
    const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please login first</p>;
    return(
        <div className="container px-4 mt-5">
      <h1 className="text-[25px] font-bold text-black">
        Welcome <span className="text-[#A321A6]">{user.profile?.firstName}</span>
      </h1>
      <div className="bg-[#E9E8E8] rounded-[10px] d-flex w-[25%] px-4 py-3 align-center">
        <span className="text-[15px] text-black">Your account is a basic account
</span>
        </div>
    </div>
    );
}