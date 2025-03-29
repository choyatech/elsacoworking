import { motion, AnimatePresence } from "framer-motion";
import type { Key } from "react";
import { marked } from "marked";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const Notifications = ({ notifications }: any) => {
  return (
    <div className="p-4">
      <motion.ul>
        <AnimatePresence>
          {notifications.map(
            (notification: {
              $id: Key | null | undefined;
              message: string;
              $createdAt: string;
            }) => (
              <motion.li
                key={notification.$id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <NotificationItem
                  message={notification.message}
                  createdAt={notification.$createdAt}
                />
              </motion.li>
            )
          )}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
};

export const NotificationItem = ({
  message,
  createdAt,
}: {
  message: string;
  createdAt: string;
}) => {
  const html = marked.parse(message);
  return (
    <div className="p-4 border border-gray-200 rounded mb-2 bg-white shadow">
      <h3
        className="prose prose-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <time className="text-gray-500 text-xs">
        {new Date(createdAt).toLocaleDateString()}
      </time>
    </div>
  );
};

export const NotificationsSettings = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Configuración de Notificaciones
      </h2>
      {/* Aquí puedes agregar la configuración de notificaciones */}
    </div>
  );
};
