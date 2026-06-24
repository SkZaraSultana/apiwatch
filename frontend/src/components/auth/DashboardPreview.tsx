import { motion } from "framer-motion";
import { FiActivity, FiAlertTriangle, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

const bars = [42, 68, 55, 82, 74, 91, 63, 88, 76, 95];

const DashboardPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative mt-10 w-full max-w-md"
    >
      <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-indigo-100/80">
              Live overview
            </p>
            <p className="text-lg font-semibold text-white">API Health Dashboard</p>
          </div>
          <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-medium text-emerald-200">
            99.9% uptime
          </span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { icon: FiCheckCircle, label: "Operational", value: "24" },
            { icon: FiAlertTriangle, label: "Incidents", value: "2" },
            { icon: FiTrendingUp, label: "Latency", value: "142ms" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="rounded-xl bg-white/10 p-3"
            >
              <item.icon className="mb-2 h-4 w-4 text-indigo-100" />
              <p className="text-xs text-indigo-100/70">{item.label}</p>
              <p className="text-sm font-semibold text-white">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl bg-white/10 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-indigo-100/80">
            <FiActivity className="h-3.5 w-3.5" />
            Response time trend
          </div>
          <div className="flex h-24 items-end gap-1.5">
            {bars.map((height, index) => (
              <motion.div
                key={index}
                className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-sky-300"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + index * 0.05,
                  ease: "easeOut" as const,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPreview;
