// src/hooks/useKeepAlive.js
import { useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "./utils";
import { logger } from "../utils/logger";

export default function useKeepAlive() {
  useEffect(() => {
    const pingServer = () => {
      axios
        .get(getApiUrl("ping"))
        .then(res => logger.log("Ping:", res.data.status))
        .catch(err => logger.error("Ping error:", err));
    };

    pingServer(); // primer ping inmediato
    const interval = setInterval(pingServer, 3 * 60 * 1000); // cada 3 minutos

    return () => clearInterval(interval); // cleanup al desmontar
  }, []);
}
