import { useState, useEffect, useCallback, useRef } from "react";
import { getTaskResult } from "../api/products";
import { showError } from "../utils/alerts";
import { getErrorMessage } from "../utils/utils";

const POLL_INTERVAL = 10;

const useTaskPolling = (startTask) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const clearTimers = () => {
    clearInterval(intervalRef.current);
    clearInterval(countdownRef.current);
  };

  const startCountdown = () => {
    setCountdown(POLL_INTERVAL);
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? POLL_INTERVAL : prev - 1));
    }, 1000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setProgress(0);
    setData(null);
    clearTimers();

    try {
      const taskId = await startTask();

      const pollTask = async () => {
        try {
          const { data: taskData } = await getTaskResult(taskId);
          if (taskData.meta?.current && taskData.meta?.total) {
            setProgress((taskData.meta.current / taskData.meta.total) * 100);
          }
          if (taskData.status === "SUCCESS") {
            setData(taskData.result);
            setLoading(false);
            setProgress(100);
            clearTimers();
          } else if (taskData.status === "FAILURE") {
            showError("Error", taskData.error?.message || "Error desconocido");
            setLoading(false);
            clearTimers();
          }
        } catch (error) {
          showError("Error", getErrorMessage(error));
          setLoading(false);
          clearTimers();
        }
      };

      pollTask();
      startCountdown();
      intervalRef.current = setInterval(() => {
        pollTask();
        startCountdown();
      }, POLL_INTERVAL * 1000);
    } catch (error) {
      showError("Error al cargar el tablero", getErrorMessage(error));
      setLoading(false);
    }
  }, [startTask]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return { data, loading, progress, countdown, fetchData };
};

export default useTaskPolling;
