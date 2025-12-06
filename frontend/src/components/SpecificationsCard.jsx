import { motion } from 'framer-motion';
import { List, Cpu, Ruler, Battery, Camera, Smartphone } from 'lucide-react';

const iconMap = {
  display: Smartphone,
  processor: Cpu,
  ram: Cpu,
  storage: List,
  battery: Battery,
  camera: Camera,
  default: List,
};

function getIcon(specName) {
  const name = specName.toLowerCase();
  if (name.includes('display') || name.includes('screen')) return iconMap.display;
  if (name.includes('processor') || name.includes('cpu') || name.includes('chip') || name.includes('ram')) return iconMap.processor;
  if (name.includes('battery')) return iconMap.battery;
  if (name.includes('camera')) return iconMap.camera;
  if (name.includes('storage') || name.includes('memory')) return iconMap.storage;
  return iconMap.default;
}

export default function SpecificationsCard({ specifications }) {
  if (!specifications || specifications.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center border border-primary-500/30">
          <List className="w-5 h-5 text-primary-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Specifications</h3>
      </div>

      <div className="grid gap-3">
        {specifications.map((spec, index) => {
          const Icon = getIcon(spec.name);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-start gap-4 p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                <Icon className="w-4 h-4 text-dark-400 group-hover:text-primary-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-400">{spec.name}</p>
                <p className="text-white mt-0.5 break-words">{spec.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
