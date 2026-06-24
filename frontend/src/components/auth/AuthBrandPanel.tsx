import { motion } from "framer-motion";
import {
  FiActivity,
  FiBarChart2,
  FiShield,
  FiZap,
} from "react-icons/fi";
import DashboardPreview from "./DashboardPreview";

const features = [
  { icon: FiZap, label: "Real-Time Monitoring" },
  { icon: FiShield, label: "Security Intelligence" },
  { icon: FiActivity, label: "Incident Detection" },
  { icon: FiBarChart2, label: "Performance Analytics" },
];

const AuthBrandPanel = () => {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-sky-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <FiActivity className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">APIWatch</span>
        </div>
        <p className="mt-6 max-w-md text-lg text-indigo-100">
          API monitoring for modern teams
        </p>
      </motion.div>

      <motion.ul
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
        }}
        className="relative z-10 mt-8 space-y-4"
      >
        {features.map((feature) => (
          <motion.li
            key={feature.label}
            variants={{
              hidden: { opacity: 0, x: -16 },
              show: { opacity: 1, x: 0 },
            }}
            className="flex items-center gap-3 text-sm text-indigo-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <feature.icon className="h-4 w-4" />
            </span>
            {feature.label}
          </motion.li>
        ))}
      </motion.ul>

      <div className="relative z-10 flex flex-1 items-end">
        <DashboardPreview />
      </div>
    </div>
  );
};

export default AuthBrandPanel;
