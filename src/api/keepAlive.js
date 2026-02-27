import { useEffect } from "react";
import httpClient from "./httpClient";
import { getApiUrl } from "./utils";
import { logger } from "../utils/logger";

/**
 * Hook to keep server connection alive with periodic pings
 * Pings server every 3 minutes to prevent connection timeout
 */
export default function useKeepAlive() {
  useEffect(() => {
    const pingServer = () => {
      httpClient
        .get(getApiUrl("ping"))
        .then(res => logger.log("Ping:", res.data.status))
        .catch(err => logger.error("Ping error:", err));
    };

    pingServer();
    const interval = setInterval(pingServer, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}
