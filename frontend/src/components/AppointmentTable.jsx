import { useState, useEffect } from "react";
import { getAppointments } from "../api/api";

export default function AppointmentTable({ refresh }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAppointments().then(setAppointments).catch(console.error);
  }, [refresh]);

  const statusColor = { Scheduled: "#2563eb", Completed: "#16a34a", Cancelled: "#dc2626" };

  return (
    <div className="card">
      <h2>Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Patient ID</th><th>Doctor ID</th>
            <th>Date</th><th>Time Slot</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No appointments found</td></tr>
          ) : appointments.map(a => (
            <tr key={a.appointment_id}>
              <td>{a.appointment_id}</td>
              <td>{a.patient_id}</td>
              <td>{a.doctor_id}</td>
              <td>{a.appointment_date}</td>
              <td>{a.time_slot}</td>
              <td style={{ color: statusColor[a.status] || "#333", fontWeight: 600 }}>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
