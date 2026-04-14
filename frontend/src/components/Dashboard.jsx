import { useEffect, useState } from "react";
import { getPatients, getDoctors, getAppointments, getBillingReport } from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, revenue: 0 });
  const [apptByStatus, setApptByStatus] = useState({ Scheduled: 0, Completed: 0, Cancelled: 0 });

  useEffect(() => {
    Promise.all([getPatients(), getDoctors(), getAppointments(), getBillingReport()])
      .then(([patients, doctors, appointments, bills]) => {
        const revenue = bills.filter(b => b.payment_status === "Paid").reduce((s, b) => s + b.amount, 0);
        setStats({ patients: patients.length, doctors: doctors.length, appointments: appointments.length, revenue });
        const byStatus = { Scheduled: 0, Completed: 0, Cancelled: 0 };
        appointments.forEach(a => { byStatus[a.status] = (byStatus[a.status] || 0) + 1; });
        setApptByStatus(byStatus);
      }).catch(console.error);
  }, []);

  const total = stats.appointments || 1;
  const barData = [
    { label: "Scheduled", count: apptByStatus.Scheduled, color: "#2563eb" },
    { label: "Completed", count: apptByStatus.Completed, color: "#16a34a" },
    { label: "Cancelled", count: apptByStatus.Cancelled, color: "#dc2626" },
  ];

  return (
    <div className="card">
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-box"><span className="stat-num">{stats.patients}</span><span>Patients</span></div>
        <div className="stat-box"><span className="stat-num">{stats.doctors}</span><span>Doctors</span></div>
        <div className="stat-box"><span className="stat-num">{stats.appointments}</span><span>Appointments</span></div>
        <div className="stat-box"><span className="stat-num">₹{stats.revenue.toFixed(0)}</span><span>Revenue (Paid)</span></div>
      </div>

      <h3 style={{ marginTop: "1.5rem" }}>Appointment Status</h3>
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", height: "120px", marginTop: "0.5rem" }}>
        {barData.map(({ label, count, color }) => (
          <div key={label} style={{ textAlign: "center", flex: 1 }}>
            <div style={{ background: color, height: `${(count / total) * 100}px`, minHeight: count > 0 ? 8 : 0, borderRadius: 4, transition: "height 0.4s" }} />
            <div style={{ fontSize: 12, marginTop: 4 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color }}>{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
