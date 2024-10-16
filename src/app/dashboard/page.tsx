"use client";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  console.log(session);
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

  const getPacientes = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.token}`,
      },
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button
        onClick={getPacientes}
        className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"
      >
        Listar Pacientes
      </button>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </div>
  );
};
export default Dashboard;
