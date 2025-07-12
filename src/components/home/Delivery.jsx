import { Percent, Truck, Clock3, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const Delivery = () => {
  const services = [
    {
      id: 1,
      title: "Weekly Book Discounts",
      description: "New deals every week on your favorite books!",
      icon: <Percent size="2.5rem" className="text-yellow-400" />,
    },
    {
      id: 2,
      title: "Free Island-Wide Delivery",
      description: "100% free shipping on all book orders!",
      icon: <Truck size="2.5rem" className="text-yellow-400" />,
    },
    {
      id: 3,
      title: "24/7 Customer Support",
      description: "We're here to enhance your shopping experience!",
      icon: <Clock3 size="2.5rem" className="text-yellow-400" />,
    },
    {
      id: 4,
      title: "Secure Payment Options",
      description: "Shop with confidence using secure methods!",
      icon: <ShieldCheck size="2.5rem" className="text-yellow-400" />,
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="container mx-auto max-w-7xl bg-gradient-to-b from-white to-yellow-50 shadow-xl p-4 rounded-2xl my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {services.map((service) => (
          <motion.div
            key={service.id}
            className="delivery_wrapper flex items-start gap-2 p-3 bg-white hover:bg-yellow-100 transition duration-300 rounded-xl shadow-sm hover:shadow-md"
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
          >
            {service.icon}
            <div>
              <h4 className="text-base text-gray-800 font-semibold capitalize mb-1">
                {service.title}
              </h4>
              <p className="text-sm text-gray-600 leading-snug">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Delivery;
